"""
Shared test fixtures and configuration.
"""

import os
import pytest
from fastapi.testclient import TestClient


# Set required env vars before importing app
os.environ.setdefault("SUPABASE_URL", "http://localhost:54321")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")
os.environ.setdefault("SUPABASE_ANON_KEY", "test-anon-key")


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    from httpserver import webapp

    with TestClient(webapp) as test_client:
        yield test_client


@pytest.fixture
def mock_supabase(mocker):
    """Mock the Supabase client for unit tests."""
    mock_client = mocker.MagicMock()
    mocker.patch("supabase_client.get_client", return_value=mock_client)
    return mock_client
