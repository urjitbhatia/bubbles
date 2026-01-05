-- Bubbles App Database Schema
-- Creates all core tables for the lending library application

-- ============================================================================
-- DROP EXISTING TABLES (from initial migration)
-- These will be replaced with the proper Bubbles schema
-- Note: CASCADE handles triggers, so we only need to drop auth trigger separately
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================================================
-- USERS TABLE
-- Extended user information beyond auth.users
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for users
CREATE INDEX users_username_idx ON users(username) WHERE username IS NOT NULL;

-- RLS for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read any profile (needed for viewing bubble members, item owners, etc.)
CREATE POLICY "Users can read any profile"
    ON users
    FOR SELECT
    TO authenticated
    USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for initial setup)
CREATE POLICY "Users can insert own profile"
    ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- BUBBLES TABLE
-- Trusted groups for sharing items
-- ============================================================================
CREATE TABLE bubbles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for bubbles
CREATE INDEX bubbles_invite_code_idx ON bubbles(invite_code);
CREATE INDEX bubbles_created_by_idx ON bubbles(created_by);

-- ============================================================================
-- BUBBLE_MEMBERS TABLE
-- Junction table for bubble membership with roles
-- ============================================================================
CREATE TABLE bubble_members (
    bubble_id UUID NOT NULL REFERENCES bubbles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (bubble_id, user_id)
);

-- Indexes for bubble_members
CREATE INDEX bubble_members_user_id_idx ON bubble_members(user_id);
CREATE INDEX bubble_members_bubble_id_idx ON bubble_members(bubble_id);

-- ============================================================================
-- ITEMS TABLE
-- User inventory items that can be shared and lent
-- ============================================================================
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for items
CREATE INDEX items_owner_id_idx ON items(owner_id);
CREATE INDEX items_created_at_idx ON items(created_at DESC);

-- ============================================================================
-- ITEM_SHARES TABLE
-- Junction table connecting items to bubbles
-- ============================================================================
CREATE TABLE item_shares (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    bubble_id UUID NOT NULL REFERENCES bubbles(id) ON DELETE CASCADE,
    shared_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (item_id, bubble_id)
);

-- Indexes for item_shares
CREATE INDEX item_shares_bubble_id_idx ON item_shares(bubble_id);
CREATE INDEX item_shares_item_id_idx ON item_shares(item_id);

-- ============================================================================
-- LOANS TABLE
-- Tracks borrowing history and status
-- ============================================================================
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bubble_id UUID NOT NULL REFERENCES bubbles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'active', 'returned', 'cancelled')),
    requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    lent_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ,
    notes TEXT
);

-- Indexes for loans
CREATE INDEX loans_item_id_idx ON loans(item_id);
CREATE INDEX loans_borrower_id_idx ON loans(borrower_id);
CREATE INDEX loans_bubble_id_idx ON loans(bubble_id);
CREATE INDEX loans_status_idx ON loans(status) WHERE status IN ('requested', 'active');

-- ============================================================================
-- NOTIFICATIONS TABLE
-- In-app notifications for users
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for notifications
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX notifications_unread_idx ON notifications(user_id, read) WHERE read = false;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE bubbles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubble_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- BUBBLES RLS
-- -----------------------------------------------------------------------------
-- Members can read their bubbles
CREATE POLICY "Members can read their bubbles"
    ON bubbles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bubble_members
            WHERE bubble_members.bubble_id = bubbles.id
            AND bubble_members.user_id = auth.uid()
        )
    );

-- Any authenticated user can view bubble by invite code (for joining)
CREATE POLICY "Anyone can view bubble by invite code"
    ON bubbles
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can create bubbles
CREATE POLICY "Authenticated users can create bubbles"
    ON bubbles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Admins can update their bubbles
CREATE POLICY "Admins can update their bubbles"
    ON bubbles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bubble_members
            WHERE bubble_members.bubble_id = bubbles.id
            AND bubble_members.user_id = auth.uid()
            AND bubble_members.role = 'admin'
        )
    );

-- Admins can delete their bubbles
CREATE POLICY "Admins can delete their bubbles"
    ON bubbles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bubble_members
            WHERE bubble_members.bubble_id = bubbles.id
            AND bubble_members.user_id = auth.uid()
            AND bubble_members.role = 'admin'
        )
    );

-- -----------------------------------------------------------------------------
-- BUBBLE_MEMBERS RLS
-- -----------------------------------------------------------------------------
-- Members can see other members in their bubbles
CREATE POLICY "Members can see members in their bubbles"
    ON bubble_members
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bubble_members AS my_membership
            WHERE my_membership.bubble_id = bubble_members.bubble_id
            AND my_membership.user_id = auth.uid()
        )
    );

-- Users can join bubbles (insert their own membership)
CREATE POLICY "Users can join bubbles"
    ON bubble_members
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can leave bubbles (delete their own membership)
CREATE POLICY "Users can leave bubbles"
    ON bubble_members
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Admins can update roles in their bubbles
CREATE POLICY "Admins can update roles in their bubbles"
    ON bubble_members
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bubble_members AS admin_check
            WHERE admin_check.bubble_id = bubble_members.bubble_id
            AND admin_check.user_id = auth.uid()
            AND admin_check.role = 'admin'
        )
    );

-- Admins can remove members from their bubbles
CREATE POLICY "Admins can remove members from bubbles"
    ON bubble_members
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bubble_members AS admin_check
            WHERE admin_check.bubble_id = bubble_members.bubble_id
            AND admin_check.user_id = auth.uid()
            AND admin_check.role = 'admin'
        )
    );

-- -----------------------------------------------------------------------------
-- ITEMS RLS
-- -----------------------------------------------------------------------------
-- Owners can CRUD their items
CREATE POLICY "Owners can read own items"
    ON items
    FOR SELECT
    TO authenticated
    USING (auth.uid() = owner_id);

-- Bubble members can read items shared to their bubbles
CREATE POLICY "Bubble members can read shared items"
    ON items
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM item_shares
            JOIN bubble_members ON bubble_members.bubble_id = item_shares.bubble_id
            WHERE item_shares.item_id = items.id
            AND bubble_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can create items"
    ON items
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update items"
    ON items
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete items"
    ON items
    FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- -----------------------------------------------------------------------------
-- ITEM_SHARES RLS
-- -----------------------------------------------------------------------------
-- Item owners can manage shares
CREATE POLICY "Item owners can read shares"
    ON item_shares
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM items
            WHERE items.id = item_shares.item_id
            AND items.owner_id = auth.uid()
        )
    );

-- Bubble members can read shares in their bubbles
CREATE POLICY "Bubble members can read shares in their bubbles"
    ON item_shares
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bubble_members
            WHERE bubble_members.bubble_id = item_shares.bubble_id
            AND bubble_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Item owners can create shares"
    ON item_shares
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM items
            WHERE items.id = item_shares.item_id
            AND items.owner_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM bubble_members
            WHERE bubble_members.bubble_id = item_shares.bubble_id
            AND bubble_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Item owners can delete shares"
    ON item_shares
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM items
            WHERE items.id = item_shares.item_id
            AND items.owner_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- LOANS RLS
-- -----------------------------------------------------------------------------
-- Item owners and borrowers can read their loans
CREATE POLICY "Involved parties can read loans"
    ON loans
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = borrower_id
        OR EXISTS (
            SELECT 1 FROM items
            WHERE items.id = loans.item_id
            AND items.owner_id = auth.uid()
        )
    );

-- Bubble members can create loan requests
CREATE POLICY "Bubble members can create loan requests"
    ON loans
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = borrower_id
        AND EXISTS (
            SELECT 1 FROM bubble_members
            WHERE bubble_members.bubble_id = loans.bubble_id
            AND bubble_members.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM item_shares
            WHERE item_shares.item_id = loans.item_id
            AND item_shares.bubble_id = loans.bubble_id
        )
    );

-- Item owners and borrowers can update loan status
CREATE POLICY "Involved parties can update loans"
    ON loans
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = borrower_id
        OR EXISTS (
            SELECT 1 FROM items
            WHERE items.id = loans.item_id
            AND items.owner_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- NOTIFICATIONS RLS
-- -----------------------------------------------------------------------------
-- Users can only access their own notifications
CREATE POLICY "Users can read own notifications"
    ON notifications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON notifications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
    ON notifications
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- System can create notifications (via service role)
CREATE POLICY "System can create notifications"
    ON notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically add creator as admin when bubble is created
CREATE OR REPLACE FUNCTION add_bubble_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO bubble_members (bubble_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_bubble_created
    AFTER INSERT ON bubbles
    FOR EACH ROW
    EXECUTE FUNCTION add_bubble_creator_as_admin();

-- Function to calculate available quantity for an item
CREATE OR REPLACE FUNCTION get_available_quantity(p_item_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_qty INTEGER;
    active_loans INTEGER;
BEGIN
    SELECT quantity INTO total_qty FROM items WHERE id = p_item_id;
    SELECT COUNT(*) INTO active_loans FROM loans WHERE item_id = p_item_id AND status = 'active';
    RETURN COALESCE(total_qty, 0) - COALESCE(active_loans, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger function (reuse from initial migration or redefine)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
