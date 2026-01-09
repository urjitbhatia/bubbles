-- Seed data for local development
-- This file runs after migrations when using `supabase db reset`

-- ============================================================================
-- TEST USERS
-- Password for all test users: 'password123'
-- ============================================================================

-- Create test users in auth.users
-- Note: All varchar columns must be non-NULL for newer Supabase auth (GoTrue v2.184+)
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
    role,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    email_change,
    phone_change,
    phone_change_token,
    reauthentication_token
) VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000000',
        'alice@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        '{"full_name": "Alice Johnson"}',
        NOW() - INTERVAL '30 days',
        NOW(),
        'authenticated',
        'authenticated',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000000',
        'bob@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        '{"full_name": "Bob Smith"}',
        NOW() - INTERVAL '25 days',
        NOW(),
        'authenticated',
        'authenticated',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000000',
        'carol@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        '{"full_name": "Carol Davis"}',
        NOW() - INTERVAL '20 days',
        NOW(),
        'authenticated',
        'authenticated',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- USER PROFILES
-- ============================================================================
INSERT INTO users (id, display_name, username, avatar_url, created_at) VALUES
    ('10000000-0000-0000-0000-000000000001', 'Alice Johnson', 'alice', NULL, NOW() - INTERVAL '30 days'),
    ('10000000-0000-0000-0000-000000000002', 'Bob Smith', 'bob', NULL, NOW() - INTERVAL '25 days'),
    ('10000000-0000-0000-0000-000000000003', 'Carol Davis', 'carol', NULL, NOW() - INTERVAL '20 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- BUBBLES
-- ============================================================================
INSERT INTO bubbles (id, name, description, invite_code, created_by, created_at) VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        'Family Circle',
        'Sharing stuff with the fam',
        'FAM123',
        '10000000-0000-0000-0000-000000000001',
        NOW() - INTERVAL '28 days'
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        'Oak Street Neighbors',
        'Neighbors helping neighbors on Oak Street',
        'OAK456',
        '10000000-0000-0000-0000-000000000002',
        NOW() - INTERVAL '20 days'
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        'Book Club',
        'Our monthly book exchange',
        'BOOK789',
        '10000000-0000-0000-0000-000000000003',
        NOW() - INTERVAL '15 days'
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- BUBBLE MEMBERS
-- ============================================================================
INSERT INTO bubble_members (bubble_id, user_id, role, joined_at) VALUES
    -- Family Circle: Alice (admin), Bob (member)
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'admin', NOW() - INTERVAL '28 days'),
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'member', NOW() - INTERVAL '27 days'),

    -- Oak Street: Bob (admin), Alice (member), Carol (member)
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'admin', NOW() - INTERVAL '20 days'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'member', NOW() - INTERVAL '18 days'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'member', NOW() - INTERVAL '15 days'),

    -- Book Club: Carol (admin), Bob (member)
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'admin', NOW() - INTERVAL '15 days'),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'member', NOW() - INTERVAL '14 days')
ON CONFLICT (bubble_id, user_id) DO NOTHING;

-- ============================================================================
-- ITEMS
-- ============================================================================
INSERT INTO items (id, owner_id, name, description, quantity, created_at) VALUES
    -- Alice's items
    (
        '30000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'Mountain Bike',
        'Trek Marlin 7, 29-inch wheels, perfect for trail riding. Recently tuned up.',
        1,
        NOW() - INTERVAL '25 days'
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000001',
        'Camping Tent',
        '4-person tent with rainfly, great condition. Includes stakes and repair kit.',
        1,
        NOW() - INTERVAL '20 days'
    ),
    (
        '30000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000001',
        'Stand Mixer',
        'KitchenAid Professional 5qt. Multiple attachments included.',
        1,
        NOW() - INTERVAL '15 days'
    ),

    -- Bob's items
    (
        '30000000-0000-0000-0000-000000000004',
        '10000000-0000-0000-0000-000000000002',
        'Power Drill',
        'DeWalt 20V MAX with charger and bit set',
        1,
        NOW() - INTERVAL '18 days'
    ),
    (
        '30000000-0000-0000-0000-000000000005',
        '10000000-0000-0000-0000-000000000002',
        'Extension Ladder',
        '24ft aluminum extension ladder. Reaches 2nd story easily.',
        1,
        NOW() - INTERVAL '16 days'
    ),
    (
        '30000000-0000-0000-0000-000000000006',
        '10000000-0000-0000-0000-000000000002',
        'Board Games Collection',
        'Settlers of Catan, Ticket to Ride, Pandemic, and Codenames',
        4,
        NOW() - INTERVAL '12 days'
    ),

    -- Carol's items
    (
        '30000000-0000-0000-0000-000000000007',
        '10000000-0000-0000-0000-000000000003',
        'Instant Pot',
        '8qt Instant Pot Duo. Perfect for batch cooking.',
        1,
        NOW() - INTERVAL '14 days'
    ),
    (
        '30000000-0000-0000-0000-000000000008',
        '10000000-0000-0000-0000-000000000003',
        'Fiction Book Collection',
        'Various fiction novels - ask for specific titles',
        12,
        NOW() - INTERVAL '10 days'
    ),
    (
        '30000000-0000-0000-0000-000000000009',
        '10000000-0000-0000-0000-000000000003',
        'Kayak',
        'Single person recreational kayak with paddle. Great for calm waters.',
        1,
        NOW() - INTERVAL '8 days'
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ITEM SHARES (items shared to bubbles)
-- ============================================================================
INSERT INTO item_shares (item_id, bubble_id, shared_at) VALUES
    -- Alice's shares
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', NOW() - INTERVAL '24 days'),  -- Bike to Family
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', NOW() - INTERVAL '17 days'),  -- Bike to Neighbors
    ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', NOW() - INTERVAL '19 days'),  -- Tent to Family
    ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', NOW() - INTERVAL '14 days'),  -- Mixer to Neighbors

    -- Bob's shares
    ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', NOW() - INTERVAL '17 days'),  -- Drill to Neighbors
    ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', NOW() - INTERVAL '15 days'),  -- Ladder to Neighbors
    ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', NOW() - INTERVAL '11 days'),  -- Games to Family
    ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', NOW() - INTERVAL '10 days'),  -- Games to Book Club

    -- Carol's shares
    ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', NOW() - INTERVAL '13 days'),  -- Instant Pot to Neighbors
    ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000003', NOW() - INTERVAL '9 days'),   -- Books to Book Club
    ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000002', NOW() - INTERVAL '7 days')    -- Kayak to Neighbors
ON CONFLICT (item_id, bubble_id) DO NOTHING;

-- ============================================================================
-- SAMPLE LOANS
-- ============================================================================
INSERT INTO loans (id, item_id, borrower_id, bubble_id, status, requested_at, lent_at, returned_at, notes) VALUES
    -- Active loan: Bob borrowed Alice's camping tent
    (
        '40000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000002',
        '20000000-0000-0000-0000-000000000001',
        'active',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '4 days',
        NULL,
        'Family camping trip next weekend!'
    ),

    -- Completed loan: Alice returned Bob's drill
    (
        '40000000-0000-0000-0000-000000000002',
        '30000000-0000-0000-0000-000000000004',
        '10000000-0000-0000-0000-000000000001',
        '20000000-0000-0000-0000-000000000002',
        'returned',
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '9 days',
        NOW() - INTERVAL '6 days',
        'Thanks! Shelves are up.'
    ),

    -- Pending request: Carol wants to borrow Alice's bike
    (
        '40000000-0000-0000-0000-000000000003',
        '30000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000003',
        '20000000-0000-0000-0000-000000000002',
        'requested',
        NOW() - INTERVAL '1 day',
        NULL,
        NULL,
        'Would love to try the trails this weekend if available!'
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at) VALUES
    (
        '50000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'loan_request',
        'New borrow request',
        'Carol wants to borrow your Mountain Bike',
        '{"loan_id": "40000000-0000-0000-0000-000000000003", "item_id": "30000000-0000-0000-0000-000000000001"}',
        false,
        NOW() - INTERVAL '1 day'
    ),
    (
        '50000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000002',
        'bubble_join',
        'New member joined',
        'Carol joined Oak Street Neighbors',
        '{"bubble_id": "20000000-0000-0000-0000-000000000002", "user_id": "10000000-0000-0000-0000-000000000003"}',
        true,
        NOW() - INTERVAL '15 days'
    )
ON CONFLICT (id) DO NOTHING;
