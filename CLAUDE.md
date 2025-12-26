## Quick Reference

| Component | Port | Package Mgr | Start Command |
|-----------|------|-------------|---------------|
| Frontend | 5174 | pnpm | `pnpm run dev:with-binding` |
| Backend | 9999 | uv | `make dev` |

## Critical Rule: Type Sync

**After ANY backend API change**, regenerate frontend types:
```bash
cd /path/to/project/web && pnpm run generate-types
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

Frontend proxies `/api/*` to backend via Cloudflare Service Bindings:
- `web/wrangler.toml` declares the binding
- `web/functions/_middleware.ts` handles the proxy
