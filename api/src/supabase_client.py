"""
Supabase client configuration

Provides two types of clients:
1. Service Role Client - Bypasses RLS, for system operations
2. User Client - Respects RLS, for user-scoped operations
"""

import os
from functools import lru_cache

from supabase import create_client, Client


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


def get_supabase_client() -> Client:
    """
    Get a Supabase client with service role privileges.

    This client bypasses Row Level Security (RLS) and should be used
    for system operations that need full database access.

    WARNING: Do not use for user-facing operations.
    """
    url, service_role_key, _ = _get_config()
    return create_client(url, service_role_key)


def get_user_client(user_token: str) -> Client:
    """
    Get a Supabase client that respects RLS for a specific user.

    This client uses the user's JWT token to enforce Row Level Security,
    ensuring users can only access data they're authorized to see.

    Args:
        user_token: The user's JWT access token from Supabase Auth

    Returns:
        A Supabase client configured with the user's token
    """
    url, _, anon_key = _get_config()
    client = create_client(url, anon_key)
    client.postgrest.auth(user_token)
    return client
