"""
Items API endpoints

CRUD operations for user inventory items.
"""

from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query
from postgrest.exceptions import APIError

from dependencies import CurrentUser
from errors import handle_db_error
from models.item import (
    Item,
    ItemCreate,
    ItemUpdate,
    ItemList,
    ItemWithShares,
    ItemShare,
    BubbleRef,
)


router = APIRouter()


def _get_item_with_shares(item_data: dict, shares_data: list, active_loans_count: int = 0) -> ItemWithShares:
    """Helper to construct ItemWithShares from raw data."""
    shared_bubbles = [
        BubbleRef(id=s["bubble_id"], name=s["bubbles"]["name"])
        for s in shares_data
    ]

    return ItemWithShares(
        id=item_data["id"],
        owner_id=item_data["owner_id"],
        name=item_data["name"],
        description=item_data.get("description"),
        quantity=item_data["quantity"],
        created_at=item_data["created_at"],
        shared_bubbles=shared_bubbles,
        available_quantity=max(0, item_data["quantity"] - active_loans_count),
    )


@router.get("", response_model=ItemList)
async def list_items(
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    """
    List items for the current user.
    """
    user_id, client = current_user
    offset = (page - 1) * limit

    try:
        # Query items with pagination
        response = (
            client.table("items")
            .select("*", count="exact")
            .eq("owner_id", user_id)
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )

        items_with_shares = []
        for item in response.data:
            # Get shares for this item
            shares_response = (
                client.table("item_shares")
                .select("bubble_id, bubbles(name)")
                .eq("item_id", item["id"])
                .execute()
            )

            # Count active loans
            loans_response = (
                client.table("loans")
                .select("id", count="exact")
                .eq("item_id", item["id"])
                .eq("status", "active")
                .execute()
            )

            items_with_shares.append(
                _get_item_with_shares(item, shares_response.data, loans_response.count or 0)
            )

        return ItemList(
            items=items_with_shares,
            total=response.count or 0,
            page=page,
            limit=limit,
        )
    except APIError as e:
        raise handle_db_error(e, "listing items")


@router.get("/{item_id}", response_model=ItemWithShares)
async def get_item(item_id: str, current_user: CurrentUser):
    """Get a specific item by ID."""
    user_id, client = current_user

    try:
        response = (
            client.table("items")
            .select("*")
            .eq("id", item_id)
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found")

        item = response.data

        # Check if user owns this item or is in a bubble it's shared to
        if item["owner_id"] != user_id:
            # Check if shared to a bubble user is in
            shares = (
                client.table("item_shares")
                .select("bubble_id")
                .eq("item_id", item_id)
                .execute()
            )
            bubble_ids = [s["bubble_id"] for s in shares.data]

            if bubble_ids:
                memberships = (
                    client.table("bubble_members")
                    .select("bubble_id")
                    .eq("user_id", user_id)
                    .in_("bubble_id", bubble_ids)
                    .execute()
                )

                if not memberships.data:
                    raise HTTPException(status_code=404, detail="Item not found")
            else:
                raise HTTPException(status_code=404, detail="Item not found")

        # Get shares
        shares_response = (
            client.table("item_shares")
            .select("bubble_id, bubbles(name)")
            .eq("item_id", item_id)
            .execute()
        )

        # Count active loans
        loans_response = (
            client.table("loans")
            .select("id", count="exact")
            .eq("item_id", item_id)
            .eq("status", "active")
            .execute()
        )

        return _get_item_with_shares(item, shares_response.data, loans_response.count or 0)
    except APIError as e:
        raise handle_db_error(e, "getting item")


@router.post("", response_model=ItemWithShares, status_code=201)
async def create_item(item: ItemCreate, current_user: CurrentUser):
    """Create a new item."""
    user_id, client = current_user

    # First verify user has a profile
    try:
        profile_check = (
            client.table("users")
            .select("id")
            .eq("id", user_id)
            .execute()
        )

        if not profile_check.data:
            raise HTTPException(
                status_code=400,
                detail="Profile not found. Please complete your profile setup first."
            )
    except APIError as e:
        raise handle_db_error(e, "checking user profile")

    new_item = {
        "id": str(uuid4()),
        "name": item.name,
        "description": item.description,
        "quantity": item.quantity,
        "owner_id": user_id,
    }

    try:
        response = client.table("items").insert(new_item).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create item")

        return ItemWithShares(
            **response.data[0],
            shared_bubbles=[],
            available_quantity=item.quantity,
        )
    except APIError as e:
        raise handle_db_error(e, "creating item")


@router.patch("/{item_id}", response_model=ItemWithShares)
async def update_item(item_id: str, item: ItemUpdate, current_user: CurrentUser):
    """Update an existing item (owner only)."""
    user_id, client = current_user

    try:
        # Verify ownership
        existing = (
            client.table("items")
            .select("owner_id")
            .eq("id", item_id)
            .single()
            .execute()
        )

        if not existing.data:
            raise HTTPException(status_code=404, detail="Item not found")

        if existing.data["owner_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not the item owner")

        update_data = {}
        if item.name is not None:
            update_data["name"] = item.name
        if item.description is not None:
            update_data["description"] = item.description
        if item.quantity is not None:
            update_data["quantity"] = item.quantity

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        response = (
            client.table("items")
            .update(update_data)
            .eq("id", item_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found")

        # Get shares
        shares_response = (
            client.table("item_shares")
            .select("bubble_id, bubbles(name)")
            .eq("item_id", item_id)
            .execute()
        )

        # Count active loans
        loans_response = (
            client.table("loans")
            .select("id", count="exact")
            .eq("item_id", item_id)
            .eq("status", "active")
            .execute()
        )

        return _get_item_with_shares(response.data[0], shares_response.data, loans_response.count or 0)
    except APIError as e:
        raise handle_db_error(e, "updating item")


@router.delete("/{item_id}", status_code=204)
async def delete_item(item_id: str, current_user: CurrentUser):
    """Delete an item (owner only)."""
    user_id, client = current_user

    try:
        # Verify ownership
        existing = (
            client.table("items")
            .select("owner_id")
            .eq("id", item_id)
            .single()
            .execute()
        )

        if not existing.data:
            raise HTTPException(status_code=404, detail="Item not found")

        if existing.data["owner_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not the item owner")

        # Check for active loans
        active_loans = (
            client.table("loans")
            .select("id", count="exact")
            .eq("item_id", item_id)
            .eq("status", "active")
            .execute()
        )

        if active_loans.count and active_loans.count > 0:
            raise HTTPException(status_code=400, detail="Cannot delete item with active loans")

        response = client.table("items").delete().eq("id", item_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found")
    except APIError as e:
        raise handle_db_error(e, "deleting item")


@router.post("/{item_id}/share", response_model=ItemWithShares)
async def share_item(item_id: str, share: ItemShare, current_user: CurrentUser):
    """Share an item to specified bubbles (replaces existing shares)."""
    user_id, client = current_user

    try:
        # Verify ownership
        existing = (
            client.table("items")
            .select("*")
            .eq("id", item_id)
            .single()
            .execute()
        )

        if not existing.data:
            raise HTTPException(status_code=404, detail="Item not found")

        if existing.data["owner_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not the item owner")

        # Verify user is member of all specified bubbles
        if share.bubble_ids:
            memberships = (
                client.table("bubble_members")
                .select("bubble_id")
                .eq("user_id", user_id)
                .in_("bubble_id", share.bubble_ids)
                .execute()
            )

            member_bubble_ids = {m["bubble_id"] for m in memberships.data}
            invalid_bubbles = set(share.bubble_ids) - member_bubble_ids

            if invalid_bubbles:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not a member of bubbles: {', '.join(invalid_bubbles)}"
                )

        # Remove existing shares
        client.table("item_shares").delete().eq("item_id", item_id).execute()

        # Add new shares
        if share.bubble_ids:
            new_shares = [
                {"item_id": item_id, "bubble_id": bubble_id}
                for bubble_id in share.bubble_ids
            ]
            client.table("item_shares").insert(new_shares).execute()

        # Return updated item
        shares_response = (
            client.table("item_shares")
            .select("bubble_id, bubbles(name)")
            .eq("item_id", item_id)
            .execute()
        )

        loans_response = (
            client.table("loans")
            .select("id", count="exact")
            .eq("item_id", item_id)
            .eq("status", "active")
            .execute()
        )

        return _get_item_with_shares(existing.data, shares_response.data, loans_response.count or 0)
    except APIError as e:
        raise handle_db_error(e, "sharing item")
