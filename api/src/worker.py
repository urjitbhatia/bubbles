"""
Cloudflare Workers entry point

This module bridges the Cloudflare Workers runtime with the FastAPI application.
Environment variables are extracted from the Workers environment and made
available to the FastAPI app.
"""

import os
from workers import WorkerEntrypoint

from httpserver import webapp


# Environment variables to extract from Workers env
ENV_VAR_NAMES = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_ANON_KEY",
    "FRONTEND_URL",
    # Add other env vars as needed
]


def _extract_env_vars(env):
    """
    Extract environment variables from Workers runtime.

    In Cloudflare Workers, secrets are accessed via the env object.
    This function extracts them and sets them as OS environment variables
    so they can be accessed by the FastAPI app using os.getenv().
    """
    for var in ENV_VAR_NAMES:
        value = getattr(env, var, None)
        if value is not None:
            os.environ[var] = str(value)


class Default(WorkerEntrypoint):
    """Default Cloudflare Worker entrypoint."""

    async def fetch(self, request):
        """Handle incoming HTTP requests."""
        import asgi

        # Extract env vars from Workers runtime
        _extract_env_vars(self.env)

        # Pass env to ASGI app via scope (for R2 bindings, etc.)
        return await asgi.fetch(webapp, request.js_object, self.env)

    async def scheduled(self, event):
        """Handle scheduled/cron triggers."""
        _extract_env_vars(self.env)

        # Add scheduled task handling here
        # Example: cleanup old data, send notifications, etc.
        print(f"Scheduled event triggered at {event.scheduledTime}")
