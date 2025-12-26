"""
Unit tests for Pydantic models.
"""

import pytest
from pydantic import ValidationError

from models.item import Item, ItemCreate, ItemList
from models.user import UserProfile


class TestItemModels:
    """Tests for Item models."""

    def test_item_create_minimal(self):
        """ItemCreate works with just name."""
        item = ItemCreate(name="Test Item")
        assert item.name == "Test Item"
        assert item.description is None

    def test_item_create_full(self):
        """ItemCreate works with all fields."""
        item = ItemCreate(name="Test Item", description="A test description")
        assert item.name == "Test Item"
        assert item.description == "A test description"

    def test_item_create_requires_name(self):
        """ItemCreate requires name field."""
        with pytest.raises(ValidationError):
            ItemCreate()

    def test_item_full(self):
        """Item model with all fields."""
        item = Item(
            id="123",
            name="Test Item",
            description="Description",
            created_at="2024-01-01T00:00:00Z",
            user_id="user-456",
        )
        assert item.id == "123"
        assert item.name == "Test Item"
        assert item.user_id == "user-456"

    def test_item_list(self):
        """ItemList pagination model."""
        items = [
            Item(
                id=f"item-{i}",
                name=f"Item {i}",
                created_at="2024-01-01T00:00:00Z",
                user_id="user-123",
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
        """UserProfile model."""
        profile = UserProfile(
            id="user-123",
            email="test@example.com",
            created_at="2024-01-01T00:00:00Z",
        )
        assert profile.id == "user-123"
        assert profile.email == "test@example.com"
        assert profile.full_name is None

    def test_user_profile_full(self):
        """UserProfile model with all fields."""
        profile = UserProfile(
            id="user-123",
            email="test@example.com",
            full_name="Test User",
            created_at="2024-01-01T00:00:00Z",
        )
        assert profile.full_name == "Test User"
