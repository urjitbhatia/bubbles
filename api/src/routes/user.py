"""
User API endpoints

Operations for user profile management.
"""

from fastapi import APIRouter, HTTPException

from dependencies import CurrentUser
from models.user import UserProfile, UserProfileUpdate, UsernameCheck


router = APIRouter()


@router.get("/me", response_model=UserProfile)
async def get_current_user(current_user: CurrentUser):
    """Get the current user's profile."""
    user_id, client = current_user

    response = (
        client.table("users")
        .select("*")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    return UserProfile(**response.data)


@router.patch("/me", response_model=UserProfile)
async def update_current_user(profile: UserProfileUpdate, current_user: CurrentUser):
    """Update the current user's profile."""
    user_id, client = current_user

    update_data = {}
    if profile.display_name is not None:
        update_data["display_name"] = profile.display_name
    if profile.username is not None:
        # Check username availability
        existing = (
            client.table("users")
            .select("id")
            .eq("username", profile.username)
            .neq("id", user_id)
            .execute()
        )

        if existing.data:
            raise HTTPException(status_code=400, detail="Username already taken")

        update_data["username"] = profile.username

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    response = (
        client.table("users")
        .update(update_data)
        .eq("id", user_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    return UserProfile(**response.data[0])


@router.get("/check-username/{username}", response_model=UsernameCheck)
async def check_username(username: str, current_user: CurrentUser):
    """Check if a username is available."""
    user_id, client = current_user

    existing = (
        client.table("users")
        .select("id")
        .eq("username", username)
        .neq("id", user_id)
        .execute()
    )

    return UsernameCheck(username=username, available=len(existing.data) == 0)


@router.post("/setup", response_model=UserProfile, status_code=201)
async def setup_profile(profile: UserProfileUpdate, current_user: CurrentUser):
    """
    Initial profile setup for new users.

    Creates a user profile if it doesn't exist.
    """
    user_id, client = current_user

    # Check if profile already exists
    existing = (
        client.table("users")
        .select("id")
        .eq("id", user_id)
        .execute()
    )

    if existing.data:
        # Profile exists, update it
        return await update_current_user(profile, current_user)

    # Create new profile
    if not profile.display_name:
        raise HTTPException(status_code=400, detail="display_name is required for new profiles")

    # Check username if provided
    if profile.username:
        username_check = (
            client.table("users")
            .select("id")
            .eq("username", profile.username)
            .execute()
        )

        if username_check.data:
            raise HTTPException(status_code=400, detail="Username already taken")

    new_profile = {
        "id": user_id,
        "display_name": profile.display_name,
        "username": profile.username,
    }

    response = client.table("users").insert(new_profile).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create profile")

    return UserProfile(**response.data[0])
