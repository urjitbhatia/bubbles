"""
Bubble models

Pydantic models for the bubbles API.
"""

from typing import Optional, Literal
from pydantic import BaseModel, Field


class BubbleCreate(BaseModel):
    """Request model for creating a bubble."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class BubbleUpdate(BaseModel):
    """Request model for updating a bubble."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class MemberRef(BaseModel):
    """Reference to a member in a bubble."""
    id: str
    display_name: str
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Literal["admin", "member"]
    joined_at: str


class Bubble(BaseModel):
    """Response model for a bubble."""
    id: str
    name: str
    description: Optional[str] = None
    invite_code: str
    created_by: str
    created_at: str


class BubbleWithMembers(Bubble):
    """Bubble with member information."""
    members: list[MemberRef] = []
    member_count: int = 0
    is_admin: bool = False


class BubbleList(BaseModel):
    """List of bubbles."""
    bubbles: list[BubbleWithMembers]
    total: int


class BubbleMember(BaseModel):
    """Response model for a bubble member."""
    bubble_id: str
    user_id: str
    role: Literal["admin", "member"]
    joined_at: str


class BubbleInvite(BaseModel):
    """Response for joining via invite code."""
    bubble: Bubble
    message: str


class UpdateMemberRole(BaseModel):
    """Request model for updating a member's role."""
    role: Literal["admin", "member"]
