# Workflow: RLS Policies

Implement row-level security for a table.

## Instructions

1. Identify the access pattern needed
2. Create appropriate policies for each operation
3. Test policies work as expected

## Common Patterns

### User-Owned Data
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own data"
    ON my_table FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own data"
    ON my_table FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
    ON my_table FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
    ON my_table FOR DELETE
    USING (auth.uid() = user_id);
```

### Organization-Based
```sql
-- Users can access data from their organizations
CREATE POLICY "Org members can view"
    ON my_table FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM org_members
            WHERE user_id = auth.uid()
        )
    );
```

### Public Read
```sql
-- Anyone can read, only owners can modify
CREATE POLICY "Public read"
    ON my_table FOR SELECT
    USING (true);

CREATE POLICY "Owner can modify"
    ON my_table FOR ALL
    USING (auth.uid() = user_id);
```

### Published Content
```sql
-- Published items are public, drafts are owner-only
CREATE POLICY "View published or own"
    ON articles FOR SELECT
    USING (
        is_published = true
        OR auth.uid() = user_id
    );
```

## Policy Syntax

```sql
CREATE POLICY "policy_name"
    ON table_name
    FOR operation          -- SELECT, INSERT, UPDATE, DELETE, or ALL
    TO role_name           -- Optional: authenticated, anon, etc.
    USING (expression)     -- For SELECT, UPDATE, DELETE
    WITH CHECK (expression) -- For INSERT, UPDATE
```

## Testing

```sql
-- Simulate a user session
SET request.jwt.claim.sub = 'user-uuid';
SET request.jwt.claims = '{"role": "authenticated"}';

-- Test queries
SELECT * FROM my_table;  -- Should only see user's data
```

## Expected Inputs

- Table to secure
- Access pattern requirements

## Expected Outputs

- RLS policies for all operations
- Tested access control
