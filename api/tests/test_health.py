"""
Health check endpoint tests.
"""

import pytest


def test_health_check(client):
    """Test the health endpoint returns correctly."""
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_openapi_schema(client):
    """Test OpenAPI schema is accessible."""
    response = client.get("/openapi.json")

    assert response.status_code == 200
    data = response.json()
    assert data["info"]["title"] == "Supaflare API"
    assert "paths" in data
