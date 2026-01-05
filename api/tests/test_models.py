"""
Unit tests for Pydantic models.
"""

import pytest
from pydantic import ValidationError

from models.item import Item, ItemCreate, ItemList, ItemWithShares, BubbleRef
from models.user import UserProfile


class TestItemModels:
    """Tests for Item models."""

    def test_item_create_minimal(self):
        """ItemCreate works with just name."""
        item = ItemCreate(name="Test Item")
        assert item.name == "Test Item"
        assert item.description is None
        assert item.quantity == 1  # Default value

    def test_item_create_full(self):
        """ItemCreate works with all fields."""
        item = ItemCreate(name="Test Item", description="A test description", quantity=5)
        assert item.name == "Test Item"
        assert item.description == "A test description"
        assert item.quantity == 5

    def test_item_create_requires_name(self):
        """ItemCreate requires name field."""
        with pytest.raises(ValidationError):
            ItemCreate()

    def test_item_create_quantity_must_be_positive(self):
        """ItemCreate quantity must be >= 1."""
        with pytest.raises(ValidationError):
            ItemCreate(name="Test", quantity=0)

    def test_item_create_negative_quantity_rejected(self):
        """ItemCreate rejects negative quantity."""
        with pytest.raises(ValidationError):
            ItemCreate(name="Test", quantity=-1)

    def test_item_full(self):
        """Item model with all fields."""
        item = Item(
            id="123",
            name="Test Item",
            description="Description",
            quantity=2,
            created_at="2024-01-01T00:00:00Z",
            owner_id="user-456",
        )
        assert item.id == "123"
        assert item.name == "Test Item"
        assert item.owner_id == "user-456"
        assert item.quantity == 2

    def test_item_with_shares(self):
        """ItemWithShares model with shared bubbles."""
        item = ItemWithShares(
            id="item-123",
            name="Shared Item",
            owner_id="user-456",
            created_at="2024-01-01T00:00:00Z",
            quantity=3,
            available_quantity=2,
            shared_bubbles=[
                BubbleRef(id="bubble-1", name="Friends"),
                BubbleRef(id="bubble-2", name="Family"),
            ],
        )
        assert len(item.shared_bubbles) == 2
        assert item.available_quantity == 2
        assert item.shared_bubbles[0].name == "Friends"

    def test_item_list(self):
        """ItemList pagination model."""
        items = [
            ItemWithShares(
                id=f"item-{i}",
                name=f"Item {i}",
                created_at="2024-01-01T00:00:00Z",
                owner_id="user-123",
                quantity=1,
                available_quantity=1,
                shared_bubbles=[],
            )
            for i in range(3)
        ]
        item_list = ItemList(items=items, total=10, page=1, limit=3)

        assert len(item_list.items) == 3
        assert item_list.total == 10
        assert item_list.page == 1
        assert item_list.limit == 3


class TestUserModels:
    """Tests for User models."""

    def test_user_profile(self):
        """UserProfile model with required fields."""
        profile = UserProfile(
            id="user-123",
            display_name="Test User",
            created_at="2024-01-01T00:00:00Z",
        )
        assert profile.id == "user-123"
        assert profile.display_name == "Test User"
        assert profile.username is None
        assert profile.avatar_url is None

    def test_user_profile_full(self):
        """UserProfile model with all fields."""
        profile = UserProfile(
            id="user-123",
            display_name="Test User",
            username="testuser",
            avatar_url="https://example.com/avatar.jpg",
            created_at="2024-01-01T00:00:00Z",
        )
        assert profile.display_name == "Test User"
        assert profile.username == "testuser"
        assert profile.avatar_url == "https://example.com/avatar.jpg"

    def test_user_profile_requires_display_name(self):
        """UserProfile requires display_name field."""
        with pytest.raises(ValidationError):
            UserProfile(
                id="user-123",
                created_at="2024-01-01T00:00:00Z",
            )
