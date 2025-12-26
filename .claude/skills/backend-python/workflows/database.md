# Workflow: Database Operations

Perform Supabase database operations with RLS.

## Instructions

1. Get the appropriate client (service or user)
2. Build the query using PostgREST syntax
3. Handle response and errors
4. Return typed data

## Client Types

```python
from ..supabase_client import get_supabase_client, get_user_client

# Service client - bypasses RLS (for system operations)
client = get_supabase_client()

# User client - respects RLS (for user operations)
# Usually injected via CurrentUser dependency
user_id, client = current_user
```

## Query Patterns

### Select
```python
# Basic select
response = client.table("items").select("*").execute()

# With filters
response = client.table("items") \
    .select("*") \
    .eq("user_id", user_id) \
    .neq("status", "deleted") \
    .execute()

# With ordering and pagination
response = client.table("items") \
    .select("*", count="exact") \
    .order("created_at", desc=True) \
    .range(0, 9) \
    .execute()

# Join related data
response = client.table("items") \
    .select("*, user_profiles(full_name)") \
    .execute()
```

### Insert
```python
response = client.table("items").insert({
    "id": str(uuid4()),
    "name": "New Item",
    "user_id": user_id
}).execute()

# Bulk insert
response = client.table("items").insert([
    {"name": "Item 1", "user_id": user_id},
    {"name": "Item 2", "user_id": user_id}
]).execute()
```

### Update
```python
response = client.table("items") \
    .update({"name": "Updated Name"}) \
    .eq("id", item_id) \
    .execute()
```

### Delete
```python
response = client.table("items") \
    .delete() \
    .eq("id", item_id) \
    .execute()
```

### Upsert
```python
response = client.table("items") \
    .upsert({"id": item_id, "name": "Name"}) \
    .execute()
```

## Error Handling

```python
response = client.table("items").select("*").eq("id", item_id).execute()

if not response.data:
    raise HTTPException(status_code=404, detail="Item not found")

item = response.data[0]
```

## Expected Inputs

- Table name
- Operation type (select, insert, update, delete)
- Filters and conditions

## Expected Outputs

- Query implementation
- Error handling
- Typed response
