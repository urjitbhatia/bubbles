# Backend Rust Structure

```
api-rust/
├── src/
│   ├── models/
│   │   ├── mod.rs          # Module exports
│   │   ├── item.rs         # Item structs
│   │   └── user.rs         # User structs
│   │
│   ├── routes/
│   │   ├── mod.rs          # Module exports
│   │   ├── health.rs       # Health check
│   │   ├── items.rs        # Items CRUD
│   │   └── user.rs         # User endpoints
│   │
│   ├── lib.rs              # Entry point + OpenAPI + Router
│   ├── auth.rs             # JWT authentication
│   ├── error.rs            # Error types
│   └── supabase.rs         # Supabase REST client
│
├── .dev.vars.example
├── Cargo.toml
├── wrangler.toml
├── Makefile
└── README.md
```

## Module Organization

### lib.rs
- Worker entry point (`#[event(fetch)]`)
- OpenAPI documentation (`#[derive(OpenApi)]`)
- Router setup
- CORS handling

### Routes
- Each file is a module with route handlers
- Uses `#[utoipa::path(...)]` for OpenAPI
- Returns `worker::Result<Response>`

### Models
- Serde `Serialize`/`Deserialize`
- Utoipa `ToSchema` for OpenAPI
- Separate request/response types
