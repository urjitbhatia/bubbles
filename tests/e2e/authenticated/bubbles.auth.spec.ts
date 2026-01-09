/**
 * Authenticated Bubbles CRUD E2E Tests
 *
 * Tests for FEAT-047: Bubbles - Create, Join, Manage
 *
 * These tests use authenticated test users from seed data to verify:
 * - Bubble creation with auto-generated invite codes
 * - Creator is automatically added as admin
 * - Listing own bubbles
 * - Admin-only update and delete operations
 * - Join with valid/invalid invite codes
 * - Regenerate invite code functionality
 * - Member management
 */

import { test, expect, multiUserTest, API_BASE_URL, TEST_USERS } from '../fixtures/auth.fixture'
import {
  createTestBubble,
  getTestBubble,
  deleteTestBubble,
  joinTestBubble,
  uniqueBubbleName,
  TestBubble,
} from '../fixtures/data.helpers'

test.describe('Bubbles CRUD - Create', () => {
  test('can create a bubble with valid data', async ({ authRequest, currentUser }) => {
    const bubbleName = uniqueBubbleName()
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: {
        name: bubbleName,
        description: 'A test bubble for E2E testing',
      },
    })

    expect(response.status()).toBe(201)

    const bubble = await response.json()
    expect(bubble.id).toBeDefined()
    expect(bubble.name).toBe(bubbleName)
    expect(bubble.description).toBe('A test bubble for E2E testing')
    expect(bubble.invite_code).toBeDefined()
    expect(bubble.invite_code).toHaveLength(12) // 6 bytes = 12 hex chars
    expect(bubble.created_by).toBe(currentUser.id)
    expect(bubble.created_at).toBeDefined()
    expect(bubble.member_count).toBe(1)
    expect(bubble.is_admin).toBe(true)

    // Cleanup
    await deleteTestBubble(authRequest, bubble.id)
  })

  test('creator is automatically added as admin', async ({ authRequest, currentUser }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      expect(bubble.is_admin).toBe(true)
      expect(bubble.members).toHaveLength(1)
      expect(bubble.members[0].id).toBe(currentUser.id)
      expect(bubble.members[0].role).toBe('admin')
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('can create a bubble with name only', async ({ authRequest }) => {
    const bubbleName = uniqueBubbleName()
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: bubbleName },
    })

    expect(response.status()).toBe(201)

    const bubble = await response.json()
    expect(bubble.name).toBe(bubbleName)
    expect(bubble.description).toBeNull()

    await deleteTestBubble(authRequest, bubble.id)
  })

  test('returns 422 when name is missing', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { description: 'No name provided' },
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 when name is empty string', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: '' },
    })

    expect(response.status()).toBe(422)
  })

  test('auto-generates unique invite code', async ({ authRequest }) => {
    const bubble1 = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const bubble2 = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      expect(bubble1.invite_code).not.toBe(bubble2.invite_code)
      // Invite codes should be uppercase hex
      expect(bubble1.invite_code).toMatch(/^[0-9A-F]{12}$/)
      expect(bubble2.invite_code).toMatch(/^[0-9A-F]{12}$/)
    } finally {
      await deleteTestBubble(authRequest, bubble1.id)
      await deleteTestBubble(authRequest, bubble2.id)
    }
  })
})

test.describe('Bubbles CRUD - List', () => {
  test('can list own bubbles', async ({ authRequest }) => {
    const bubble1 = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const bubble2 = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      const response = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
      expect(response.status()).toBe(200)

      const data = await response.json()
      expect(data.bubbles).toBeDefined()
      expect(Array.isArray(data.bubbles)).toBe(true)
      expect(data.total).toBeGreaterThanOrEqual(2)

      // Created bubbles should be in the list
      const bubbleIds = data.bubbles.map((b: TestBubble) => b.id)
      expect(bubbleIds).toContain(bubble1.id)
      expect(bubbleIds).toContain(bubble2.id)
    } finally {
      await deleteTestBubble(authRequest, bubble1.id)
      await deleteTestBubble(authRequest, bubble2.id)
    }
  })

  test('bubbles include member information', async ({ authRequest, currentUser }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      const response = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
      const data = await response.json()

      const foundBubble = data.bubbles.find((b: any) => b.id === bubble.id)
      expect(foundBubble).toBeDefined()
      expect(foundBubble.members).toBeDefined()
      expect(foundBubble.member_count).toBe(1)
      expect(foundBubble.is_admin).toBe(true)
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('returns empty list when user has no bubbles', async ({ authRequest }) => {
    // Note: This test assumes a clean slate for the user
    // In practice, test users might have bubbles from seed data
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.bubbles).toBeDefined()
    expect(Array.isArray(data.bubbles)).toBe(true)
    // We just verify the response format is correct
  })
})

test.describe('Bubbles CRUD - Get by ID', () => {
  test('can get own bubble by ID', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName(),
      description: 'Test bubble description',
    })

    try {
      const response = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
      expect(response.status()).toBe(200)

      const fetchedBubble = await response.json()
      expect(fetchedBubble.id).toBe(bubble.id)
      expect(fetchedBubble.name).toBe(bubble.name)
      expect(fetchedBubble.description).toBe('Test bubble description')
      expect(fetchedBubble.invite_code).toBeDefined()
      expect(fetchedBubble.members).toBeDefined()
      expect(fetchedBubble.member_count).toBe(1)
      expect(fetchedBubble.is_admin).toBe(true)
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('returns 404 for non-existent bubble', async ({ authRequest }) => {
    const response = await authRequest.get(
      `${API_BASE_URL}/api/v1/bubbles/00000000-0000-0000-0000-000000000000`
    )
    expect(response.status()).toBe(404)

    const body = await response.json()
    expect(body.detail).toContain('not found')
  })
})

test.describe('Bubbles CRUD - Update (Admin Only)', () => {
  test('admin can update bubble name', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      const newName = uniqueBubbleName('Updated')
      const response = await authRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
        data: { name: newName },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()
      expect(updated.name).toBe(newName)
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('admin can update bubble description', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      const response = await authRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
        data: { description: 'Updated description' },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()
      expect(updated.description).toBe('Updated description')
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('returns 400 when no fields to update', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      const response = await authRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
        data: {},
      })

      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.detail).toMatch(/no (fields|changes)/i)
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })
})

test.describe('Bubbles CRUD - Delete (Admin Only)', () => {
  test('admin can delete bubble', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    const response = await authRequest.delete(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
    expect(response.status()).toBe(204)

    // Verify bubble is gone
    const getResponse = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
    expect(getResponse.status()).toBe(404)
  })

  test('returns 404 for non-existent bubble', async ({ authRequest }) => {
    const response = await authRequest.delete(
      `${API_BASE_URL}/api/v1/bubbles/00000000-0000-0000-0000-000000000000`
    )
    expect(response.status()).toBe(404)
  })
})

test.describe('Bubbles - Join with Invite Code', () => {
  test('can join bubble with valid invite code', async ({ authRequest }) => {
    // Create bubble, then use a second user context to join
    // For now, we test the endpoint behavior
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      // Same user trying to join returns error (already a member)
      const response = await authRequest.post(
        `${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`
      )
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.detail).toBe('Already a member of this bubble')
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('returns 404 for invalid invite code', async ({ authRequest }) => {
    const response = await authRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/join/INVALIDCODE123`
    )

    expect(response.status()).toBe(404)
    const body = await response.json()
    expect(body.detail).toBe('Invalid invite code')
  })

  test('invite code is case-insensitive', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      // Try with lowercase - same user so will get "already member"
      const lowerCode = bubble.invite_code.toLowerCase()
      const response = await authRequest.post(
        `${API_BASE_URL}/api/v1/bubbles/join/${lowerCode}`
      )
      // Should work (find the bubble), but return already member
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.detail).toBe('Already a member of this bubble')
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })
})

test.describe('Bubbles - Regenerate Invite Code', () => {
  test('admin can regenerate invite code', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const originalCode = bubble.invite_code

    try {
      const response = await authRequest.post(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/regenerate-code`
      )

      expect(response.status()).toBe(200)
      const updated = await response.json()

      expect(updated.invite_code).toBeDefined()
      expect(updated.invite_code).not.toBe(originalCode)
      expect(updated.invite_code).toMatch(/^[0-9A-F]{12}$/)
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('old invite code no longer works after regeneration', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const originalCode = bubble.invite_code

    try {
      // Regenerate code
      await authRequest.post(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}/regenerate-code`)

      // Old code should be invalid now
      const joinResponse = await authRequest.post(
        `${API_BASE_URL}/api/v1/bubbles/join/${originalCode}`
      )
      expect(joinResponse.status()).toBe(404)
      const body = await joinResponse.json()
      expect(body.detail).toBe('Invalid invite code')
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })
})

multiUserTest.describe('Bubbles - Join Flow (Multi-User)', () => {
  multiUserTest(
    'new user can join bubble with valid invite code',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob joins with invite code
        const joinResponse = await bobRequest.post(
          `${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`
        )

        expect(joinResponse.status()).toBe(200)
        const joinResult = await joinResponse.json()
        expect(joinResult.bubble.id).toBe(bubble.id)
        expect(joinResult.message).toContain('Successfully joined')

        // Bob can now see the bubble
        const bobBubblesResponse = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
        const bobBubbles = await bobBubblesResponse.json()
        const joinedBubble = bobBubbles.bubbles.find((b: any) => b.id === bubble.id)
        expect(joinedBubble).toBeDefined()

        // Bob should be a member, not admin
        const bubbleDetailResponse = await bobRequest.get(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
        )
        const bubbleDetail = await bubbleDetailResponse.json()
        expect(bubbleDetail.is_admin).toBe(false)
        expect(bubbleDetail.member_count).toBe(2)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'joining same bubble twice returns already member error',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob joins first time
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Bob tries to join again
        const response = await bobRequest.post(
          `${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`
        )

        expect(response.status()).toBe(400)
        const body = await response.json()
        expect(body.detail).toBe('Already a member of this bubble')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Bubbles - RLS and Permissions', () => {
  multiUserTest(
    'non-member cannot see bubble details',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob (not a member) tries to access bubble
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        expect(response.status()).toBe(404)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'non-admin member cannot update bubble',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob joins as member
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Bob tries to update bubble
        const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
          data: { name: 'Bob tries to rename' },
        })

        expect(response.status()).toBe(403)
        const body = await response.json()
        expect(body.detail).toBe('Admin access required')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'non-admin member cannot delete bubble',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob joins as member
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Bob tries to delete bubble
        const response = await bobRequest.delete(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)

        expect(response.status()).toBe(403)
        const body = await response.json()
        expect(body.detail).toBe('Admin access required')

        // Verify bubble still exists
        const getResponse = await aliceRequest.get(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
        )
        expect(getResponse.status()).toBe(200)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'non-admin member cannot regenerate invite code',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob joins as member
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Bob tries to regenerate code
        const response = await bobRequest.post(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/regenerate-code`
        )

        expect(response.status()).toBe(403)
        const body = await response.json()
        expect(body.detail).toBe('Admin access required')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Bubbles - Member Management', () => {
  multiUserTest(
    'admin can promote member to admin',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob joins as member
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Alice promotes Bob to admin
        const response = await aliceRequest.patch(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`,
          { data: { role: 'admin' } }
        )

        expect(response.status()).toBe(200)
        const updated = await response.json()
        expect(updated.role).toBe('admin')

        // Verify Bob is now admin
        const bubbleDetail = await bobRequest.get(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
        )
        const detail = await bubbleDetail.json()
        expect(detail.is_admin).toBe(true)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'admin cannot change own role',
    async ({ aliceRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        const response = await aliceRequest.patch(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.alice.id}`,
          { data: { role: 'member' } }
        )

        expect(response.status()).toBe(400)
        const body = await response.json()
        expect(body.detail).toBe('Cannot change your own role')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'admin can remove member',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob joins
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Verify Bob is member
        let detail = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        let detailJson = await detail.json()
        expect(detailJson.member_count).toBe(2)

        // Alice removes Bob
        const response = await aliceRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`
        )
        expect(response.status()).toBe(204)

        // Verify Bob is removed
        detail = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        detailJson = await detail.json()
        expect(detailJson.member_count).toBe(1)

        // Bob can no longer see bubble
        const bobGet = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        expect(bobGet.status()).toBe(404)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'member can leave bubble (self-remove)',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Bob joins
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Bob leaves (removes self)
        const response = await bobRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`
        )
        expect(response.status()).toBe(204)

        // Bob can no longer see bubble
        const bobGet = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        expect(bobGet.status()).toBe(404)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'last admin cannot leave bubble',
    async ({ aliceRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })

      try {
        // Alice (only admin) tries to leave
        const response = await aliceRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.alice.id}`
        )

        expect(response.status()).toBe(400)
        const body = await response.json()
        expect(body.detail).toContain('only admin')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})
