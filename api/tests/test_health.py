"""
Basic health check tests
"""

import pytest
from fastapi.testclient import TestClient


def test_health_check():
    """Test the health endpoint returns correctly."""
    # Import here to avoid issues with missing env vars during collection
    import os
    os.environ.setdefault("SUPABASE_URL", "http://localhost:54321")
    os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test")
    os.environ.setdefault("SUPABASE_ANON_KEY", "test")

    from src.httpserver import webapp

    client = TestClient(webapp)
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
