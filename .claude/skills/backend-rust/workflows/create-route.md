# Workflow: Create Rust Route

Create a new API endpoint in the Rust backend.

## Instructions

1. Create or update route file in `api-rust/src/routes/`
2. Add utoipa path annotation for OpenAPI
3. Implement handler with proper error handling
4. Register route in `lib.rs` router
5. Add to OpenAPI paths list

## Template

```rust
// In routes/my_resource.rs

use worker::*;
use crate::auth::require_auth;
use crate::error::ApiError;
use crate::models::my_model::{MyModel, MyModelCreate};
use crate::supabase::{get_user_token, SupabaseClient};

#[utoipa::path(
    get,
    path = "/api/v1/my-resource",
    tag = "MyResource",
    responses(
        (status = 200, description = "List of resources", body = Vec<MyModel>),
        (status = 401, description = "Unauthorized")
    ),
    security(("bearer_auth" = []))
)]
pub async fn list_resources(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    let token = get_user_token(&req).unwrap_or_default();
    let client = match SupabaseClient::user_client(&ctx.env, &token) {
        Ok(c) => c,
        Err(e) => return Ok(e.to_response()),
    };

    let items: Vec<MyModel> = match client
        .select("my_table", "select=*&order=created_at.desc")
        .await
    {
        Ok(items) => items,
        Err(e) => return Ok(e.to_response()),
    };

    Response::from_json(&items)
}
```

## Register in Router

In `lib.rs`:

```rust
// Add to router chain
.get_async("/api/v1/my-resource", routes::my_resource::list_resources)

// Add to OpenAPI paths
paths(
    // ... existing paths
    routes::my_resource::list_resources,
)
```

## Expected Inputs

- Resource name and purpose
- HTTP methods needed
- Request/response models

## Expected Outputs

- Route handler with utoipa annotation
- Registration in router
- OpenAPI documentation
