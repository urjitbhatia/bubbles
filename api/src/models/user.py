"""
User models

Pydantic models for user-related operations.
"""

from typing import Optional
from pydantic import BaseModel


class UserProfile(BaseModel):
    """User profile response model."""
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: str
