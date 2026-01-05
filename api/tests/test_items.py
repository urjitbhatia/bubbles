"""
Items API endpoint tests.

Tests for FEAT-048: Items & Inventory Management
"""

import pytest


class TestItemsListEndpoint:
    """Tests for GET /api/v1/items"""

    def test_list_items_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.get("/api/v1/items")

        assert response.status_code in [401, 403]
        data = response.json()
        assert "detail" in data


class TestItemsCreateEndpoint:
    """Tests for POST /api/v1/items"""

    def test_create_item_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.post(
            "/api/v1/items",
            json={"name": "Test Item", "quantity": 1}
        )

        assert response.status_code in [401, 403]


class TestItemsGetEndpoint:
    """Tests for GET /api/v1/items/{id}"""

    def test_get_item_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.get("/api/v1/items/item-123")

        assert response.status_code in [401, 403]


class TestItemsUpdateEndpoint:
    """Tests for PATCH /api/v1/items/{id}"""

    def test_update_item_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.patch(
            "/api/v1/items/item-123",
            json={"name": "Updated Name"}
        )

        assert response.status_code in [401, 403]


class TestItemsDeleteEndpoint:
    """Tests for DELETE /api/v1/items/{id}"""

    def test_delete_item_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.delete("/api/v1/items/item-123")

        assert response.status_code in [401, 403]


class TestItemsSharingEndpoint:
    """Tests for POST /api/v1/items/{id}/share"""

    def test_share_item_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.post(
            "/api/v1/items/item-123/share",
            json={"bubble_ids": ["bubble-456"]}
        )

        assert response.status_code in [401, 403]
