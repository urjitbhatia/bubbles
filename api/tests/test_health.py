"""
Health check endpoint tests.
"""

import pytest


def test_health_check(client):
    """Test the health endpoint returns correctly."""
    response = client.get("/api/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "bubbles-api"
    assert "timestamp" in data


def test_openapi_schema(client):
    """Test OpenAPI schema is accessible."""
    response = client.get("/openapi.json")

    assert response.status_code == 200
    data = response.json()
    assert data["info"]["title"] == "Bubbles API"
    assert data["info"]["version"] == "0.1.0"
    assert "paths" in data
