"""
Pydantic models for the API.
"""

from models.item import (
    Item,
    ItemCreate,
    ItemUpdate,
    ItemList,
    ItemWithShares,
    ItemShare,
    BubbleRef,
)
from models.user import (
    UserProfile,
    UserProfileUpdate,
    UsernameCheck,
)
from models.bubble import (
    Bubble,
    BubbleCreate,
    BubbleUpdate,
    BubbleList,
    BubbleWithMembers,
    BubbleMember,
    BubbleInvite,
    MemberRef,
    UpdateMemberRole,
)
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

__all__ = [
    # Items
    "Item",
    "ItemCreate",
    "ItemUpdate",
    "ItemList",
    "ItemWithShares",
    "ItemShare",
    "BubbleRef",
    # Users
    "UserProfile",
    "UserProfileUpdate",
    "UsernameCheck",
    # Bubbles
    "Bubble",
    "BubbleCreate",
    "BubbleUpdate",
    "BubbleList",
    "BubbleWithMembers",
    "BubbleMember",
    "BubbleInvite",
    "MemberRef",
    "UpdateMemberRole",
    # Loans
    "Loan",
    "LoanRequest",
    "LoanUpdate",
    "LoanList",
    "LoanWithDetails",
    "UserRef",
    "ItemRef",
    "BubbleRefSimple",
]
