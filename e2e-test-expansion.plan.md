# E2E Test Coverage Expansion Plan

## Overview

Expand E2E test coverage from basic auth requirement checks to comprehensive authenticated flows, RLS policy verification, and edge case handling. Work is organized into **5 parallel work streams** that can be executed by different engineers simultaneously.

## Current State

- **56 tests** passing (auth, bubbles, items, loans, pwa, infra)
- All tests are **unauthenticated** - they only verify endpoints reject requests without auth
- No tests for user/profile API
- No authenticated CRUD flow tests
- No RLS policy verification tests
- No business logic edge case tests

## Architecture

```
tests/e2e/
├── auth.spec.ts          # Login UI, redirects
├── bubbles.spec.ts       # Bubble API auth checks
├── items.spec.ts         # Items API auth checks
├── loans.spec.ts         # Loans API auth checks
├── pwa.spec.ts           # PWA features
├── infra.spec.ts         # Health, CORS
├── fixtures/             # NEW: Shared test utilities
│   └── auth.fixture.ts   # Authentication helper
├── user.spec.ts          # NEW: User/profile API tests
├── authenticated/        # NEW: Authenticated flow tests
│   ├── items.auth.spec.ts
│   ├── bubbles.auth.spec.ts
│   ├── loans.auth.spec.ts
│   └── sharing.auth.spec.ts
└── security/             # NEW: RLS and permission tests
    ├── rls-items.spec.ts
    ├── rls-bubbles.spec.ts
    └── rls-loans.spec.ts
```

---

## Work Stream 1: Test Infrastructure (BLOCKING - Do First)

**Owner:** Engineer A
**Estimated Tests:** 0 (infrastructure only)
**Dependencies:** None
**Blocks:** All other work streams

### Task 1.1: Create Authentication Fixture

Create a reusable authentication helper that other tests will depend on.

**File:** `tests/e2e/fixtures/auth.fixture.ts`

```typescript
import { test as base, expect } from '@playwright/test'

// Test user credentials (use Supabase test users or create via API)
export const TEST_USER = {
  email: 'test@example.com',
  // For magic link testing, we'll need to either:
  // 1. Use a test Supabase project with auto-confirm enabled
  // 2. Create users via service role and get tokens directly
}

export const API_BASE_URL = 'http://localhost:9990'
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:6174'

/**
 * Get an authenticated API request context.
 *
 * Option 1: If test Supabase has auto-confirm, use signInWithPassword
 * Option 2: Create token via service role (recommended for CI)
 */
export async function getAuthToken(): Promise<string> {
  // Implementation depends on test environment setup
  // For local dev: Use Supabase service role to create test user and get token
  // For CI: Use pre-created test credentials

  const response = await fetch(`${API_BASE_URL}/api/test/auth-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_USER.email })
  })

  if (!response.ok) {
    throw new Error('Failed to get auth token for tests')
  }

  const { token } = await response.json()
  return token
}

/**
 * Extended test fixture with authenticated request context
 */
export const test = base.extend<{
  authRequest: Awaited<ReturnType<typeof base['request']>>
  authToken: string
}>({
  authToken: async ({}, use) => {
    const token = await getAuthToken()
    await use(token)
  },

  authRequest: async ({ request, authToken }, use) => {
    // Create a request context with auth header
    const authRequest = {
      get: (url: string, options?: any) =>
        request.get(url, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${authToken}` }
        }),
      post: (url: string, options?: any) =>
        request.post(url, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${authToken}` }
        }),
      patch: (url: string, options?: any) =>
        request.patch(url, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${authToken}` }
        }),
      delete: (url: string, options?: any) =>
        request.delete(url, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${authToken}` }
        }),
    }
    await use(authRequest as any)
  }
})

export { expect }
```

### Task 1.2: Create Test Auth Endpoint (Backend)

**File:** `api/src/routes/test_auth.py` (only enabled in dev/test)

```python
"""
Test authentication endpoint - ONLY for development/testing.
Allows creating test users and getting auth tokens without email verification.
"""

import os
from fastapi import APIRouter, HTTPException

router = APIRouter()

# Only enable in development
if os.getenv("ENVIRONMENT", "development") != "production":

    @router.post("/auth-token")
    async def get_test_auth_token(email: str):
        """Get an auth token for testing. Development only."""
        from supabase_client import get_supabase_client

        client = get_supabase_client()

        # Create or get test user
        # ... implementation using service role

        return {"token": "..."}
```

### Task 1.3: Create Test Data Helpers

**File:** `tests/e2e/fixtures/data.helpers.ts`

```typescript
import { API_BASE_URL } from './auth.fixture'

export interface TestItem {
  id: string
  name: string
  owner_id: string
}

export interface TestBubble {
  id: string
  name: string
  invite_code: string
}

export async function createTestItem(
  authToken: string,
  name: string = 'Test Item'
): Promise<TestItem> {
  const response = await fetch(`${API_BASE_URL}/api/v1/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ name, quantity: 1 })
  })
  return response.json()
}

export async function createTestBubble(
  authToken: string,
  name: string = 'Test Bubble'
): Promise<TestBubble> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bubbles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ name })
  })
  return response.json()
}

export async function cleanupTestData(authToken: string): Promise<void> {
  // Delete all items and bubbles created by test user
  // Implementation depends on whether we want cleanup or fresh DB per test
}
```

### Success Criteria
- [ ] Auth fixture can obtain valid JWT tokens
- [ ] Auth fixture works in both local and CI environments
- [ ] Data helpers can create/cleanup test entities
- [ ] Other work streams can import and use fixtures

---

## Work Stream 2: User/Profile API Tests

**Owner:** Engineer B
**Estimated Tests:** 12-15
**Dependencies:** Work Stream 1 (auth fixture)
**Can Start:** After Task 1.1 complete

### Task 2.1: Unauthenticated User API Tests

**File:** `tests/e2e/user.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

const API_BASE_URL = 'http://localhost:9990'

test.describe('User API Authentication', () => {
  test('GET /api/v1/user/me requires auth', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/user/me`)
    expect([401, 403]).toContain(response.status())
  })

  test('PATCH /api/v1/user/me requires auth', async ({ request }) => {
    const response = await request.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { display_name: 'Test' }
    })
    expect([401, 403]).toContain(response.status())
  })

  test('POST /api/v1/user/setup requires auth', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/user/setup`, {
      data: { display_name: 'Test' }
    })
    expect([401, 403]).toContain(response.status())
  })

  test('GET /api/v1/user/check-username/{username} requires auth', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/user/check-username/testuser`)
    expect([401, 403]).toContain(response.status())
  })
})
```

### Task 2.2: Authenticated User API Tests

```typescript
import { test, expect } from '../fixtures/auth.fixture'

const API_BASE_URL = 'http://localhost:9990'

test.describe('User Profile Operations', () => {
  test('can get own profile', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/user/me`)
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('display_name')
  })

  test('can update display name', async ({ authRequest }) => {
    const newName = `Test User ${Date.now()}`
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { display_name: newName }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.display_name).toBe(newName)
  })

  test('can check username availability', async ({ authRequest }) => {
    const response = await authRequest.get(
      `${API_BASE_URL}/api/v1/user/check-username/available_username_${Date.now()}`
    )

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.available).toBe(true)
  })

  test('cannot set duplicate username', async ({ authRequest }) => {
    // First, set a username
    const username = `testuser_${Date.now()}`
    await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username }
    })

    // Try to check the same username (should show unavailable for other users)
    const checkResponse = await authRequest.get(
      `${API_BASE_URL}/api/v1/user/check-username/${username}`
    )
    const body = await checkResponse.json()
    // Should be available=true for same user, false for different user
    expect(body).toHaveProperty('available')
  })
})

test.describe('Profile Setup', () => {
  test('setup requires display_name for new users', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/user/setup`, {
      data: {}
    })

    // Will be 400 for new user without display_name, or 200 if profile exists
    expect([200, 400]).toContain(response.status())
  })
})
```

### Test Cases Checklist
- [ ] GET /me requires authentication
- [ ] GET /me returns user profile
- [ ] PATCH /me requires authentication
- [ ] PATCH /me updates display_name
- [ ] PATCH /me updates username
- [ ] PATCH /me rejects duplicate username
- [ ] PATCH /me rejects empty update
- [ ] POST /setup requires authentication
- [ ] POST /setup creates profile for new user
- [ ] POST /setup requires display_name
- [ ] POST /setup updates existing profile
- [ ] GET /check-username requires auth
- [ ] GET /check-username returns availability
- [ ] GET /check-username shows taken usernames as unavailable

---

## Work Stream 3: Authenticated CRUD Flow Tests

**Owner:** Engineer C
**Estimated Tests:** 25-30
**Dependencies:** Work Stream 1 (auth fixture)
**Can Start:** After Task 1.1 complete

### Task 3.1: Items Authenticated Tests

**File:** `tests/e2e/authenticated/items.auth.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture'
import { createTestItem } from '../fixtures/data.helpers'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Items CRUD Operations', () => {
  test('can create an item', async ({ authRequest, authToken }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Test Item', quantity: 1, description: 'A test item' }
    })

    expect(response.status()).toBe(201)
    const item = await response.json()
    expect(item.name).toBe('Test Item')
    expect(item.quantity).toBe(1)
    expect(item).toHaveProperty('id')
  })

  test('can list own items', async ({ authRequest, authToken }) => {
    // Create a few items first
    await createTestItem(authToken, 'Item 1')
    await createTestItem(authToken, 'Item 2')

    const response = await authRequest.get(`${API_BASE_URL}/api/v1/items`)
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.items).toBeInstanceOf(Array)
    expect(body.items.length).toBeGreaterThanOrEqual(2)
  })

  test('can get item by ID', async ({ authRequest, authToken }) => {
    const item = await createTestItem(authToken, 'Get By ID Test')

    const response = await authRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.id).toBe(item.id)
    expect(body.name).toBe('Get By ID Test')
  })

  test('can update own item', async ({ authRequest, authToken }) => {
    const item = await createTestItem(authToken, 'Original Name')

    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
      data: { name: 'Updated Name' }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.name).toBe('Updated Name')
  })

  test('can delete own item', async ({ authRequest, authToken }) => {
    const item = await createTestItem(authToken, 'To Delete')

    const response = await authRequest.delete(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect(response.status()).toBe(204)

    // Verify deleted
    const getResponse = await authRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect(getResponse.status()).toBe(404)
  })

  test('pagination works correctly', async ({ authRequest, authToken }) => {
    // Create 5 items
    for (let i = 0; i < 5; i++) {
      await createTestItem(authToken, `Pagination Test ${i}`)
    }

    // Get first page
    const page1 = await authRequest.get(`${API_BASE_URL}/api/v1/items?page=1&limit=2`)
    const body1 = await page1.json()
    expect(body1.items.length).toBe(2)
    expect(body1.total).toBeGreaterThanOrEqual(5)

    // Get second page
    const page2 = await authRequest.get(`${API_BASE_URL}/api/v1/items?page=2&limit=2`)
    const body2 = await page2.json()
    expect(body2.items.length).toBe(2)
  })

  test('validates quantity must be positive', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Invalid', quantity: 0 }
    })

    expect(response.status()).toBe(422)
  })
})
```

### Task 3.2: Bubbles Authenticated Tests

**File:** `tests/e2e/authenticated/bubbles.auth.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture'
import { createTestBubble } from '../fixtures/data.helpers'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Bubbles CRUD Operations', () => {
  test('can create a bubble', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'My Test Bubble', description: 'A bubble for testing' }
    })

    expect(response.status()).toBe(201)
    const bubble = await response.json()
    expect(bubble.name).toBe('My Test Bubble')
    expect(bubble).toHaveProperty('invite_code')
  })

  test('creator is automatically admin', async ({ authRequest, authToken }) => {
    const bubble = await createTestBubble(authToken, 'Admin Test')

    const response = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
    const body = await response.json()

    // Find current user in members
    const currentUserMember = body.members?.find((m: any) => m.role === 'admin')
    expect(currentUserMember).toBeDefined()
  })

  test('can list own bubbles', async ({ authRequest, authToken }) => {
    await createTestBubble(authToken, 'List Test 1')
    await createTestBubble(authToken, 'List Test 2')

    const response = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
    expect(response.status()).toBe(200)

    const bubbles = await response.json()
    expect(bubbles.length).toBeGreaterThanOrEqual(2)
  })

  test('admin can update bubble', async ({ authRequest, authToken }) => {
    const bubble = await createTestBubble(authToken, 'Original')

    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
      data: { name: 'Updated Name' }
    })

    expect(response.status()).toBe(200)
  })

  test('admin can delete bubble', async ({ authRequest, authToken }) => {
    const bubble = await createTestBubble(authToken, 'To Delete')

    const response = await authRequest.delete(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
    expect(response.status()).toBe(204)
  })

  test('admin can regenerate invite code', async ({ authRequest, authToken }) => {
    const bubble = await createTestBubble(authToken, 'Code Regen Test')
    const originalCode = bubble.invite_code

    const response = await authRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/regenerate-code`
    )

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.invite_code).not.toBe(originalCode)
  })
})

test.describe('Bubble Join Flow', () => {
  test('can join bubble with valid invite code', async ({ authRequest, authToken }) => {
    const bubble = await createTestBubble(authToken, 'Join Test')

    // Note: Need second user to properly test join
    // For now, test that endpoint works
    const response = await authRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`
    )

    // Already a member, should handle gracefully
    expect([200, 400]).toContain(response.status())
  })

  test('returns error for invalid invite code', async ({ authRequest }) => {
    const response = await authRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/join/invalid_code_12345`
    )

    expect(response.status()).toBe(404)
  })
})
```

### Task 3.3: Loans Authenticated Tests

**File:** `tests/e2e/authenticated/loans.auth.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture'
import { createTestItem, createTestBubble } from '../fixtures/data.helpers'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Loans CRUD Operations', () => {
  test('can request a loan', async ({ authRequest, authToken }) => {
    // Setup: Create item and share to bubble
    const item = await createTestItem(authToken, 'Loanable Item')
    const bubble = await createTestBubble(authToken, 'Loan Test Bubble')

    // Share item to bubble
    await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: [bubble.id] }
    })

    // Note: Can't borrow own item - need second user for full test
    // Test that endpoint structure is correct
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: { item_id: item.id, bubble_id: bubble.id }
    })

    // Should fail because can't borrow own item
    expect(response.status()).toBe(400)
  })

  test('can list loans', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/loans`)
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toBeInstanceOf(Array)
  })

  test('can filter loans by status', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/loans?status=active`)
    expect(response.status()).toBe(200)
  })

  test('can filter as borrower', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/loans?as_borrower=true`)
    expect(response.status()).toBe(200)
  })

  test('can filter as lender', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/loans?as_lender=true`)
    expect(response.status()).toBe(200)
  })
})
```

### Task 3.4: Item Sharing Tests

**File:** `tests/e2e/authenticated/sharing.auth.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture'
import { createTestItem, createTestBubble } from '../fixtures/data.helpers'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Item Sharing', () => {
  test('can share item to bubble', async ({ authRequest, authToken }) => {
    const item = await createTestItem(authToken, 'Share Test Item')
    const bubble = await createTestBubble(authToken, 'Share Test Bubble')

    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: [bubble.id] }
    })

    expect(response.status()).toBe(200)
  })

  test('can share item to multiple bubbles', async ({ authRequest, authToken }) => {
    const item = await createTestItem(authToken, 'Multi Share Item')
    const bubble1 = await createTestBubble(authToken, 'Share Bubble 1')
    const bubble2 = await createTestBubble(authToken, 'Share Bubble 2')

    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: [bubble1.id, bubble2.id] }
    })

    expect(response.status()).toBe(200)
  })

  test('can unshare item from bubble', async ({ authRequest, authToken }) => {
    const item = await createTestItem(authToken, 'Unshare Test Item')
    const bubble = await createTestBubble(authToken, 'Unshare Test Bubble')

    // Share first
    await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: [bubble.id] }
    })

    // Then unshare (empty array)
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: [] }
    })

    expect(response.status()).toBe(200)
  })

  test('cannot share to bubble user is not member of', async ({ authRequest, authToken }) => {
    const item = await createTestItem(authToken, 'Invalid Share Item')

    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: ['non-existent-bubble-id'] }
    })

    expect([400, 403, 404]).toContain(response.status())
  })
})
```

### Test Cases Checklist - Items
- [ ] Create item with valid data
- [ ] Create item validates required fields
- [ ] Create item validates quantity > 0
- [ ] List items returns paginated results
- [ ] List items pagination works correctly
- [ ] Get item by ID succeeds for own item
- [ ] Update item succeeds for owner
- [ ] Update item partial update works
- [ ] Delete item succeeds for owner
- [ ] Delete item returns 404 after deletion

### Test Cases Checklist - Bubbles
- [ ] Create bubble with valid data
- [ ] Create bubble generates invite code
- [ ] Creator is automatically admin
- [ ] List bubbles returns user's bubbles
- [ ] Get bubble by ID succeeds for member
- [ ] Admin can update bubble name/description
- [ ] Admin can delete bubble
- [ ] Admin can regenerate invite code
- [ ] Join bubble with valid code succeeds
- [ ] Join bubble with invalid code fails

### Test Cases Checklist - Loans
- [ ] List loans returns array
- [ ] List loans with status filter works
- [ ] List loans as_borrower filter works
- [ ] List loans as_lender filter works
- [ ] Cannot borrow own item (validation error)

### Test Cases Checklist - Sharing
- [ ] Share item to single bubble
- [ ] Share item to multiple bubbles
- [ ] Unshare item from bubble
- [ ] Cannot share to non-member bubble

---

## Work Stream 4: RLS Policy & Security Tests

**Owner:** Engineer D
**Estimated Tests:** 15-20
**Dependencies:** Work Stream 1 (auth fixture), needs two test users
**Can Start:** After Task 1.1 complete

### Task 4.1: Multi-User Test Setup

Requires creating a second test user to verify RLS policies.

**File:** `tests/e2e/fixtures/multi-user.fixture.ts`

```typescript
import { test as base } from '@playwright/test'
import { getAuthToken } from './auth.fixture'

export const test = base.extend<{
  user1Token: string
  user2Token: string
  user1Request: any
  user2Request: any
}>({
  user1Token: async ({}, use) => {
    const token = await getAuthToken('user1@test.com')
    await use(token)
  },
  user2Token: async ({}, use) => {
    const token = await getAuthToken('user2@test.com')
    await use(token)
  },
  // ... request helpers for each user
})
```

### Task 4.2: Items RLS Tests

**File:** `tests/e2e/security/rls-items.spec.ts`

```typescript
import { test, expect } from '../fixtures/multi-user.fixture'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Items RLS Policies', () => {
  test('user cannot see items owned by others (not shared)', async ({
    user1Request, user2Request, user1Token
  }) => {
    // User 1 creates an item
    const createResponse = await user1Request.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Private Item', quantity: 1 }
    })
    const item = await createResponse.json()

    // User 2 tries to access it
    const getResponse = await user2Request.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect([403, 404]).toContain(getResponse.status())
  })

  test('user can see items shared to their bubble', async ({
    user1Request, user2Request, user1Token, user2Token
  }) => {
    // User 1 creates item and bubble
    const item = await user1Request.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Shared Item', quantity: 1 }
    }).then(r => r.json())

    const bubble = await user1Request.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Shared Bubble' }
    }).then(r => r.json())

    // User 2 joins bubble
    await user2Request.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // User 1 shares item
    await user1Request.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: [bubble.id] }
    })

    // User 2 should now see the item
    const getResponse = await user2Request.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect(getResponse.status()).toBe(200)
  })

  test('user cannot update items they do not own', async ({
    user1Request, user2Request, user1Token
  }) => {
    const item = await user1Request.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Protected Item', quantity: 1 }
    }).then(r => r.json())

    const updateResponse = await user2Request.patch(
      `${API_BASE_URL}/api/v1/items/${item.id}`,
      { data: { name: 'Hacked!' } }
    )

    expect([403, 404]).toContain(updateResponse.status())
  })

  test('user cannot delete items they do not own', async ({
    user1Request, user2Request, user1Token
  }) => {
    const item = await user1Request.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Protected Item', quantity: 1 }
    }).then(r => r.json())

    const deleteResponse = await user2Request.delete(
      `${API_BASE_URL}/api/v1/items/${item.id}`
    )

    expect([403, 404]).toContain(deleteResponse.status())
  })
})
```

### Task 4.3: Bubbles RLS Tests

**File:** `tests/e2e/security/rls-bubbles.spec.ts`

```typescript
import { test, expect } from '../fixtures/multi-user.fixture'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Bubbles RLS Policies', () => {
  test('user cannot see bubbles they are not member of', async ({
    user1Request, user2Request
  }) => {
    const bubble = await user1Request.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Private Bubble' }
    }).then(r => r.json())

    const getResponse = await user2Request.get(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
    )

    expect([403, 404]).toContain(getResponse.status())
  })

  test('non-admin cannot update bubble', async ({
    user1Request, user2Request
  }) => {
    const bubble = await user1Request.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Admin Only Bubble' }
    }).then(r => r.json())

    // User 2 joins
    await user2Request.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // User 2 (member, not admin) tries to update
    const updateResponse = await user2Request.patch(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`,
      { data: { name: 'Hacked!' } }
    )

    expect(updateResponse.status()).toBe(403)
  })

  test('non-admin cannot delete bubble', async ({
    user1Request, user2Request
  }) => {
    const bubble = await user1Request.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Admin Delete Test' }
    }).then(r => r.json())

    await user2Request.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    const deleteResponse = await user2Request.delete(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
    )

    expect(deleteResponse.status()).toBe(403)
  })

  test('non-admin cannot change member roles', async ({
    user1Request, user2Request
  }) => {
    const bubble = await user1Request.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Role Test Bubble' }
    }).then(r => r.json())

    await user2Request.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // Get user2's member ID
    const bubbleDetails = await user2Request.get(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
    ).then(r => r.json())

    // User 2 tries to promote themselves
    const patchResponse = await user2Request.patch(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${bubbleDetails.members[1].user_id}`,
      { data: { role: 'admin' } }
    )

    expect(patchResponse.status()).toBe(403)
  })

  test('user can leave bubble', async ({
    user1Request, user2Request
  }) => {
    const bubble = await user1Request.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Leave Test Bubble' }
    }).then(r => r.json())

    await user2Request.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // Get user2's member ID from bubble details
    const bubbleDetails = await user2Request.get(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
    ).then(r => r.json())

    const user2Member = bubbleDetails.members.find((m: any) => m.role === 'member')

    // User 2 leaves
    const leaveResponse = await user2Request.delete(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${user2Member.user_id}`
    )

    expect(leaveResponse.status()).toBe(204)
  })
})
```

### Task 4.4: Loans RLS Tests

**File:** `tests/e2e/security/rls-loans.spec.ts`

```typescript
import { test, expect } from '../fixtures/multi-user.fixture'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Loans RLS Policies', () => {
  test('borrower can see their own loans', async ({
    user1Request, user2Request
  }) => {
    // Setup: User1 creates item, shares to bubble, User2 joins and borrows
    // ... setup code ...

    // User2 should see loan in their list
    const response = await user2Request.get(
      `${API_BASE_URL}/api/v1/loans?as_borrower=true`
    )
    expect(response.status()).toBe(200)
  })

  test('lender can see loans of their items', async ({
    user1Request, user2Request
  }) => {
    // ... setup code ...

    // User1 (item owner) should see loan
    const response = await user1Request.get(
      `${API_BASE_URL}/api/v1/loans?as_lender=true`
    )
    expect(response.status()).toBe(200)
  })

  test('third party cannot see loan details', async ({
    user1Request, user2Request
  }) => {
    // User3 (not borrower or lender) tries to access loan
    // ... test code ...
  })

  test('only lender can approve loan request', async ({
    user1Request, user2Request
  }) => {
    // User2 (borrower) tries to approve their own request
    // Should fail
  })

  test('only borrower can mark loan as returned', async ({
    user1Request, user2Request
  }) => {
    // ... test code ...
  })
})
```

### Test Cases Checklist - Items RLS
- [ ] Cannot see others' unshared items
- [ ] Can see items shared to joined bubble
- [ ] Cannot update others' items
- [ ] Cannot delete others' items
- [ ] Cannot share others' items

### Test Cases Checklist - Bubbles RLS
- [ ] Cannot see non-member bubbles
- [ ] Non-admin cannot update bubble
- [ ] Non-admin cannot delete bubble
- [ ] Non-admin cannot change roles
- [ ] User can leave bubble (self-remove)
- [ ] Admin can remove members

### Test Cases Checklist - Loans RLS
- [ ] Borrower can see own loans
- [ ] Lender can see loans of own items
- [ ] Third party cannot see unrelated loans
- [ ] Only lender can approve requests
- [ ] Only appropriate party can update status

---

## Work Stream 5: Edge Cases & Business Logic Tests

**Owner:** Engineer E
**Estimated Tests:** 15-20
**Dependencies:** Work Stream 1 (auth fixture)
**Can Start:** After Task 1.1 complete

### Task 5.1: Item Edge Cases

**File:** `tests/e2e/edge-cases/items.edge.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Item Edge Cases', () => {
  test('cannot delete item with active loan', async ({ authRequest, authToken }) => {
    // Setup: Create item, share, have it borrowed
    // ... setup code ...

    // Try to delete
    const response = await authRequest.delete(`${API_BASE_URL}/api/v1/items/${itemId}`)
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.detail).toContain('active loan')
  })

  test('item quantity affects availability', async ({ authRequest, authToken }) => {
    // Create item with quantity 2
    const item = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Multi Quantity', quantity: 2 }
    }).then(r => r.json())

    // First loan should work
    // Second loan should work
    // Third loan should fail (no availability)
  })

  test('item name is required', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { quantity: 1 }
    })
    expect(response.status()).toBe(422)
  })

  test('very long item name is handled', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'A'.repeat(1000), quantity: 1 }
    })
    // Should either truncate or reject
    expect([201, 422]).toContain(response.status())
  })
})
```

### Task 5.2: Bubble Edge Cases

**File:** `tests/e2e/edge-cases/bubbles.edge.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Bubble Edge Cases', () => {
  test('cannot remove last admin from bubble', async ({ authRequest, authToken }) => {
    const bubble = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Last Admin Test' }
    }).then(r => r.json())

    // Get bubble details to find admin member ID
    const details = await authRequest.get(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
    ).then(r => r.json())

    const admin = details.members.find((m: any) => m.role === 'admin')

    // Try to remove self (last admin)
    const response = await authRequest.delete(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${admin.user_id}`
    )

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('last admin')
  })

  test('cannot demote last admin', async ({ authRequest, authToken }) => {
    const bubble = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Demote Test' }
    }).then(r => r.json())

    const details = await authRequest.get(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
    ).then(r => r.json())

    const admin = details.members.find((m: any) => m.role === 'admin')

    // Try to demote self to member
    const response = await authRequest.patch(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${admin.user_id}`,
      { data: { role: 'member' } }
    )

    expect(response.status()).toBe(400)
  })

  test('joining same bubble twice is idempotent', async ({ authRequest, authToken }) => {
    const bubble = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Double Join Test' }
    }).then(r => r.json())

    // Already a member (creator), join again
    const response = await authRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`
    )

    // Should handle gracefully (200 or 400 with message)
    expect([200, 400]).toContain(response.status())
  })

  test('bubble name is required', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: {}
    })
    expect(response.status()).toBe(422)
  })
})
```

### Task 5.3: Loan Edge Cases

**File:** `tests/e2e/edge-cases/loans.edge.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Loan Edge Cases', () => {
  test('cannot borrow own item', async ({ authRequest, authToken }) => {
    // Create item and bubble
    const item = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Own Item', quantity: 1 }
    }).then(r => r.json())

    const bubble = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Self Borrow Test' }
    }).then(r => r.json())

    // Share item
    await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: [bubble.id] }
    })

    // Try to borrow own item
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: { item_id: item.id, bubble_id: bubble.id }
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('own item')
  })

  test('cannot borrow item not shared to bubble', async ({ authRequest, authToken }) => {
    const item = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Unshared Item', quantity: 1 }
    }).then(r => r.json())

    const bubble = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'No Share Bubble' }
    }).then(r => r.json())

    // Don't share item, try to borrow
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: { item_id: item.id, bubble_id: bubble.id }
    })

    expect([400, 403, 404]).toContain(response.status())
  })

  test('loan status transitions are validated', async ({ authRequest }) => {
    // Can't go from 'requested' to 'returned' directly
    // Must be 'requested' -> 'active' -> 'returned'
    // ... test code ...
  })

  test('cannot request loan when item unavailable', async ({ authRequest, authToken }) => {
    // Item quantity exhausted by existing loans
    // ... test code ...
  })

  test('cancelling loan restores item availability', async ({ authRequest }) => {
    // ... test code ...
  })
})
```

### Task 5.4: Username Edge Cases

**File:** `tests/e2e/edge-cases/username.edge.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture'

const API_BASE_URL = 'http://localhost:9990'

test.describe('Username Edge Cases', () => {
  test('username must be unique', async ({ authRequest }) => {
    const username = `unique_${Date.now()}`

    // Set username
    await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username }
    })

    // Check shows unavailable
    const checkResponse = await authRequest.get(
      `${API_BASE_URL}/api/v1/user/check-username/${username}`
    )
    const body = await checkResponse.json()

    // Available for self, would be unavailable for others
    expect(body).toHaveProperty('available')
  })

  test('username can contain valid characters', async ({ authRequest }) => {
    const validUsernames = ['user123', 'user_name', 'User-Name']

    for (const username of validUsernames) {
      const response = await authRequest.get(
        `${API_BASE_URL}/api/v1/user/check-username/${username}`
      )
      expect(response.status()).toBe(200)
    }
  })

  test('empty username update is rejected', async ({ authRequest }) => {
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username: '' }
    })

    expect([400, 422]).toContain(response.status())
  })
})
```

### Test Cases Checklist - Edge Cases
- [ ] Cannot delete item with active loan
- [ ] Item quantity affects loan availability
- [ ] Very long names handled appropriately
- [ ] Cannot remove last admin from bubble
- [ ] Cannot demote last admin
- [ ] Joining bubble twice is idempotent
- [ ] Cannot borrow own item
- [ ] Cannot borrow unshared item
- [ ] Loan status transitions validated
- [ ] Cancelling loan restores availability
- [ ] Username uniqueness enforced
- [ ] Invalid usernames rejected

---

## Implementation Timeline

```
Week 1:
├── Work Stream 1: Test Infrastructure (BLOCKING)
│   └── Must complete first - enables all other work
│
├── After WS1 Complete (can run in parallel):
│   ├── Work Stream 2: User/Profile Tests (Engineer B)
│   ├── Work Stream 3: Authenticated CRUD (Engineer C)
│   ├── Work Stream 4: RLS Security Tests (Engineer D)
│   └── Work Stream 5: Edge Cases (Engineer E)
```

## Parallelization Summary

| Work Stream | Engineer | Dependencies | Can Parallelize With |
|-------------|----------|--------------|---------------------|
| 1. Infrastructure | A | None | - |
| 2. User/Profile | B | WS1 | WS3, WS4, WS5 |
| 3. CRUD Flows | C | WS1 | WS2, WS4, WS5 |
| 4. RLS Security | D | WS1 | WS2, WS3, WS5 |
| 5. Edge Cases | E | WS1 | WS2, WS3, WS4 |

## Success Criteria

1. **Test Count:** Increase from 56 to ~120+ tests
2. **Coverage Areas:**
   - [ ] All API endpoints have auth requirement tests
   - [ ] All API endpoints have authenticated success tests
   - [ ] User/Profile API fully tested
   - [ ] RLS policies verified (multi-user scenarios)
   - [ ] Business logic edge cases covered
3. **CI Integration:**
   - [ ] All tests pass in CI environment
   - [ ] Test auth works without manual setup
   - [ ] Tests run in < 5 minutes
4. **Code Quality:**
   - [ ] Shared fixtures reduce duplication
   - [ ] Tests are independent (no order dependency)
   - [ ] Clear test descriptions

## Known Limitations & Gotchas

1. **Multi-user testing** requires either:
   - Two test users pre-created in Supabase
   - Test endpoint to create users on demand
   - Service role access to create users

2. **Loan lifecycle tests** need two users to properly test borrower/lender interactions

3. **Test cleanup** - decide between:
   - Fresh database per test run (slower, cleaner)
   - Cleanup after each test (faster, more complex)
   - Unique identifiers per test (simplest)

4. **Auth tokens** may expire during long test runs - fixtures should handle refresh

5. **RLS policies** make some assertions tricky - a 404 might mean "not found" or "not authorized to see"

## Files to Create

```
tests/e2e/
├── fixtures/
│   ├── auth.fixture.ts          # WS1
│   ├── data.helpers.ts          # WS1
│   └── multi-user.fixture.ts    # WS4
├── user.spec.ts                 # WS2
├── authenticated/
│   ├── items.auth.spec.ts       # WS3
│   ├── bubbles.auth.spec.ts     # WS3
│   ├── loans.auth.spec.ts       # WS3
│   └── sharing.auth.spec.ts     # WS3
├── security/
│   ├── rls-items.spec.ts        # WS4
│   ├── rls-bubbles.spec.ts      # WS4
│   └── rls-loans.spec.ts        # WS4
└── edge-cases/
    ├── items.edge.spec.ts       # WS5
    ├── bubbles.edge.spec.ts     # WS5
    ├── loans.edge.spec.ts       # WS5
    └── username.edge.spec.ts    # WS5

api/src/routes/
└── test_auth.py                 # WS1 (dev only)
```
