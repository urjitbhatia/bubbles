# Backend Rust Configuration

## Development Server

- **Port**: 9990
- **Start command**: `make dev`
- **Build command**: `make build`
- **Deploy command**: `make deploy`

## Environment Variables

Located in `api-rust/.dev.vars`:

```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
FRONTEND_URL=http://localhost:6174
```

## Key Files

| File | Purpose |
|------|---------|
| `api-rust/src/lib.rs` | Worker entry point + OpenAPI |
| `api-rust/src/routes/*.rs` | Route handlers |
| `api-rust/src/models/*.rs` | Data structures |
| `api-rust/src/supabase.rs` | Supabase REST client |
| `api-rust/src/auth.rs` | JWT handling |
| `api-rust/Cargo.toml` | Dependencies |
| `api-rust/wrangler.toml` | Workers config |

## Makefile Commands

```bash
make dev      # Start local dev server
make build    # Build release WASM
make deploy   # Deploy to Cloudflare
make size     # Check binary size
make lint     # Run clippy
```

## Binary Size Optimization

In `Cargo.toml`:
```toml
[profile.release]
opt-level = "s"      # Size optimization
lto = true           # Link-time optimization
strip = true         # Strip symbols
codegen-units = 1    # Single codegen unit
panic = "abort"      # Smaller panic handling
```

Expected size: ~400-600KB after wasm-opt.

## Performance Comparison

| Metric | Python | Rust |
|--------|--------|------|
| Cold start | ~50-100ms | ~5-10ms |
| Execution | Baseline | 10-100x faster |
| Binary size | ~15MB+ | ~500KB |
