"""
Loans API endpoints

Operations for borrowing and lending items.
"""

from uuid import uuid4
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query

from dependencies import CurrentUser
from models.loan import (
    Loan,
    LoanRequest,
    LoanUpdate,
    LoanList,
    LoanWithDetails,
    UserRef,
    ItemRef,
    BubbleRefSimple,
)


router = APIRouter()


def _get_loan_with_details(loan_data: dict, item_data: dict, borrower_data: dict, bubble_data: dict, owner_data: dict) -> LoanWithDetails:
    """Helper to construct LoanWithDetails from raw data."""
    return LoanWithDetails(
        id=loan_data["id"],
        item_id=loan_data["item_id"],
        borrower_id=loan_data["borrower_id"],
        bubble_id=loan_data["bubble_id"],
        status=loan_data["status"],
        requested_at=loan_data["requested_at"],
        lent_at=loan_data.get("lent_at"),
        returned_at=loan_data.get("returned_at"),
        notes=loan_data.get("notes"),
        item=ItemRef(
            id=item_data["id"],
            name=item_data["name"],
            description=item_data.get("description"),
        ),
        borrower=UserRef(
            id=borrower_data["id"],
            display_name=borrower_data["display_name"],
            username=borrower_data.get("username"),
            avatar_url=borrower_data.get("avatar_url"),
        ),
        bubble=BubbleRefSimple(
            id=bubble_data["id"],
            name=bubble_data["name"],
        ),
        owner=UserRef(
            id=owner_data["id"],
            display_name=owner_data["display_name"],
            username=owner_data.get("username"),
            avatar_url=owner_data.get("avatar_url"),
        ),
    )


@router.get("", response_model=LoanList)
async def list_loans(
    current_user: CurrentUser,
    status: str = Query(None, description="Filter by status"),
    as_borrower: bool = Query(False, description="Show loans where I'm the borrower"),
    as_lender: bool = Query(False, description="Show loans where I'm the lender"),
):
    """
    List loans related to the current user.

    By default shows all loans (both as borrower and lender).
    Use as_borrower=true or as_lender=true to filter.
    """
    user_id, client = current_user

    # Build query
    query = client.table("loans").select(
        "*, items(id, name, description, owner_id), borrower:users!borrower_id(id, display_name, username, avatar_url), bubbles(id, name)"
    )

    if status:
        query = query.eq("status", status)

    # Get user's items for lender filtering
    if as_lender and not as_borrower:
        user_items = client.table("items").select("id").eq("owner_id", user_id).execute()
        item_ids = [i["id"] for i in user_items.data]
        if not item_ids:
            return LoanList(loans=[], total=0)
        query = query.in_("item_id", item_ids)
    elif as_borrower and not as_lender:
        query = query.eq("borrower_id", user_id)
    else:
        # Show both - loans where user is borrower OR owns the item
        user_items = client.table("items").select("id").eq("owner_id", user_id).execute()
        item_ids = [i["id"] for i in user_items.data]
        # This requires OR logic - we'll do two queries
        borrower_loans = (
            client.table("loans")
            .select("*, items(id, name, description, owner_id), borrower:users!borrower_id(id, display_name, username, avatar_url), bubbles(id, name)")
            .eq("borrower_id", user_id)
            .execute()
        )

        if item_ids:
            lender_loans = (
                client.table("loans")
                .select("*, items(id, name, description, owner_id), borrower:users!borrower_id(id, display_name, username, avatar_url), bubbles(id, name)")
                .in_("item_id", item_ids)
                .execute()
            )
        else:
            lender_loans = type('obj', (object,), {'data': []})()

        # Combine and dedupe
        all_loans = {l["id"]: l for l in borrower_loans.data}
        all_loans.update({l["id"]: l for l in lender_loans.data})
        loans_data = list(all_loans.values())

        # Sort by requested_at descending
        loans_data.sort(key=lambda x: x["requested_at"], reverse=True)

        # Build response
        loans_with_details = []
        for loan in loans_data:
            # Get owner info
            owner_response = (
                client.table("users")
                .select("id, display_name, username, avatar_url")
                .eq("id", loan["items"]["owner_id"])
                .single()
                .execute()
            )

            loans_with_details.append(_get_loan_with_details(
                loan,
                loan["items"],
                loan["borrower"],
                loan["bubbles"],
                owner_response.data,
            ))

        return LoanList(loans=loans_with_details, total=len(loans_with_details))

    # Execute single query
    query = query.order("requested_at", desc=True)
    response = query.execute()

    loans_with_details = []
    for loan in response.data:
        # Get owner info
        owner_response = (
            client.table("users")
            .select("id, display_name, username, avatar_url")
            .eq("id", loan["items"]["owner_id"])
            .single()
            .execute()
        )

        loans_with_details.append(_get_loan_with_details(
            loan,
            loan["items"],
            loan["borrower"],
            loan["bubbles"],
            owner_response.data,
        ))

    return LoanList(loans=loans_with_details, total=len(loans_with_details))


@router.get("/{loan_id}", response_model=LoanWithDetails)
async def get_loan(loan_id: str, current_user: CurrentUser):
    """Get a specific loan by ID."""
    user_id, client = current_user

    response = (
        client.table("loans")
        .select("*, items(id, name, description, owner_id), borrower:users!borrower_id(id, display_name, username, avatar_url), bubbles(id, name)")
        .eq("id", loan_id)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Loan not found")

    loan = response.data

    # Verify user is involved (borrower or item owner)
    if loan["borrower_id"] != user_id and loan["items"]["owner_id"] != user_id:
        raise HTTPException(status_code=404, detail="Loan not found")

    # Get owner info
    owner_response = (
        client.table("users")
        .select("id, display_name, username, avatar_url")
        .eq("id", loan["items"]["owner_id"])
        .single()
        .execute()
    )

    return _get_loan_with_details(
        loan,
        loan["items"],
        loan["borrower"],
        loan["bubbles"],
        owner_response.data,
    )


@router.post("", response_model=LoanWithDetails, status_code=201)
async def request_loan(loan_request: LoanRequest, current_user: CurrentUser):
    """Request to borrow an item."""
    user_id, client = current_user

    # Get item and verify it's shared to the specified bubble
    item_response = (
        client.table("items")
        .select("*")
        .eq("id", loan_request.item_id)
        .single()
        .execute()
    )

    if not item_response.data:
        raise HTTPException(status_code=404, detail="Item not found")

    item = item_response.data

    # Can't borrow your own item
    if item["owner_id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot borrow your own item")

    # Verify item is shared to the bubble
    share = (
        client.table("item_shares")
        .select("bubble_id")
        .eq("item_id", loan_request.item_id)
        .eq("bubble_id", loan_request.bubble_id)
        .single()
        .execute()
    )

    if not share.data:
        raise HTTPException(status_code=400, detail="Item is not shared to this bubble")

    # Verify user is member of the bubble
    membership = (
        client.table("bubble_members")
        .select("user_id")
        .eq("bubble_id", loan_request.bubble_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not membership.data:
        raise HTTPException(status_code=400, detail="Not a member of this bubble")

    # Check item availability (quantity - active loans)
    active_loans = (
        client.table("loans")
        .select("id", count="exact")
        .eq("item_id", loan_request.item_id)
        .eq("status", "active")
        .execute()
    )

    if (active_loans.count or 0) >= item["quantity"]:
        raise HTTPException(status_code=400, detail="Item is not available")

    # Check if user already has a pending or active loan for this item
    existing_loan = (
        client.table("loans")
        .select("id")
        .eq("item_id", loan_request.item_id)
        .eq("borrower_id", user_id)
        .in_("status", ["requested", "active"])
        .execute()
    )

    if existing_loan.data:
        raise HTTPException(status_code=400, detail="You already have an active or pending loan for this item")

    # Create loan
    new_loan = {
        "id": str(uuid4()),
        "item_id": loan_request.item_id,
        "borrower_id": user_id,
        "bubble_id": loan_request.bubble_id,
        "status": "requested",
        "notes": loan_request.notes,
    }

    loan_response = client.table("loans").insert(new_loan).execute()

    if not loan_response.data:
        raise HTTPException(status_code=500, detail="Failed to create loan request")

    # Get full details for response
    borrower_response = (
        client.table("users")
        .select("id, display_name, username, avatar_url")
        .eq("id", user_id)
        .single()
        .execute()
    )

    bubble_response = (
        client.table("bubbles")
        .select("id, name")
        .eq("id", loan_request.bubble_id)
        .single()
        .execute()
    )

    owner_response = (
        client.table("users")
        .select("id, display_name, username, avatar_url")
        .eq("id", item["owner_id"])
        .single()
        .execute()
    )

    return _get_loan_with_details(
        loan_response.data[0],
        item,
        borrower_response.data,
        bubble_response.data,
        owner_response.data,
    )


@router.patch("/{loan_id}", response_model=LoanWithDetails)
async def update_loan(loan_id: str, update: LoanUpdate, current_user: CurrentUser):
    """
    Update a loan status.

    - Owner can: approve (requested -> active), mark returned (active -> returned)
    - Borrower can: cancel (requested -> cancelled), mark returned (active -> returned)
    """
    user_id, client = current_user

    # Get loan with item info
    loan_response = (
        client.table("loans")
        .select("*, items(owner_id)")
        .eq("id", loan_id)
        .single()
        .execute()
    )

    if not loan_response.data:
        raise HTTPException(status_code=404, detail="Loan not found")

    loan = loan_response.data
    is_owner = loan["items"]["owner_id"] == user_id
    is_borrower = loan["borrower_id"] == user_id

    if not is_owner and not is_borrower:
        raise HTTPException(status_code=404, detail="Loan not found")

    current_status = loan["status"]
    new_status = update.status

    # Validate state transitions
    valid_transitions = {
        "requested": {
            "active": is_owner,  # Owner approves
            "cancelled": is_borrower,  # Borrower cancels
        },
        "active": {
            "returned": is_owner or is_borrower,  # Either can mark returned
        },
    }

    if current_status not in valid_transitions:
        raise HTTPException(status_code=400, detail=f"Cannot update loan with status '{current_status}'")

    if new_status not in valid_transitions[current_status]:
        raise HTTPException(status_code=400, detail=f"Invalid status transition from '{current_status}' to '{new_status}'")

    if not valid_transitions[current_status][new_status]:
        raise HTTPException(status_code=403, detail="You don't have permission for this action")

    # Build update
    update_data = {"status": new_status}

    if update.notes is not None:
        update_data["notes"] = update.notes

    if new_status == "active":
        update_data["lent_at"] = datetime.now(timezone.utc).isoformat()
    elif new_status == "returned":
        update_data["returned_at"] = datetime.now(timezone.utc).isoformat()

    response = (
        client.table("loans")
        .update(update_data)
        .eq("id", loan_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update loan")

    # Get full loan details for response
    full_loan = (
        client.table("loans")
        .select("*, items(id, name, description, owner_id), borrower:users!borrower_id(id, display_name, username, avatar_url), bubbles(id, name)")
        .eq("id", loan_id)
        .single()
        .execute()
    )

    owner_response = (
        client.table("users")
        .select("id, display_name, username, avatar_url")
        .eq("id", full_loan.data["items"]["owner_id"])
        .single()
        .execute()
    )

    return _get_loan_with_details(
        full_loan.data,
        full_loan.data["items"],
        full_loan.data["borrower"],
        full_loan.data["bubbles"],
        owner_response.data,
    )
