# Frontend Configuration

## Development Server

- **Port**: 5174
- **Start command**: `pnpm run dev:with-binding` (with backend) or `pnpm run dev` (standalone)
- **Build command**: `pnpm run build`
- **Deploy command**: `pnpm run deploy`

## Environment Variables

Located in `web/.env.local` (copy from `.env.example`):

```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Access in code via `import.meta.env.VITE_*`.

## Key Files

| File | Purpose |
|------|---------|
| `web/vite.config.ts` | Vite configuration, dev proxy |
| `web/wrangler.toml` | Cloudflare Pages config, service binding |
| `web/tailwind.config.js` | TailwindCSS configuration |
| `web/src/main.tsx` | App entry point |
| `web/src/App.tsx` | Root component with routing |

## Service Binding

The frontend proxies `/api/*` to the backend via Cloudflare Service Binding:
- Configured in `web/wrangler.toml`
- Middleware in `web/functions/_middleware.ts`
- In dev mode, Vite's proxy handles this

## Type Generation

After backend API changes:
```bash
pnpm run generate-types
```

Generates `web/src/types/api.ts` from `http://localhost:9999/openapi.json`.
