"""
Item models

Pydantic models for the items API.
"""

from typing import Optional
from pydantic import BaseModel


class ItemCreate(BaseModel):
    """Request model for creating/updating an item."""
    name: str
    description: Optional[str] = None


class Item(BaseModel):
    """Response model for an item."""
    id: str
    name: str
    description: Optional[str] = None
    created_at: str
    user_id: str


class ItemList(BaseModel):
    """Paginated list of items."""
    items: list[Item]
    total: int
    page: int
    limit: int
