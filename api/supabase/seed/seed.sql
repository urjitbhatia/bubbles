-- Seed data for local development
-- This file runs after migrations when using `supabase db reset`

-- ============================================================================
-- TEST USERS
-- Password for all test users: 'password123'
-- ============================================================================

-- Create test user (will trigger profile creation via trigger)
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

-- ============================================================================
-- SAMPLE ITEMS
-- ============================================================================
INSERT INTO items (id, name, description, user_id, created_at) VALUES
    ('20000000-0000-0000-0000-000000000001', 'First Item', 'This is my first item', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days'),
    ('20000000-0000-0000-0000-000000000002', 'Second Item', 'Another example item', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
    ('20000000-0000-0000-0000-000000000003', 'Third Item', NULL, '10000000-0000-0000-0000-000000000001', NOW())
ON CONFLICT (id) DO NOTHING;
