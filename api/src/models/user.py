"""
User models

Pydantic models for user-related operations.
"""

from typing import Optional
from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    """User profile response model."""
    id: str
    display_name: str
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: str


class UserProfileUpdate(BaseModel):
    """Request model for updating user profile."""
    display_name: Optional[str] = Field(None, min_length=1, max_length=100)
    username: Optional[str] = Field(None, min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")


class UsernameCheck(BaseModel):
    """Response for username availability check."""
    username: str
    available: bool
