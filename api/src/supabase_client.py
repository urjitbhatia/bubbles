"""
Supabase client configuration

Provides two types of clients:
1. Service Role Client - Bypasses RLS, for system operations
2. User Client - Respects RLS, for user-scoped operations

IMPORTANT: User clients create a fresh instance per request to avoid
race conditions with concurrent requests.
"""

import os
from functools import lru_cache
from typing import Optional

from supabase import create_client, Client, ClientOptions


@lru_cache()
def _get_config():
    """Get Supabase configuration from environment."""
    url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    anon_key = os.getenv("SUPABASE_ANON_KEY")

    if not url:
        raise ValueError("SUPABASE_URL not set")
    if not service_role_key:
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY not set")
    if not anon_key:
        raise ValueError("SUPABASE_ANON_KEY not set")

    return url, service_role_key, anon_key


# Cache for service role client
_service_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Get a Supabase client with service role privileges.

    This client bypasses Row Level Security (RLS) and should be used
    for system operations that need full database access.

    WARNING: Do not use for user-facing operations.
    """
    global _service_client
    if _service_client is None:
        url, service_role_key, _ = _get_config()
        _service_client = create_client(url, service_role_key)
    return _service_client


# Cache for auth client (anon key, used for token verification)
_auth_client: Optional[Client] = None


def get_auth_client() -> Client:
    """
    Get a Supabase client for auth operations.

    Uses anon key and is used for token verification via auth.get_user().
    """
    global _auth_client
    if _auth_client is None:
        url, _, anon_key = _get_config()
        _auth_client = create_client(url, anon_key)
    return _auth_client


def get_user_client(user_token: str) -> Client:
    """
    Get a Supabase client that respects RLS for a specific user.

    This client uses the user's JWT token to enforce Row Level Security,
    ensuring users can only access data they're authorized to see.
    The user's JWT is passed to Supabase so auth.uid() returns
    the correct user ID in RLS policies.

    Creates a fresh client instance to avoid race conditions with
    concurrent requests (each request gets its own client with its own token).

    Args:
        user_token: The user's JWT access token from Supabase Auth

    Returns:
        A Supabase client configured with the user's token
    """
    url, _, anon_key = _get_config()
    # Create client with explicit Authorization header for RLS
    # This ensures auth.uid() returns the correct user ID in RLS policies
    options = ClientOptions(
        headers={
            "Authorization": f"Bearer {user_token}",
        }
    )
    client = create_client(url, anon_key, options)
    return client
