"""
Loan models

Pydantic models for the loans API.
"""

from typing import Optional, Literal
from pydantic import BaseModel, Field


LoanStatus = Literal["requested", "active", "returned", "cancelled"]


class LoanRequest(BaseModel):
    """Request model for requesting to borrow an item."""
    item_id: str
    bubble_id: str
    notes: Optional[str] = Field(None, max_length=500)


class LoanUpdate(BaseModel):
    """Request model for updating a loan status."""
    status: LoanStatus
    notes: Optional[str] = Field(None, max_length=500)


class UserRef(BaseModel):
    """Reference to a user."""
    id: str
    display_name: str
    username: Optional[str] = None
    avatar_url: Optional[str] = None


class ItemRef(BaseModel):
    """Reference to an item."""
    id: str
    name: str
    description: Optional[str] = None


class BubbleRefSimple(BaseModel):
    """Simple reference to a bubble."""
    id: str
    name: str


class Loan(BaseModel):
    """Response model for a loan."""
    id: str
    item_id: str
    borrower_id: str
    bubble_id: str
    status: LoanStatus
    requested_at: str
    lent_at: Optional[str] = None
    returned_at: Optional[str] = None
    notes: Optional[str] = None


class LoanWithDetails(Loan):
    """Loan with full entity details."""
    item: ItemRef
    borrower: UserRef
    bubble: BubbleRefSimple
    owner: UserRef  # Item owner


class LoanList(BaseModel):
    """List of loans."""
    loans: list[LoanWithDetails]
    total: int
