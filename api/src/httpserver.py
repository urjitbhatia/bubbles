"""
FastAPI application setup

This module configures the FastAPI application with:
- CORS middleware for frontend access
- API routes
- OpenAPI documentation
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router


def get_allowed_origins() -> list[str]:
    """Get allowed CORS origins based on environment."""
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:6174")

    return [
        frontend_url,
        "http://localhost:6174",
        "http://127.0.0.1:6174",
        # Add production URLs here
    ]


webapp = FastAPI(
    title="Supaflare API",
    version="1.0.0",
    description="Supaflare API",
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

# Include API routes
webapp.include_router(router, prefix="/api/v1")


@webapp.get("/api/v1/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
