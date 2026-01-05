"""
Bubbles API endpoints

CRUD operations for bubbles (trusted groups).
"""

from uuid import uuid4
from secrets import token_hex

from fastapi import APIRouter, HTTPException

from dependencies import CurrentUser
from models.bubble import (
    Bubble,
    BubbleCreate,
    BubbleUpdate,
    BubbleList,
    BubbleWithMembers,
    BubbleInvite,
    MemberRef,
    UpdateMemberRole,
)


router = APIRouter()


def _get_bubble_with_members(bubble_data: dict, members_data: list, user_id: str) -> BubbleWithMembers:
    """Helper to construct BubbleWithMembers from raw data."""
    members = [
        MemberRef(
            id=m["user_id"],
            display_name=m["users"]["display_name"],
            username=m["users"].get("username"),
            avatar_url=m["users"].get("avatar_url"),
            role=m["role"],
            joined_at=m["joined_at"],
        )
        for m in members_data
    ]

    user_member = next((m for m in members_data if m["user_id"] == user_id), None)
    is_admin = user_member["role"] == "admin" if user_member else False

    return BubbleWithMembers(
        id=bubble_data["id"],
        name=bubble_data["name"],
        description=bubble_data.get("description"),
        invite_code=bubble_data["invite_code"],
        created_by=bubble_data["created_by"],
        created_at=bubble_data["created_at"],
        members=members,
        member_count=len(members),
        is_admin=is_admin,
    )


@router.get("", response_model=BubbleList)
async def list_bubbles(current_user: CurrentUser):
    """
    List all bubbles the current user is a member of.
    """
    user_id, client = current_user

    # Get bubble IDs where user is a member
    memberships = (
        client.table("bubble_members")
        .select("bubble_id")
        .eq("user_id", user_id)
        .execute()
    )

    bubble_ids = [m["bubble_id"] for m in memberships.data]

    if not bubble_ids:
        return BubbleList(bubbles=[], total=0)

    # Get bubbles with their members
    bubbles_response = (
        client.table("bubbles")
        .select("*")
        .in_("id", bubble_ids)
        .order("created_at", desc=True)
        .execute()
    )

    bubbles_with_members = []
    for bubble in bubbles_response.data:
        # Get members for this bubble
        members_response = (
            client.table("bubble_members")
            .select("user_id, role, joined_at, users(display_name, username, avatar_url)")
            .eq("bubble_id", bubble["id"])
            .execute()
        )

        bubbles_with_members.append(
            _get_bubble_with_members(bubble, members_response.data, user_id)
        )

    return BubbleList(bubbles=bubbles_with_members, total=len(bubbles_with_members))


@router.get("/{bubble_id}", response_model=BubbleWithMembers)
async def get_bubble(bubble_id: str, current_user: CurrentUser):
    """Get a specific bubble by ID."""
    user_id, client = current_user

    # Verify user is a member
    membership = (
        client.table("bubble_members")
        .select("role")
        .eq("bubble_id", bubble_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not membership.data:
        raise HTTPException(status_code=404, detail="Bubble not found")

    # Get bubble
    bubble_response = (
        client.table("bubbles")
        .select("*")
        .eq("id", bubble_id)
        .single()
        .execute()
    )

    if not bubble_response.data:
        raise HTTPException(status_code=404, detail="Bubble not found")

    # Get members
    members_response = (
        client.table("bubble_members")
        .select("user_id, role, joined_at, users(display_name, username, avatar_url)")
        .eq("bubble_id", bubble_id)
        .execute()
    )

    return _get_bubble_with_members(bubble_response.data, members_response.data, user_id)


@router.post("", response_model=BubbleWithMembers, status_code=201)
async def create_bubble(bubble: BubbleCreate, current_user: CurrentUser):
    """Create a new bubble."""
    user_id, client = current_user

    bubble_id = str(uuid4())
    invite_code = token_hex(6).upper()  # 12 char hex code

    new_bubble = {
        "id": bubble_id,
        "name": bubble.name,
        "description": bubble.description,
        "invite_code": invite_code,
        "created_by": user_id,
    }

    bubble_response = client.table("bubbles").insert(new_bubble).execute()

    if not bubble_response.data:
        raise HTTPException(status_code=500, detail="Failed to create bubble")

    # Add creator as admin
    client.table("bubble_members").insert({
        "bubble_id": bubble_id,
        "user_id": user_id,
        "role": "admin",
    }).execute()

    # Get user info for member list
    user_response = (
        client.table("users")
        .select("display_name, username, avatar_url")
        .eq("id", user_id)
        .single()
        .execute()
    )

    return BubbleWithMembers(
        id=bubble_id,
        name=bubble.name,
        description=bubble.description,
        invite_code=invite_code,
        created_by=user_id,
        created_at=bubble_response.data[0]["created_at"],
        members=[
            MemberRef(
                id=user_id,
                display_name=user_response.data["display_name"],
                username=user_response.data.get("username"),
                avatar_url=user_response.data.get("avatar_url"),
                role="admin",
                joined_at=bubble_response.data[0]["created_at"],
            )
        ],
        member_count=1,
        is_admin=True,
    )


@router.patch("/{bubble_id}", response_model=Bubble)
async def update_bubble(bubble_id: str, bubble: BubbleUpdate, current_user: CurrentUser):
    """Update a bubble (admin only)."""
    user_id, client = current_user

    # Verify user is admin
    membership = (
        client.table("bubble_members")
        .select("role")
        .eq("bubble_id", bubble_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not membership.data or membership.data["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    update_data = {}
    if bubble.name is not None:
        update_data["name"] = bubble.name
    if bubble.description is not None:
        update_data["description"] = bubble.description

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    response = (
        client.table("bubbles")
        .update(update_data)
        .eq("id", bubble_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Bubble not found")

    return Bubble(**response.data[0])


@router.delete("/{bubble_id}", status_code=204)
async def delete_bubble(bubble_id: str, current_user: CurrentUser):
    """Delete a bubble (admin only)."""
    user_id, client = current_user

    # Verify user is admin
    membership = (
        client.table("bubble_members")
        .select("role")
        .eq("bubble_id", bubble_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not membership.data or membership.data["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    response = client.table("bubbles").delete().eq("id", bubble_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Bubble not found")


@router.post("/join/{invite_code}", response_model=BubbleInvite)
async def join_bubble(invite_code: str, current_user: CurrentUser):
    """Join a bubble using an invite code."""
    user_id, client = current_user

    # Find bubble by invite code
    bubble_response = (
        client.table("bubbles")
        .select("*")
        .eq("invite_code", invite_code.upper())
        .single()
        .execute()
    )

    if not bubble_response.data:
        raise HTTPException(status_code=404, detail="Invalid invite code")

    bubble = bubble_response.data

    # Check if already a member
    existing = (
        client.table("bubble_members")
        .select("user_id")
        .eq("bubble_id", bubble["id"])
        .eq("user_id", user_id)
        .execute()
    )

    if existing.data:
        raise HTTPException(status_code=400, detail="Already a member of this bubble")

    # Add as member
    client.table("bubble_members").insert({
        "bubble_id": bubble["id"],
        "user_id": user_id,
        "role": "member",
    }).execute()

    return BubbleInvite(
        bubble=Bubble(**bubble),
        message=f"Successfully joined {bubble['name']}!",
    )


@router.post("/{bubble_id}/regenerate-code", response_model=Bubble)
async def regenerate_invite_code(bubble_id: str, current_user: CurrentUser):
    """Regenerate the invite code for a bubble (admin only)."""
    user_id, client = current_user

    # Verify user is admin
    membership = (
        client.table("bubble_members")
        .select("role")
        .eq("bubble_id", bubble_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not membership.data or membership.data["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    new_code = token_hex(6).upper()

    response = (
        client.table("bubbles")
        .update({"invite_code": new_code})
        .eq("id", bubble_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Bubble not found")

    return Bubble(**response.data[0])


@router.patch("/{bubble_id}/members/{member_id}", response_model=MemberRef)
async def update_member_role(
    bubble_id: str,
    member_id: str,
    update: UpdateMemberRole,
    current_user: CurrentUser,
):
    """Update a member's role (admin only)."""
    user_id, client = current_user

    # Verify user is admin
    membership = (
        client.table("bubble_members")
        .select("role")
        .eq("bubble_id", bubble_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not membership.data or membership.data["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    # Can't change own role
    if member_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")

    response = (
        client.table("bubble_members")
        .update({"role": update.role})
        .eq("bubble_id", bubble_id)
        .eq("user_id", member_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Member not found")

    # Get user info
    user_response = (
        client.table("users")
        .select("display_name, username, avatar_url")
        .eq("id", member_id)
        .single()
        .execute()
    )

    return MemberRef(
        id=member_id,
        display_name=user_response.data["display_name"],
        username=user_response.data.get("username"),
        avatar_url=user_response.data.get("avatar_url"),
        role=update.role,
        joined_at=response.data[0]["joined_at"],
    )


@router.delete("/{bubble_id}/members/{member_id}", status_code=204)
async def remove_member(bubble_id: str, member_id: str, current_user: CurrentUser):
    """Remove a member from a bubble (admin only, or self-remove)."""
    user_id, client = current_user

    # Check if removing self or if admin
    if member_id != user_id:
        membership = (
            client.table("bubble_members")
            .select("role")
            .eq("bubble_id", bubble_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if not membership.data or membership.data["role"] != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")

    # Prevent removing the last admin
    if member_id == user_id:
        admins = (
            client.table("bubble_members")
            .select("user_id")
            .eq("bubble_id", bubble_id)
            .eq("role", "admin")
            .execute()
        )

        if len(admins.data) == 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot leave: you are the only admin. Transfer admin role first."
            )

    response = (
        client.table("bubble_members")
        .delete()
        .eq("bubble_id", bubble_id)
        .eq("user_id", member_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Member not found")
