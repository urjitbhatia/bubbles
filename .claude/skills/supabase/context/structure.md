# Supabase Directory Structure

```
api/supabase/
├── migrations/                    # Database migrations
│   └── 00000000000000_initial.sql # Initial schema
│
├── seed/                          # Seed data
│   └── seed.sql                   # Test data for development
│
├── templates/                     # Email templates
│   └── invite.html                # Invitation email
│
└── config.toml                    # Supabase configuration
```

## Migration Naming

Format: `YYYYMMDDHHMMSS_description.sql`

Example: `20251224120000_add_items_table.sql`

Use: `supabase migration new add_items_table`

## Migration Structure

```sql
-- Description of what this migration does

-- Create table
CREATE TABLE IF NOT EXISTS my_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data"
    ON my_table FOR SELECT
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS my_table_user_id_idx ON my_table(user_id);

-- Triggers
CREATE TRIGGER update_my_table_updated_at
    BEFORE UPDATE ON my_table
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Seed Data Structure

```sql
-- Test users (password: password123)
INSERT INTO auth.users (...) VALUES (...);

-- Sample data
INSERT INTO my_table (...) VALUES (...);
```
