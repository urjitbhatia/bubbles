# Workflow: Create Migration

Create a new database migration.

## Instructions

1. Generate migration file: `supabase migration new <name>`
2. Edit the generated SQL file
3. Add table creation, RLS policies, indexes
4. Test with `supabase db reset`

## Command

```bash
cd api
supabase migration new add_[table_name]_table
```

This creates: `supabase/migrations/YYYYMMDDHHMMSS_add_[table_name]_table.sql`

## Template

```sql
-- Migration: Add [table_name] table
-- Description: [What this migration does]

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table
CREATE TABLE IF NOT EXISTS [table_name] (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Add columns here
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own [table_name]"
    ON [table_name] FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own [table_name]"
    ON [table_name] FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own [table_name]"
    ON [table_name] FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own [table_name]"
    ON [table_name] FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS [table_name]_user_id_idx ON [table_name](user_id);
CREATE INDEX IF NOT EXISTS [table_name]_created_at_idx ON [table_name](created_at DESC);

-- Updated at trigger
CREATE TRIGGER update_[table_name]_updated_at
    BEFORE UPDATE ON [table_name]
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Testing

```bash
# Reset database to run all migrations
supabase db reset

# Check table was created
supabase db execute "SELECT * FROM [table_name] LIMIT 1"
```

## Expected Inputs

- Table name and purpose
- Column definitions
- RLS requirements

## Expected Outputs

- Migration file in `supabase/migrations/`
- Tested with `db reset`
