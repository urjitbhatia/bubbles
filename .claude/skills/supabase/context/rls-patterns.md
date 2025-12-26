# RLS (Row Level Security) Patterns

## Enable RLS

Always enable RLS on tables with user data:

```sql
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;
```

## Common Policies

### Users Can Only Access Own Data

```sql
-- Select
CREATE POLICY "Users can view own data"
    ON my_table FOR SELECT
    USING (auth.uid() = user_id);

-- Insert
CREATE POLICY "Users can create own data"
    ON my_table FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Update
CREATE POLICY "Users can update own data"
    ON my_table FOR UPDATE
    USING (auth.uid() = user_id);

-- Delete
CREATE POLICY "Users can delete own data"
    ON my_table FOR DELETE
    USING (auth.uid() = user_id);
```

### Organization-Based Access

```sql
-- Users in same org can view
CREATE POLICY "Org members can view"
    ON items FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM org_members
            WHERE user_id = auth.uid()
        )
    );
```

### Public Read, Authenticated Write

```sql
-- Anyone can read
CREATE POLICY "Public read access"
    ON articles FOR SELECT
    USING (true);

-- Only authenticated users can write
CREATE POLICY "Authenticated users can create"
    ON articles FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
```

### Admin Override

```sql
-- Admins can do anything
CREATE POLICY "Admins have full access"
    ON my_table FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );
```

## RLS Functions

```sql
-- Get current user ID
auth.uid()

-- Get current user role
auth.role()

-- Get JWT claim
auth.jwt() ->> 'email'
```

## Testing RLS

```sql
-- Test as specific user
SET request.jwt.claim.sub = 'user-uuid-here';
SET request.jwt.claims = '{"role": "authenticated"}';

-- Run queries and verify access
SELECT * FROM my_table;
```

## Bypassing RLS

Service role key bypasses RLS. Use only for:
- Background jobs
- Admin operations
- System-level queries

Never expose service role key to clients.
