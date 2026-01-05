"""
Bubbles API endpoint tests.

Tests for FEAT-047: Bubbles - Create, Join, Manage
"""

import pytest


class TestBubblesListEndpoint:
    """Tests for GET /api/v1/bubbles"""

    def test_list_bubbles_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.get("/api/v1/bubbles")

        assert response.status_code in [401, 403]
        data = response.json()
        assert "detail" in data


class TestBubblesCreateEndpoint:
    """Tests for POST /api/v1/bubbles"""

    def test_create_bubble_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.post(
            "/api/v1/bubbles",
            json={"name": "Test Bubble"}
        )

        assert response.status_code in [401, 403]


class TestBubblesGetEndpoint:
    """Tests for GET /api/v1/bubbles/{id}"""

    def test_get_bubble_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.get("/api/v1/bubbles/bubble-123")

        assert response.status_code in [401, 403]


class TestBubblesJoinEndpoint:
    """Tests for POST /api/v1/bubbles/join/{invite_code}"""

    def test_join_bubble_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.post("/api/v1/bubbles/join/abc123def456")

        assert response.status_code in [401, 403]


class TestBubblesMemberManagement:
    """Tests for member management endpoints"""

    def test_remove_member_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.delete("/api/v1/bubbles/bubble-123/members/user-456")

        assert response.status_code in [401, 403]

    def test_update_member_role_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.patch(
            "/api/v1/bubbles/bubble-123/members/user-456",
            json={"role": "admin"}
        )

        assert response.status_code in [401, 403]


class TestBubblesDeleteEndpoint:
    """Tests for DELETE /api/v1/bubbles/{id}"""

    def test_delete_bubble_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.delete("/api/v1/bubbles/bubble-123")

        assert response.status_code in [401, 403]


class TestBubblesUpdateEndpoint:
    """Tests for PATCH /api/v1/bubbles/{id}"""

    def test_update_bubble_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.patch(
            "/api/v1/bubbles/bubble-123",
            json={"name": "Updated Name"}
        )

        assert response.status_code in [401, 403]


class TestBubblesRegenerateCodeEndpoint:
    """Tests for POST /api/v1/bubbles/{id}/regenerate-code"""

    def test_regenerate_code_requires_authentication(self, client):
        """Unauthenticated request should be rejected."""
        response = client.post("/api/v1/bubbles/bubble-123/regenerate-code")

        assert response.status_code in [401, 403]
