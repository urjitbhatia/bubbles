# API (Rust)

High-performance backend API using Rust and Cloudflare Workers.

## Why Rust?

| Metric | Python | Rust |
|--------|--------|------|
| Cold start | ~50-100ms | ~5-10ms |
| Execution | Baseline | 10-100x faster |
| Binary size | ~15MB+ | ~500KB |
| Memory | GC overhead | Zero-cost |

Choose Rust when you need:
- Ultra-low latency APIs
- High throughput (thousands of req/s)
- CPU-intensive edge computing
- Minimal cold start times

## Prerequisites

- Rust 1.76+ (`rustup update stable`)
- wrangler (`npm install -g wrangler`)
- wasm-opt (optional, for size optimization)

## Development

```bash
# Start local dev server (port 9999)
make dev

# Build release binary
make build

# Check binary size
make size

# Deploy to Cloudflare
make deploy
```

## Environment Variables

Copy `.dev.vars.example` to `.dev.vars` and configure:

```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=your_key
SUPABASE_ANON_KEY=your_key
```

For production, use wrangler secrets:

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SUPABASE_ANON_KEY
```

## API Documentation

OpenAPI spec available at `/openapi.json` when running.

Generate frontend types:
```bash
cd ../web
pnpm run generate-types
```

## Project Structure

```
src/
├── lib.rs          # Worker entry point + OpenAPI doc
├── auth.rs         # JWT authentication
├── error.rs        # Error types
├── supabase.rs     # Supabase REST client
├── models/
│   ├── item.rs     # Item models
│   └── user.rs     # User models
└── routes/
    ├── health.rs   # Health check
    ├── items.rs    # Items CRUD
    └── user.rs     # User profile
```

## Binary Size Optimization

The release profile in `Cargo.toml` is configured for minimal size:

```toml
[profile.release]
opt-level = "s"      # Optimize for size
lto = true           # Link-time optimization
strip = true         # Strip symbols
codegen-units = 1    # Single codegen unit
panic = "abort"      # Smaller panic handling
```

Expected binary size: ~400-600KB after wasm-opt.
