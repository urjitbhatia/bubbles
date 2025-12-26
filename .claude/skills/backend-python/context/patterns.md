# Backend Python Patterns

## Route Handler Pattern

```python
from fastapi import APIRouter, HTTPException
from ..dependencies import CurrentUser
from ..models.item import Item, ItemCreate

router = APIRouter()

@router.post("", response_model=Item, status_code=201)
async def create_item(
    item: ItemCreate,
    current_user: CurrentUser,  # Injected auth
):
    user_id, client = current_user  # Unpacks (user_id, supabase_client)

    # Use RLS-aware client
    response = client.table("items").insert({
        "name": item.name,
        "user_id": user_id
    }).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create")

    return Item(**response.data[0])
```

## Pydantic Model Pattern

```python
from typing import Optional
from pydantic import BaseModel

class ItemCreate(BaseModel):
    """Request model for creating an item."""
    name: str
    description: Optional[str] = None

class Item(BaseModel):
    """Response model for an item."""
    id: str
    name: str
    description: Optional[str] = None
    created_at: str
    user_id: str

class ItemList(BaseModel):
    """Paginated list response."""
    items: list[Item]
    total: int
    page: int
    limit: int
```

## Authentication Dependency

```python
from typing import Annotated, Tuple
from fastapi import Depends
from supabase import Client

# Type alias for authenticated endpoints
CurrentUser = Annotated[Tuple[str, Client], Depends(get_current_user)]

# Usage in route:
async def my_route(current_user: CurrentUser):
    user_id, client = current_user
    # client respects RLS for this user
```

## Supabase Query Patterns

```python
# Select with filters
response = client.table("items") \
    .select("*") \
    .eq("user_id", user_id) \
    .order("created_at", desc=True) \
    .range(offset, offset + limit - 1) \
    .execute()

# Insert
response = client.table("items") \
    .insert({"name": "New", "user_id": user_id}) \
    .execute()

# Update
response = client.table("items") \
    .update({"name": "Updated"}) \
    .eq("id", item_id) \
    .execute()

# Delete
response = client.table("items") \
    .delete() \
    .eq("id", item_id) \
    .execute()
```

## R2 Storage Access

```python
from fastapi import Request

async def upload_file(req: Request, file_data: bytes):
    env = req.scope.get("env")
    r2 = getattr(env, "STORAGE", None)

    if r2:
        await r2.put("path/to/file.txt", file_data)
```

## Error Handling

```python
from fastapi import HTTPException

# Not found
raise HTTPException(status_code=404, detail="Item not found")

# Unauthorized
raise HTTPException(status_code=401, detail="Invalid token")

# Bad request
raise HTTPException(status_code=400, detail="Invalid input")
```
