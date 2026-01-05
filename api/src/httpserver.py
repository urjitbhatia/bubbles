"""
FastAPI application setup

This module configures the FastAPI application with:
- CORS middleware for frontend access
- API routes
- OpenAPI documentation
"""

import os
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from routes import router
from supabase_client import get_supabase_client


def get_allowed_origins() -> list[str]:
    """Get allowed CORS origins based on environment."""
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:6174")

    origins = [
        frontend_url,
        "http://localhost:6174",
        "http://127.0.0.1:6174",
    ]
    # Remove duplicates while preserving order
    return list(dict.fromkeys(origins))


webapp = FastAPI(
    title="Bubbles API",
    version="0.1.0",
    description="Bubbles - A lending library for trusted groups",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS configuration
webapp.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes under /api/v1
webapp.include_router(router, prefix="/api/v1")


# ============================================================================
# Health Check Endpoints
# ============================================================================

@webapp.get("/api/health", tags=["Health"])
async def health_check():
    """
    Basic health check endpoint.

    Returns 200 if the API is running.
    """
    return {
        "status": "healthy",
        "service": "bubbles-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@webapp.get("/api/health/db", tags=["Health"])
async def health_check_db():
    """
    Database health check endpoint.

    Verifies connectivity to Supabase by running a simple query.
    Returns 200 if database is accessible, 503 otherwise.
    """
    try:
        client = get_supabase_client()
        # Simple query to verify database connectivity
        # We query the users table structure, not actual data
        result = client.table("users").select("id").limit(1).execute()

        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )
