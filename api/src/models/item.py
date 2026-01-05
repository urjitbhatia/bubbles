"""
Item models

Pydantic models for the items API.
"""

from typing import Optional
from pydantic import BaseModel, Field


class ItemCreate(BaseModel):
    """Request model for creating an item."""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    quantity: int = Field(1, ge=1)


class ItemUpdate(BaseModel):
    """Request model for updating an item."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    quantity: Optional[int] = Field(None, ge=1)


class BubbleRef(BaseModel):
    """Reference to a bubble."""
    id: str
    name: str


class Item(BaseModel):
    """Response model for an item."""
    id: str
    owner_id: str
    name: str
    description: Optional[str] = None
    quantity: int = 1
    created_at: str


class ItemWithShares(Item):
    """Item with shared bubbles info."""
    shared_bubbles: list[BubbleRef] = []
    available_quantity: int = 0  # quantity minus active loans


class ItemList(BaseModel):
    """Paginated list of items."""
    items: list[ItemWithShares]
    total: int
    page: int
    limit: int


class ItemShare(BaseModel):
    """Request model for sharing an item to bubbles."""
    bubble_ids: list[str]
