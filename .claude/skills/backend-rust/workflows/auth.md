# Workflow: Rust Authentication

Implement JWT authentication in Rust handlers.

## Instructions

1. Use `require_auth` helper
2. Handle auth errors with proper response
3. Get user token for Supabase client

## Protected Route Pattern

```rust
use crate::auth::require_auth;
use crate::supabase::{get_user_token, SupabaseClient};

pub async fn protected_handler(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    // Validate JWT and get user ID
    let user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    // Get RLS-aware Supabase client
    let token = get_user_token(&req).unwrap_or_default();
    let client = match SupabaseClient::user_client(&ctx.env, &token) {
        Ok(c) => c,
        Err(e) => return Ok(e.to_response()),
    };

    // Query with RLS
    let items = client.select("items", "select=*").await?;

    Response::from_json(&items)
}
```

## How require_auth Works

```rust
// In auth.rs:

pub fn require_auth(req: &Request, env: &Env) -> Result<String, ApiError> {
    let claims = get_user_from_request(req, env)?;
    Ok(claims.sub)  // Returns user ID
}

fn get_user_from_request(req: &Request, env: &Env) -> Result<Claims, ApiError> {
    // 1. Get Authorization header
    let auth_header = req.headers()
        .get("Authorization")?
        .ok_or(ApiError::Unauthorized("Missing header"))?;

    // 2. Extract Bearer token
    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(ApiError::Unauthorized("Invalid format"))?;

    // 3. Decode JWT
    let claims = decode::<Claims>(token, ...)?;

    Ok(claims)
}
```

## JWT Claims Structure

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,           // User ID
    pub email: Option<String>,
    pub exp: usize,
    pub iat: usize,
    pub aud: String,
    pub iss: String,
}
```

## OpenAPI Security

```rust
#[utoipa::path(
    get,
    path = "/api/v1/protected",
    responses(...),
    security(("bearer_auth" = []))  // Marks as authenticated
)]
```

## Expected Inputs

- Route requiring authentication

## Expected Outputs

- Protected route with auth check
- Proper error responses for 401
