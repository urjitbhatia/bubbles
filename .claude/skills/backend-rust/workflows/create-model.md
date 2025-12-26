# Workflow: Create Rust Model

Create Rust structs for request/response types.

## Instructions

1. Create or update model file in `api-rust/src/models/`
2. Derive Serialize, Deserialize, ToSchema
3. Export from `models/mod.rs`
4. Add to OpenAPI components in `lib.rs`

## Template

```rust
// In models/my_model.rs

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// Request model for creating a resource
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MyModelCreate {
    /// Resource name
    pub name: String,
    /// Optional description
    pub description: Option<String>,
}

/// Response model for a resource
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MyModel {
    /// Unique identifier
    pub id: String,
    /// Resource name
    pub name: String,
    /// Optional description
    pub description: Option<String>,
    /// Creation timestamp
    pub created_at: String,
    /// Owner user ID
    pub user_id: String,
}

/// Paginated list response
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MyModelList {
    pub items: Vec<MyModel>,
    pub total: i64,
    pub page: i32,
    pub limit: i32,
}
```

## Export from mod.rs

```rust
// In models/mod.rs
pub mod my_model;
```

## Add to OpenAPI

In `lib.rs`:

```rust
#[derive(OpenApi)]
#[openapi(
    components(schemas(
        // ... existing schemas
        models::my_model::MyModel,
        models::my_model::MyModelCreate,
        models::my_model::MyModelList,
    ))
)]
pub struct ApiDoc;
```

## Expected Inputs

- Entity name and fields
- Which traits to derive
- Optional vs required fields

## Expected Outputs

- Struct definitions with derives
- Module exports
- OpenAPI schema registration
