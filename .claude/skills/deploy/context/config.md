# Deployment Configuration

## Backend (Cloudflare Workers)

### Python Backend
- **Config**: `api/wrangler.jsonc`
- **Deploy**: `cd api && make deploy`
- **Worker name**: `supaflare-api`

### Rust Backend
- **Config**: `api-rust/wrangler.toml`
- **Deploy**: `cd api-rust && make deploy`
- **Worker name**: `supaflare-api`

## Frontend (Cloudflare Pages)

- **Config**: `web/wrangler.toml`
- **Deploy**: `cd web && pnpm run deploy`
- **Project name**: `supaflare-web`
- **Build output**: `dist/`

## Required Secrets

### Backend
```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SUPABASE_ANON_KEY
```

### Frontend (Cloudflare Dashboard)

Set in Pages project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Service Binding

Frontend is bound to backend in `web/wrangler.toml`:
```toml
[[services]]
binding = "API"
service = "supaflare-api"
```

Ensure backend is deployed before frontend.

## Deployment Order

1. Deploy backend first (creates the Worker)
2. Set backend secrets
3. Deploy frontend (binds to backend Worker)
4. Set frontend environment variables

## Custom Domains

### Backend (Worker)
In `wrangler.jsonc`:
```json
"routes": [{
  "pattern": "api.yourdomain.com/*",
  "zone_name": "yourdomain.com"
}]
```

### Frontend (Pages)
Configure in Cloudflare Dashboard:
Pages → Custom domains → Add domain
