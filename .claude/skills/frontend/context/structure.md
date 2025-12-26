# Frontend Directory Structure

```
web/
├── functions/              # Cloudflare Pages Functions
│   ├── _middleware.ts      # API proxy via service binding
│   └── env.d.ts            # Environment type definitions
│
├── public/                 # Static assets
│   └── vite.svg
│
├── scripts/
│   └── dev-with-binding.sh # Dev script with backend binding
│
├── src/
│   ├── components/         # Reusable React components
│   │
│   ├── lib/                # Core utilities
│   │   ├── api-client.ts   # Type-safe API client (openapi-fetch)
│   │   ├── auth.tsx        # Auth context and hooks
│   │   └── supabase.ts     # Supabase client instance
│   │
│   ├── pages/              # Route pages
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   │
│   ├── types/
│   │   └── api.ts          # Auto-generated from OpenAPI
│   │
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles (Tailwind imports)
│   └── vite-env.d.ts       # Vite type definitions
│
├── index.html              # HTML template
├── package.json
├── vite.config.ts
├── wrangler.toml           # Cloudflare Pages config
├── tsconfig.json
└── tailwind.config.js
```

## Conventions

- **Components**: PascalCase, `.tsx` extension
- **Utilities**: camelCase, `.ts` extension
- **Pages**: PascalCase, one per route
- **Types**: Import from `../types/api` for API types
