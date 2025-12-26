# Supaflare

A minimal, production-ready monorepo template for building full-stack applications with:

- **Frontend**: React + Vite + TailwindCSS on Cloudflare Pages
- **Backend**: Python (FastAPI) or Rust on Cloudflare Workers
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Storage**: Cloudflare R2
- **Type Safety**: Auto-generated TypeScript types from OpenAPI

## Choose Your Backend

| | Python (`api/`) | Rust (`api-rust/`) |
|---|---|---|
| **Best for** | Rapid development, most apps | High-performance, low-latency |
| **Cold start** | ~50-100ms | ~5-10ms |
| **Execution** | Baseline | 10-100x faster |
| **Binary size** | ~15MB+ | ~500KB |
| **Learning curve** | Easy | Steeper |
| **OpenAPI** | Auto (FastAPI) | Manual (utoipa) |

**Recommendation**: Start with Python. Switch to Rust if you need extreme performance.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge                          │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   Pages (Frontend)  │───▶│   Workers (Backend API)     │ │
│  │   React + Vite      │    │   Python or Rust            │ │
│  │   Port 6174         │    │   Port 9990                 │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
│           │                            │                    │
│           │ Service Binding            │ R2 Binding         │
│           └────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │      Supabase       │
              │  PostgreSQL + Auth  │
              │       + RLS         │
              └─────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (`pnpm install -g wrangler`)

**For Python backend:**
- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (`curl -LsSf https://astral.sh/uv/install.sh | sh`)

**For Rust backend:**
- Rust 1.76+ (`rustup update stable`)

### 1. Clone & Setup

```bash
# Clone or use as template
git clone https://github.com/YOUR_ORG/supaflare myproject
cd myproject

# Run setup script (renames project, installs deps)
./setup.sh my-project-name
```

Or manually:

```bash
# Frontend
cd web && pnpm install && cd ..

# Backend (choose one)
cd api && uv sync && cd ..        # Python
cd api-rust && cargo build && cd .. # Rust
```

### 2. Start Supabase

```bash
cd api  # or api-rust (both share the same supabase folder)
supabase start
# Note the API URL and keys printed
```

### 3. Configure Environment

```bash
# Frontend
cp web/.env.example web/.env.local
# Edit with Supabase URL and anon key

# Backend (choose one)
cp api/.dev.vars.example api/.dev.vars           # Python
cp api-rust/.dev.vars.example api-rust/.dev.vars # Rust
# Edit with Supabase URL and service role key
```

### 4. Run Development Servers

**With Python backend:**
```bash
# Terminal 1: Backend (port 9990)
cd api && make dev

# Terminal 2: Frontend (port 6174)
cd web && pnpm run dev:with-binding
```

**With Rust backend:**
```bash
# Terminal 1: Backend (port 9990)
cd api-rust && make dev

# Terminal 2: Frontend (port 6174)
cd web && pnpm run dev:with-binding
```

### 5. Open App

Visit http://localhost:6174

## Project Structure

```
├── web/                    # Frontend (Cloudflare Pages)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities (API client, Supabase)
│   │   ├── pages/          # Route pages
│   │   └── types/          # Generated API types
│   ├── functions/          # Pages Functions (API proxy)
│   ├── wrangler.toml       # Cloudflare Pages config
│   └── package.json
│
├── api/                    # Backend - Python (Cloudflare Workers)
│   ├── src/
│   │   ├── routes/         # FastAPI endpoints
│   │   ├── models/         # Pydantic models
│   │   ├── worker.py       # Workers entry point
│   │   └── httpserver.py   # FastAPI app
│   ├── supabase/           # Shared database config
│   │   ├── migrations/     # Database migrations
│   │   ├── seed/           # Seed data
│   │   └── config.toml     # Supabase config
│   ├── wrangler.jsonc
│   ├── pyproject.toml
│   └── Makefile
│
├── api-rust/               # Backend - Rust (Cloudflare Workers)
│   ├── src/
│   │   ├── routes/         # Route handlers
│   │   ├── models/         # Data models
│   │   └── lib.rs          # Worker entry + OpenAPI
│   ├── wrangler.toml
│   ├── Cargo.toml
│   └── Makefile
│
└── README.md
```

## Key Commands

| Task | Python | Rust |
|------|--------|------|
| Start backend | `cd api && make dev` | `cd api-rust && make dev` |
| Start frontend | `cd web && pnpm run dev:with-binding` | (same) |
| Generate types | `cd web && pnpm run generate-types` | (same) |
| Run migrations | `cd api && supabase db push` | (same) |
| Reset database | `cd api && supabase db reset` | (same) |
| Deploy backend | `cd api && make deploy` | `cd api-rust && make deploy` |
| Deploy frontend | `cd web && pnpm run deploy` | (same) |

## Type Safety

After changing backend API endpoints or models:

```bash
cd web && pnpm run generate-types
```

This reads the OpenAPI schema from http://localhost:9990/openapi.json and generates TypeScript types in `src/types/api.ts`.

Both Python (FastAPI) and Rust (utoipa) backends expose the same `/openapi.json` endpoint.

## Deployment

### Backend (Cloudflare Workers)

```bash
cd api  # or api-rust

# Set secrets
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SUPABASE_ANON_KEY

# Deploy
make deploy
```

### Frontend (Cloudflare Pages)

```bash
cd web

# Set build environment variables in Cloudflare Dashboard:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY

# Deploy
pnpm run deploy
```

## Service Bindings

The frontend proxies `/api/*` requests to the backend using Cloudflare Service Bindings:

- **Local**: Frontend at 6174 proxies to backend at 9990
- **Production**: Direct Worker-to-Worker calls (no HTTP overhead)

This is configured in:
- `web/wrangler.toml` (service binding declaration)
- `web/functions/_middleware.ts` (proxy logic)

## Switching Backends

To switch from Python to Rust (or vice versa):

1. Update `web/wrangler.toml` to point to the correct worker name
2. Deploy the new backend
3. Regenerate types: `cd web && pnpm run generate-types`

Both backends expose identical APIs, so the frontend works with either.

## License

MIT
