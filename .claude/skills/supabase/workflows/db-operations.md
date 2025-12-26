# Workflow: Database Operations

Common Supabase database operations.

## Start Local Supabase

```bash
cd api
supabase start
```

Outputs API URL and keys. Use these in `.env` files.

## Stop Supabase

```bash
supabase stop
```

## Reset Database

Drops all data, runs migrations, then seed:

```bash
supabase db reset
```

## Run Migrations

Apply pending migrations:

```bash
supabase db push
```

## Create Migration

```bash
supabase migration new <name>
```

## View Database Status

```bash
supabase status
```

## Access Studio UI

After `supabase start`, open:
http://127.0.0.1:54323

## Execute SQL

```bash
supabase db execute "SELECT * FROM my_table LIMIT 10"
```

## Generate Types

For TypeScript:
```bash
supabase gen types typescript --local > types.ts
```

## Connect via psql

```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Diff Remote vs Local

```bash
supabase db diff
```

## Pull Remote Schema

```bash
supabase db pull
```

## Link to Remote Project

```bash
supabase link --project-ref your-project-id
```

## Common Issues

### Port Already in Use
```bash
supabase stop
# Kill any remaining processes
lsof -i :54321 | grep LISTEN | awk '{print $2}' | xargs kill
supabase start
```

### Migration Failed
```bash
# Reset and try again
supabase db reset

# Check migration syntax
cat supabase/migrations/XXXXXXXX_name.sql
```

### Can't Connect
Check status and ensure Supabase is running:
```bash
supabase status
```
