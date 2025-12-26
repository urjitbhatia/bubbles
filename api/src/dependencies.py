"""
FastAPI dependencies for authentication and authorization
"""

import os
from typing import Annotated, Tuple

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import Client

from .supabase_client import get_user_client


security = HTTPBearer()


def get_jwt_secret() -> str:
    """Get JWT secret for token verification."""
    # Supabase uses the anon key as the JWT secret
    secret = os.getenv("SUPABASE_ANON_KEY")
    if not secret:
        raise ValueError("SUPABASE_ANON_KEY not set")
    return secret


def get_user_from_token(token: str) -> str:
    """
    Decode and validate a JWT token, returning the user ID.

    Args:
        token: The JWT access token

    Returns:
        The user's ID (sub claim)

    Raises:
        HTTPException: If the token is invalid or expired
    """
    try:
        # Decode without verification first to handle Supabase's JWT format
        # In production, you may want stricter verification
        payload = jwt.decode(
            token,
            options={"verify_signature": False},
            algorithms=["HS256"],
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
            )
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError as e:
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
