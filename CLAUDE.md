## Quick Reference

| Component | Port | Package Mgr | Start Command |
|-----------|------|-------------|---------------|
| Frontend | 6174 | pnpm | `pnpm run dev` |
| Backend (Python) | 9990 | uv | `make dev` |

**Dev workflow**: Start backend first, then frontend.

## Critical Rule: Type Sync

**After ANY backend API change**, regenerate frontend types:
```bash
cd web && pnpm run generate-types
```

**NEVER define custom API types** in `apiClient.ts`. Always re-export from auto-generated types:
```typescript
// Use this pattern
import type { components } from '../types/api';
export type MyResponse = components['schemas']['MyResponse'];
```

## Architecture

- **Frontend**: React + Vite + TailwindCSS on Cloudflare Pages
- **Backend**: FastAPI + Python on Cloudflare Workers
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Storage**: Cloudflare R2

## Service Bindings

Frontend uses `@cloudflare/vite-plugin` which provides bindings in both dev and production:
- Dev: Plugin uses `getPlatformProxy()` to provide bindings
- Production: Normal Cloudflare Pages/Workers runtime

Configuration in `web/wrangler.toml`:
```toml
[[services]]
binding = "API"
service = "supaflare-api"
```
