# Workflow: Authentication

Implement authentication for API endpoints.

## Instructions

1. Add `CurrentUser` dependency to route
2. Unpack user_id and client
3. Use client for RLS-aware queries
4. Handle auth errors

## Protected Route Pattern

```python
from ..dependencies import CurrentUser

@router.get("/protected")
async def protected_route(current_user: CurrentUser):
    user_id, client = current_user
    # client respects RLS for this user

    # Query user's data
    response = client.table("items") \
        .select("*") \
        .execute()  # RLS filters to user's items

    return response.data
```

## How CurrentUser Works

```python
# In dependencies.py:
async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> Tuple[str, Client]:
    token = credentials.credentials
    user_id = get_user_from_token(token)  # Decode JWT
    client = get_user_client(token)       # RLS-aware client
    return user_id, client

CurrentUser = Annotated[Tuple[str, Client], Depends(get_current_user)]
```

## Optional Auth Pattern

```python
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

security = HTTPBearer(auto_error=False)

@router.get("/public-or-private")
async def optional_auth_route(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if credentials:
        user_id = get_user_from_token(credentials.credentials)
        # Authenticated request
    else:
        # Anonymous request
```

## Admin Check Pattern

```python
from ..supabase_client import get_supabase_client

async def require_admin(current_user: CurrentUser):
    user_id, _ = current_user
    service_client = get_supabase_client()  # Bypass RLS

    response = service_client.table("user_profiles") \
        .select("is_admin") \
        .eq("id", user_id) \
        .single() \
        .execute()

    if not response.data or not response.data.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin required")

    return user_id
```

## Expected Inputs

- Route requiring authentication
- Level of access needed (user, admin, optional)

## Expected Outputs

- Protected route with CurrentUser dependency
- Appropriate error handling
