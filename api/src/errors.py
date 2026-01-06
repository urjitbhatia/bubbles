"""
Error handling utilities for Supabase operations.

Provides consistent error handling across all API routes.
"""

from functools import wraps
from typing import Callable, TypeVar

from fastapi import HTTPException
from postgrest.exceptions import APIError

T = TypeVar('T')


class DatabaseError(Exception):
    """Custom exception for database errors with context."""
    def __init__(self, message: str, code: str | None = None, details: str | None = None):
        self.message = message
        self.code = code
        self.details = details
        super().__init__(message)


def handle_db_error(e: APIError, context: str = "database operation") -> HTTPException:
    """
    Convert a Supabase/PostgREST error to an appropriate HTTPException.

    Common error codes:
    - PGRST116: No rows found (single() on empty result)
    - 23503: Foreign key violation
    - 23505: Unique constraint violation
    - 42501: RLS policy violation
    """
    error_message = str(e)
    code = getattr(e, 'code', None)

    # Parse the error message for common patterns
    if 'PGRST116' in error_message or 'No rows found' in error_message.lower():
        return HTTPException(status_code=404, detail="Resource not found")

    if '23503' in error_message or 'foreign key' in error_message.lower():
        # Foreign key violation - usually means a referenced resource doesn't exist
        if 'users' in error_message.lower():
            return HTTPException(
                status_code=400,
                detail="User profile not found. Please complete profile setup first."
            )
        return HTTPException(status_code=400, detail="Referenced resource not found")

    if '23505' in error_message or 'unique' in error_message.lower() or 'duplicate' in error_message.lower():
        return HTTPException(status_code=409, detail="Resource already exists")

    if '42501' in error_message or 'permission' in error_message.lower() or 'policy' in error_message.lower():
        return HTTPException(status_code=403, detail="Permission denied")

    # Default to 500 with the error details
    return HTTPException(
        status_code=500,
        detail=f"Database error during {context}: {error_message}"
    )


def safe_execute(response, context: str = "database operation"):
    """
    Safely check Supabase response for errors.

    Returns the response if successful, raises HTTPException if not.
    """
    # Check if response has an error attribute
    if hasattr(response, 'error') and response.error:
        raise HTTPException(
            status_code=500,
            detail=f"Database error during {context}: {response.error}"
        )
    return response
