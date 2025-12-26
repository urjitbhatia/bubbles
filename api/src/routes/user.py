"""
User API endpoints
"""

from fastapi import APIRouter

from ..dependencies import CurrentUser
from ..models.user import UserProfile


router = APIRouter()


@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: CurrentUser):
    """Get the current user's profile."""
    user_id, client = current_user

    # Query user profile from user_profiles table
    response = (
        client.table("user_profiles")
        .select("*")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not response.data:
        # Return basic profile if no extended profile exists
        return UserProfile(
            id=user_id,
            email="",  # Would need to fetch from auth.users
            full_name=None,
            created_at="",
        )

    return UserProfile(**response.data)
