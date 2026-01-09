import { test, expect } from '@playwright/test'
import {
  test as authTest,
  expect as authExpect,
  API_BASE_URL,
  TEST_USERS,
} from './fixtures/auth.fixture'
import { getTestUserProfile } from './fixtures/data.helpers'

/**
 * User/Profile API E2E Tests
 *
 * Tests for /api/v1/user/* endpoints including authentication
 * requirements and authenticated operations.
 */

// ============================================================================
// UNAUTHENTICATED TESTS
// ============================================================================

test.describe('User API Authentication', () => {
  test('GET /api/v1/user/me requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/user/me`)
    expect([401, 403]).toContain(response.status())
  })

  test('PATCH /api/v1/user/me requires authentication', async ({ request }) => {
    const response = await request.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { display_name: 'Hacker' },
    })
    expect([401, 403]).toContain(response.status())
  })

  test('POST /api/v1/user/setup requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/user/setup`, {
      data: { display_name: 'New User' },
    })
    expect([401, 403]).toContain(response.status())
  })

  test('GET /api/v1/user/check-username/{username} requires auth', async ({
    request,
  }) => {
    const response = await request.get(
      `${API_BASE_URL}/api/v1/user/check-username/testuser`
    )
    expect([401, 403]).toContain(response.status())
  })
})

// ============================================================================
// AUTHENTICATED TESTS
// ============================================================================

authTest.describe('User Profile Operations', () => {
  authTest('can get own profile', async ({ authRequest, currentUser }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/user/me`)

    authExpect(response.status()).toBe(200)

    const body = await response.json()
    authExpect(body).toHaveProperty('id')
    authExpect(body).toHaveProperty('display_name')
    authExpect(body.id).toBe(currentUser.id)
  })

  authTest('profile contains expected fields', async ({ authRequest }) => {
    const profile = await getTestUserProfile(authRequest)

    authExpect(profile).toHaveProperty('id')
    authExpect(profile).toHaveProperty('display_name')
    authExpect(profile).toHaveProperty('username')
    authExpect(profile).toHaveProperty('created_at')
  })

  authTest('can update display name', async ({ authRequest }) => {
    // First get current profile
    const originalProfile = await getTestUserProfile(authRequest)

    // Update with a unique name
    const newName = `Test Name ${Date.now()}`
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { display_name: newName },
    })

    authExpect(response.status()).toBe(200)
    const updated = await response.json()
    authExpect(updated.display_name).toBe(newName)

    // Restore original name
    await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { display_name: originalProfile.display_name },
    })
  })

  authTest('can check username availability', async ({ authRequest }) => {
    const uniqueUsername = `available_${Date.now()}`
    const response = await authRequest.get(
      `${API_BASE_URL}/api/v1/user/check-username/${uniqueUsername}`
    )

    authExpect(response.status()).toBe(200)
    const body = await response.json()
    authExpect(body).toHaveProperty('username', uniqueUsername)
    authExpect(body).toHaveProperty('available', true)
  })

  authTest('taken username shows as unavailable', async ({ authRequest }) => {
    // Check Alice's username (from seed data) - should be unavailable for others
    // Note: For the same user checking their own username, it returns available=true
    const response = await authRequest.get(
      `${API_BASE_URL}/api/v1/user/check-username/${TEST_USERS.bob.username}`
    )

    authExpect(response.status()).toBe(200)
    const body = await response.json()
    authExpect(body).toHaveProperty('username', TEST_USERS.bob.username)
    // Bob's username should be unavailable for Alice
    authExpect(body).toHaveProperty('available', false)
  })
})

authTest.describe('Profile Setup', () => {
  authTest('setup updates existing profile', async ({ authRequest }) => {
    // For existing users (seeded), setup acts like update
    const originalProfile = await getTestUserProfile(authRequest)

    const response = await authRequest.post(`${API_BASE_URL}/api/v1/user/setup`, {
      data: { display_name: `Setup Test ${Date.now()}` },
    })

    // Should succeed (200 or 201)
    authExpect([200, 201]).toContain(response.status())

    // Restore original
    await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { display_name: originalProfile.display_name },
    })
  })
})

authTest.describe('Username Operations', () => {
  authTest('can update username with valid value', async ({ authRequest }) => {
    const originalProfile = await getTestUserProfile(authRequest)

    // Update with a unique username
    const newUsername = `testuser_${Date.now()}`
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username: newUsername },
    })

    authExpect(response.status()).toBe(200)
    const updated = await response.json()
    authExpect(updated.username).toBe(newUsername)

    // Restore original username
    await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username: originalProfile.username },
    })
  })

  authTest('cannot update to taken username', async ({ authRequest }) => {
    // Try to take Bob's username (Alice is the current user)
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username: TEST_USERS.bob.username },
    })

    authExpect(response.status()).toBe(400)
    const body = await response.json()
    authExpect(body.detail).toContain('Username already taken')
  })

  authTest('own username shows as available', async ({ authRequest, currentUser }) => {
    // Alice checking Alice's username should return available=true
    const response = await authRequest.get(
      `${API_BASE_URL}/api/v1/user/check-username/${currentUser.username}`
    )

    authExpect(response.status()).toBe(200)
    const body = await response.json()
    authExpect(body).toHaveProperty('username', currentUser.username)
    // User's own username should show as available (they can keep it)
    authExpect(body).toHaveProperty('available', true)
  })
})

authTest.describe('Profile Validation', () => {
  authTest('empty update is rejected', async ({ authRequest }) => {
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: {},
    })

    // Should reject empty update
    authExpect(response.status()).toBe(400)
  })

  authTest('error response includes detail field', async ({ authRequest }) => {
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: {},
    })

    const body = await response.json()
    authExpect(body).toHaveProperty('detail')
  })

  authTest('rejects username that is too short', async ({ authRequest }) => {
    // Username must be at least 3 characters (min_length=3 in model)
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username: 'ab' },
    })

    // FastAPI returns 422 for validation errors
    authExpect(response.status()).toBe(422)
  })

  authTest('rejects username that is too long', async ({ authRequest }) => {
    // Username max is 30 characters (max_length=30 in model)
    const longUsername = 'a'.repeat(31)
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username: longUsername },
    })

    authExpect(response.status()).toBe(422)
  })

  authTest('rejects username with invalid characters', async ({ authRequest }) => {
    // Username must match ^[a-zA-Z0-9_]+$ pattern
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { username: 'invalid-username!' },
    })

    authExpect(response.status()).toBe(422)
  })

  authTest('rejects display_name that is too long', async ({ authRequest }) => {
    // display_name max is 100 characters (max_length=100 in model)
    const longName = 'A'.repeat(101)
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: { display_name: longName },
    })

    authExpect(response.status()).toBe(422)
  })
})

authTest.describe('Profile Field Completeness', () => {
  authTest('profile includes avatar_url field', async ({ authRequest }) => {
    const profile = await getTestUserProfile(authRequest)

    // avatar_url is optional but should be present in the response
    authExpect(profile).toHaveProperty('avatar_url')
  })

  authTest('can update both display_name and username together', async ({
    authRequest,
  }) => {
    const originalProfile = await getTestUserProfile(authRequest)

    const newDisplayName = `Both Test ${Date.now()}`
    const newUsername = `both_${Date.now()}`

    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: {
        display_name: newDisplayName,
        username: newUsername,
      },
    })

    authExpect(response.status()).toBe(200)
    const updated = await response.json()
    authExpect(updated.display_name).toBe(newDisplayName)
    authExpect(updated.username).toBe(newUsername)

    // Restore original values
    await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
      data: {
        display_name: originalProfile.display_name,
        username: originalProfile.username,
      },
    })
  })
})
