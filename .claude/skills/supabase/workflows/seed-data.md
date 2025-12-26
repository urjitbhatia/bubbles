# Workflow: Seed Data

Add seed data for local development and testing.

## Instructions

1. Edit `api/supabase/seed/seed.sql`
2. Add test users and sample data
3. Use `ON CONFLICT DO NOTHING` for idempotency
4. Reset database to apply: `supabase db reset`

## Test User Template

```sql
-- Test user (password: password123)
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    aud,
    role
) VALUES (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"full_name": "Test User"}',
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
) ON CONFLICT (id) DO NOTHING;
```

## Sample Data Template

```sql
-- Sample items for test user
INSERT INTO items (id, name, description, user_id, created_at) VALUES
    ('20000000-0000-0000-0000-000000000001', 'Item 1', 'First item', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days'),
    ('20000000-0000-0000-0000-000000000002', 'Item 2', 'Second item', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
    ('20000000-0000-0000-0000-000000000003', 'Item 3', NULL, '10000000-0000-0000-0000-000000000001', NOW())
ON CONFLICT (id) DO NOTHING;
```

## Multiple Users

```sql
-- Admin user
INSERT INTO auth.users (...) VALUES (
    '10000000-0000-0000-0000-000000000002',
    ...,
    'admin@example.com',
    ...
) ON CONFLICT (id) DO NOTHING;

-- Mark as admin in profiles
UPDATE user_profiles
SET is_admin = true
WHERE id = '10000000-0000-0000-0000-000000000002';
```

## Apply Seed Data

```bash
cd api
supabase db reset  # Runs migrations + seed
```

## Expected Inputs

- Types of test data needed
- User roles to create

## Expected Outputs

- Seed SQL in `supabase/seed/seed.sql`
- Idempotent (can run multiple times)
