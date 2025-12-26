# Workflow: Rust Database Operations

Use the Supabase REST client for database operations.

## Instructions

1. Get SupabaseClient (service or user)
2. Build REST query string
3. Call appropriate method
4. Handle errors

## Client Types

```rust
use crate::supabase::SupabaseClient;

// Service client - bypasses RLS
let client = SupabaseClient::service_client(&ctx.env)?;

// User client - respects RLS
let token = get_user_token(&req).unwrap_or_default();
let client = SupabaseClient::user_client(&ctx.env, &token)?;
```

## Query Patterns

### Select
```rust
// Basic select
let items: Vec<Item> = client
    .select("items", "select=*")
    .await?;

// With filters
let items: Vec<Item> = client
    .select("items", "select=*&user_id=eq.{user_id}&order=created_at.desc")
    .await?;

// With pagination
let query = format!(
    "select=*&order=created_at.desc&offset={}&limit={}",
    offset, limit
);
let items: Vec<Item> = client.select("items", &query).await?;
```

### Insert
```rust
#[derive(Serialize)]
struct NewItem {
    id: String,
    name: String,
    user_id: String,
}

let new_item = NewItem {
    id: Uuid::new_v4().to_string(),
    name: input.name,
    user_id: user_id,
};

let created: Item = client.insert("items", &new_item).await?;
```

### Update
```rust
let query = format!("id=eq.{}", item_id);
let updated: Vec<Item> = client
    .update("items", &query, &update_data)
    .await?;

if updated.is_empty() {
    return Err(ApiError::NotFound("Item not found".into()));
}
```

### Delete
```rust
let query = format!("id=eq.{}", item_id);
client.delete("items", &query).await?;
```

## Error Handling

```rust
let items: Vec<Item> = match client.select("items", &query).await {
    Ok(items) => items,
    Err(e) => return Ok(e.to_response()),
};

// Or with ? operator if returning Result<Response>
```

## Expected Inputs

- Table name
- Operation type
- Query parameters

## Expected Outputs

- Type-safe query implementation
- Error handling
