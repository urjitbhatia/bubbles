# Backend Rust Patterns

## Route Handler Pattern

```rust
use worker::*;
use crate::auth::require_auth;
use crate::models::item::{Item, ItemCreate};

#[utoipa::path(
    get,
    path = "/api/v1/items",
    tag = "Items",
    responses(
        (status = 200, description = "List of items", body = Vec<Item>),
        (status = 401, description = "Unauthorized")
    ),
    security(("bearer_auth" = []))
)]
pub async fn list_items(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    // Query database...

    Response::from_json(&items)
}
```

## Model Pattern

```rust
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ItemCreate {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
    pub user_id: String,
}
```

## Error Handling Pattern

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Unauthorized: {0}")]
    Unauthorized(String),

    #[error("Bad request: {0}")]
    BadRequest(String),
}

impl ApiError {
    pub fn to_response(&self) -> Response {
        let status = match self {
            ApiError::NotFound(_) => 404,
            ApiError::Unauthorized(_) => 401,
            ApiError::BadRequest(_) => 400,
        };

        Response::from_json(&serde_json::json!({
            "error": self.to_string()
        }))
        .unwrap()
        .with_status(status)
    }
}
```

## Supabase Query Pattern

```rust
use crate::supabase::SupabaseClient;

let client = SupabaseClient::user_client(&ctx.env, &token)?;

// Select
let items: Vec<Item> = client
    .select("items", "select=*&order=created_at.desc")
    .await?;

// Insert
let created: Item = client
    .insert("items", &new_item)
    .await?;

// Update
let updated: Vec<Item> = client
    .update("items", &format!("id=eq.{}", item_id), &update_data)
    .await?;

// Delete
client.delete("items", &format!("id=eq.{}", item_id)).await?;
```

## Router Setup Pattern

```rust
let router = Router::new();

router
    .get_async("/api/v1/health", routes::health::health_check)
    .get_async("/api/v1/items", routes::items::list_items)
    .post_async("/api/v1/items", routes::items::create_item)
    .get_async("/api/v1/items/:item_id", routes::items::get_item)
    .run(req, env)
    .await
```
