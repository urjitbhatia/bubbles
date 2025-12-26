"""
Items API endpoints

Example CRUD operations with Supabase and RLS.
"""

from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query

from dependencies import CurrentUser
from models.item import Item, ItemCreate, ItemList


router = APIRouter()


@router.get("", response_model=ItemList)
async def list_items(
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """
    List items for the current user.

    Items are filtered by RLS to only show the user's own items.
    """
    user_id, client = current_user
    offset = (page - 1) * limit

    # Query items with pagination
    response = (
        client.table("items")
        .select("*", count="exact")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )

    return ItemList(
        items=[Item(**item) for item in response.data],
        total=response.count or 0,
        page=page,
        limit=limit,
    )


@router.get("/{item_id}", response_model=Item)
async def get_item(
    item_id: str,
    current_user: CurrentUser,
):
    """Get a specific item by ID."""
    user_id, client = current_user

    response = client.table("items").select("*").eq("id", item_id).single().execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Item not found")

    return Item(**response.data)


@router.post("", response_model=Item, status_code=201)
async def create_item(
    item: ItemCreate,
    current_user: CurrentUser,
):
    """Create a new item."""
    user_id, client = current_user

    new_item = {
        "id": str(uuid4()),
        "name": item.name,
        "description": item.description,
        "user_id": user_id,
    }

    response = client.table("items").insert(new_item).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create item")

    return Item(**response.data[0])


@router.patch("/{item_id}", response_model=Item)
async def update_item(
    item_id: str,
    item: ItemCreate,
    current_user: CurrentUser,
):
    """Update an existing item."""
    user_id, client = current_user

    update_data = {"name": item.name}
    if item.description is not None:
        update_data["description"] = item.description

    response = (
        client.table("items")
        .update(update_data)
        .eq("id", item_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Item not found")

    return Item(**response.data[0])


@router.delete("/{item_id}", status_code=204)
async def delete_item(
    item_id: str,
    current_user: CurrentUser,
):
    """Delete an item."""
    user_id, client = current_user

    response = client.table("items").delete().eq("id", item_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Item not found")
