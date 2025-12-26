# Supabase Configuration

## Local Development

- **API URL**: http://127.0.0.1:54321
- **Studio URL**: http://127.0.0.1:54323
- **DB URL**: postgresql://postgres:postgres@127.0.0.1:54322/postgres

## Key Files

| File | Purpose |
|------|---------|
| `api/supabase/config.toml` | Supabase project config |
| `api/supabase/migrations/` | Database migrations |
| `api/supabase/seed/` | Seed data SQL files |
| `api/supabase/templates/` | Email templates |

## CLI Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (runs migrations + seed)
supabase db reset

# Create new migration
supabase migration new <name>

# Push migrations to remote
supabase db push

# Pull remote schema
supabase db pull

# Generate types (for TypeScript)
supabase gen types typescript --local > types.ts
```

## Environment Keys

After `supabase start`, you'll see:

```
API URL: http://127.0.0.1:54321
anon key: eyJ...
service_role key: eyJ...
```

Use these in:
- `web/.env.local` (anon key)
- `api/.dev.vars` (service_role key)

## Remote Configuration

In `api/supabase/config.toml`:

```toml
[remotes.production]
project_id = "your-project-id"
```

Link with: `supabase link --project-ref your-project-id`
