# Workflow: Create Route

Create a new API endpoint in the Python backend.

## Instructions

1. Create or update route file in `api/src/routes/`
2. Define route handler with proper typing
3. Add authentication if needed (`CurrentUser`)
4. Include in router aggregation (`routes/__init__.py`)
5. Test endpoint

## Template

```python
from fastapi import APIRouter, HTTPException, Query
from ..dependencies import CurrentUser
from ..models.my_model import MyModel, MyModelCreate

router = APIRouter()

@router.get("", response_model=list[MyModel])
async def list_items(
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List items for the current user."""
    user_id, client = current_user
    offset = (page - 1) * limit

    response = client.table("my_table") \
        .select("*") \
        .order("created_at", desc=True) \
        .range(offset, offset + limit - 1) \
        .execute()

    return [MyModel(**item) for item in response.data]

@router.post("", response_model=MyModel, status_code=201)
async def create_item(
    item: MyModelCreate,
    current_user: CurrentUser,
):
    """Create a new item."""
    user_id, client = current_user

    response = client.table("my_table").insert({
        "name": item.name,
        "user_id": user_id
    }).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create")

    return MyModel(**response.data[0])
```

## Register in Router

In `api/src/routes/__init__.py`:

```python
from .my_route import router as my_router

router.include_router(my_router, prefix="/my-resource", tags=["MyResource"])
```

## Expected Inputs

- Resource name and purpose
- HTTP methods needed (GET, POST, PATCH, DELETE)
- Authentication requirements
- Request/response models

## Expected Outputs

- Route file with handlers
- Models for request/response
- Registration in main router
