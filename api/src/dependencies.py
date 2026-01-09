"""
FastAPI dependencies for authentication and authorization

Uses Supabase SDK for proper JWT verification, ensuring auth.uid() works
correctly in RLS policies.
"""

import logging
from typing import Annotated, Tuple

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import Client

from supabase_client import get_auth_client, get_user_client


logger = logging.getLogger(__name__)
security = HTTPBearer()


def get_user_from_token(token: str) -> str:
    """
    Verify JWT token using Supabase SDK and return user ID.

    This uses client.auth.get_user(token) for proper token verification,
    which ensures the JWT is valid according to Supabase's security standards.

    Args:
        token: The JWT access token

    Returns:
        The user's ID

    Raises:
        HTTPException: If the token is invalid or expired
    """
    try:
        client = get_auth_client()
        response = client.auth.get_user(token)

        if not response or not response.user:
            logger.warning("Token verification failed: No user returned from Supabase")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: User not found",
            )

        user_id = str(response.user.id)
        logger.debug(f"Token verified for user: {user_id}")
        return user_id

    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Token verification failed: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> Tuple[str, Client]:
    """
    Validate the user's token and return user ID + RLS client.

    This dependency:
    1. Extracts the Bearer token from the Authorization header
    2. Validates the JWT token
    3. Creates a Supabase client with the user's token for RLS

    Returns:
        Tuple of (user_id, supabase_client)
    """
    token = credentials.credentials
    user_id = get_user_from_token(token)
    client = get_user_client(token)
    return user_id, client


# Type alias for dependency injection
CurrentUser = Annotated[Tuple[str, Client], Depends(get_current_user)]
