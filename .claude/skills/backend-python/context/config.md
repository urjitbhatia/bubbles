# Backend Python Configuration

## Development Server

- **Port**: 9999
- **Start command**: `make dev` (Workers runtime) or `make local` (direct FastAPI)
- **OpenAPI docs**: http://localhost:9999/docs
- **OpenAPI JSON**: http://localhost:9999/openapi.json

## Environment Variables

Located in `api/.dev.vars` (copy from `.dev.vars.example`):

```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
FRONTEND_URL=http://localhost:5174
```

## Key Files

| File | Purpose |
|------|---------|
| `api/src/worker.py` | Cloudflare Workers entry point |
| `api/src/httpserver.py` | FastAPI app setup |
| `api/src/dependencies.py` | Auth and DI dependencies |
| `api/src/supabase_client.py` | Supabase client configuration |
| `api/src/routes/__init__.py` | Route aggregation |
| `api/wrangler.jsonc` | Workers configuration |
| `api/pyproject.toml` | Python dependencies (uv) |

## Makefile Commands

```bash
make dev        # Start with Workers runtime (port 9999)
make local      # Start direct FastAPI (port 8000)
make test       # Run tests
make lint       # Run linter
make deploy     # Deploy to Cloudflare
```

## R2 Bindings

Configured in `wrangler.jsonc`:
```json
"r2_buckets": [{
  "binding": "STORAGE",
  "bucket_name": "supaflare-storage"
}]
```

Access via `req.scope["env"].STORAGE`.
