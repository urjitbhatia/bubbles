---
name: supabase
description: Supabase database management including migrations, RLS policies, seed data, auth configuration, and local development. Database files in api/supabase/.
---

# Skill: Supabase

Database and authentication management using Supabase.

## Routing Logic

Analyze the user's intent and route to the appropriate workflow:

**Migrations** → `workflows/create-migration.md`
- "Create a migration for [table]"
- "Add a new table for [feature]"
- "Alter the [table] schema"

**RLS Policies** → `workflows/rls-policies.md`
- "Add RLS policy for [table]"
- "Secure [table] with row-level security"
- "Users can only see their own [data]"

**Seed Data** → `workflows/seed-data.md`
- "Add seed data for [table]"
- "Create test users"
- "Populate [table] with sample data"

**Auth Configuration** → `workflows/auth-config.md`
- "Configure Google OAuth"
- "Set up email templates"
- "Enable [provider] login"

**Database Operations** → `workflows/db-operations.md`
- "Reset the database"
- "Run migrations"
- "Start Supabase locally"

**Configuration Questions** → `context/config.md`
- "Where is the Supabase config?"
- "How do I connect to the database?"
- "What's the local Supabase URL?"

## Workflows

- `workflows/create-migration.md` - Create new database migrations
- `workflows/rls-policies.md` - Implement row-level security
- `workflows/seed-data.md` - Add seed/test data
- `workflows/auth-config.md` - Configure authentication
- `workflows/db-operations.md` - Common database operations

## Context

- `context/config.md` - Supabase configuration
- `context/structure.md` - Directory structure
- `context/rls-patterns.md` - RLS best practices
