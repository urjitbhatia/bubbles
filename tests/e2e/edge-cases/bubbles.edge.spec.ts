/**
 * Bubbles Edge Case Tests
 *
 * Tests for business logic validation and edge cases in bubble management.
 * Verifies admin constraints, membership rules, and validation.
 */

import { test, expect, API_BASE_URL, multiUserTest, TEST_USERS } from '../fixtures/auth.fixture'
import {
  createTestBubble,
  joinTestBubble,
  uniqueBubbleName,
} from '../fixtures/data.helpers'

test.describe('Bubbles Validation Edge Cases', () => {
  test('bubble name is required - returns 422 for missing name', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: {
        description: 'A bubble without a name',
      },
    })

    expect(response.status()).toBe(422)
    const body = await response.json()
    expect(body.detail).toBeDefined()
    expect(JSON.stringify(body.detail)).toContain('name')
  })

  test('bubble name is required - returns 422 for empty name', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: {
        name: '',
      },
    })

    expect(response.status()).toBe(422)
  })

  test('bubble name max length is 100 characters', async ({ authRequest }) => {
    // Test with exactly 100 characters (should succeed)
    const maxLengthName = 'B'.repeat(100)
    const successResponse = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: maxLengthName },
    })

    expect(successResponse.status()).toBe(201)
    const successBody = await successResponse.json()
    expect(successBody.name.length).toBe(100)

    // Test with 101 characters (should fail)
    const tooLongName = 'C'.repeat(101)
    const failResponse = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: tooLongName },
    })

    expect(failResponse.status()).toBe(422)
  })

  test('bubble description max length is 500 characters', async ({ authRequest }) => {
    // Test with exactly 500 characters (should succeed)
    const maxLengthDesc = 'D'.repeat(500)
    const successResponse = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: {
        name: uniqueBubbleName('Long Desc'),
        description: maxLengthDesc,
      },
    })

    expect(successResponse.status()).toBe(201)
    const successBody = await successResponse.json()
    expect(successBody.description?.length).toBe(500)

    // Test with 501 characters (should fail)
    const tooLongDesc = 'E'.repeat(501)
    const failResponse = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: {
        name: uniqueBubbleName('Too Long Desc'),
        description: tooLongDesc,
      },
    })

    expect(failResponse.status()).toBe(422)
  })

  test('update with empty name fails validation', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Update Test'),
    })

    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
      data: { name: '' },
    })

    expect(response.status()).toBe(422)
  })

  test('update with no fields returns 400', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('No Update'),
    })

    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
      data: {},
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('No fields to update')
  })
})

test.describe('Bubbles Admin Edge Cases', () => {
  test('creator is automatically an admin', async ({ authRequest, currentUser }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Admin Check'),
    })

    // Fetch the bubble to verify admin status
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
    const bubbleData = await response.json()

    expect(bubbleData.is_admin).toBe(true)
    expect(bubbleData.members.length).toBe(1)
    expect(bubbleData.members[0].role).toBe('admin')
    expect(bubbleData.members[0].id).toBe(currentUser.id)
  })

  test('cannot change your own role', async ({ authRequest, currentUser }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Self Role Change'),
    })

    const response = await authRequest.patch(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${currentUser.id}`,
      {
        data: { role: 'member' },
      }
    )

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('Cannot change your own role')
  })

  test('cannot leave bubble as only admin - must transfer first', async ({ authRequest, currentUser }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Solo Admin'),
    })

    // Try to remove self (the only admin)
    const response = await authRequest.delete(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${currentUser.id}`
    )

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('only admin')
    expect(body.detail).toContain('Transfer admin role')
  })
})

test.describe('Bubbles Join Edge Cases', () => {
  test('joining same bubble twice returns error', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Double Join'),
    })

    // Try to join again with the same invite code
    const response = await authRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`
    )

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('Already a member')
  })

  test('invalid invite code returns 404', async ({ authRequest }) => {
    const response = await authRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/join/INVALIDCODE123`
    )

    expect(response.status()).toBe(404)
    const body = await response.json()
    expect(body.detail).toContain('Invalid invite code')
  })

  test('invite code is case-insensitive', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Case Test'),
    })

    // Invite codes are stored uppercase, test with lowercase
    const lowercaseCode = bubble.invite_code.toLowerCase()

    // Already a member, but the code should be recognized
    const response = await authRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/join/${lowercaseCode}`
    )

    // Should be 400 (already member), not 404 (invalid code)
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('Already a member')
  })
})

multiUserTest.describe('Bubbles Multi-User Admin Edge Cases', () => {
  multiUserTest('non-admin cannot update bubble', async ({ aliceRequest, bobRequest }) => {
    // Alice creates a bubble
    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Admin Only Update'),
    })

    // Bob joins
    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // Bob tries to update (should fail - not admin)
    const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
      data: { name: 'Bob Updated' },
    })

    expect(response.status()).toBe(403)
    const body = await response.json()
    expect(body.detail).toContain('Admin access required')
  })

  multiUserTest('non-admin cannot delete bubble', async ({ aliceRequest, bobRequest }) => {
    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Admin Only Delete'),
    })

    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    const response = await bobRequest.delete(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)

    expect(response.status()).toBe(403)
  })

  multiUserTest('non-admin cannot remove members', async ({ aliceRequest, bobRequest }) => {
    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Admin Only Remove'),
    })

    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // Bob tries to remove Alice (the admin)
    const response = await bobRequest.delete(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.alice.id}`
    )

    expect(response.status()).toBe(403)
  })

  multiUserTest('non-admin cannot change member roles', async ({ aliceRequest, bobRequest }) => {
    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Admin Only Roles'),
    })

    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // Bob tries to promote himself to admin
    const response = await bobRequest.patch(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`,
      {
        data: { role: 'admin' },
      }
    )

    expect(response.status()).toBe(403)
  })

  multiUserTest('non-admin cannot regenerate invite code', async ({ aliceRequest, bobRequest }) => {
    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Admin Only Regen'),
    })

    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    const response = await bobRequest.post(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/regenerate-code`
    )

    expect(response.status()).toBe(403)
  })

  multiUserTest(
    'admin can remove member from bubble',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Remove Member'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

      // Verify Bob is a member
      const beforeResponse = await aliceRequest.get(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
      )
      const beforeData = await beforeResponse.json()
      expect(beforeData.members.length).toBe(2)

      // Alice removes Bob
      const removeResponse = await aliceRequest.delete(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`
      )

      expect(removeResponse.status()).toBe(204)

      // Verify Bob is no longer a member
      const afterResponse = await aliceRequest.get(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
      )
      const afterData = await afterResponse.json()
      expect(afterData.members.length).toBe(1)
    }
  )

  multiUserTest(
    'admin can promote member to admin',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Promote Member'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

      // Alice promotes Bob to admin
      const promoteResponse = await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`,
        {
          data: { role: 'admin' },
        }
      )

      expect(promoteResponse.status()).toBe(200)
      const promoted = await promoteResponse.json()
      expect(promoted.role).toBe('admin')
    }
  )

  multiUserTest(
    'admin can demote another admin to member',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Demote Admin'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

      // Alice promotes Bob to admin first
      await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`,
        {
          data: { role: 'admin' },
        }
      )

      // Alice demotes Bob back to member
      const demoteResponse = await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`,
        {
          data: { role: 'member' },
        }
      )

      expect(demoteResponse.status()).toBe(200)
      const demoted = await demoteResponse.json()
      expect(demoted.role).toBe('member')
    }
  )

  multiUserTest(
    'can leave bubble after promoting another admin',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Leave After Promote'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

      // Alice promotes Bob to admin
      await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`,
        {
          data: { role: 'admin' },
        }
      )

      // Now Alice can leave (Bob is also admin)
      const leaveResponse = await aliceRequest.delete(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.alice.id}`
      )

      expect(leaveResponse.status()).toBe(204)

      // Verify Alice is no longer a member
      const bubbleResponse = await bobRequest.get(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
      )
      const bubbleData = await bubbleResponse.json()
      expect(bubbleData.members.length).toBe(1)
      expect(bubbleData.members[0].id).toBe(TEST_USERS.bob.id)
    }
  )

  multiUserTest(
    'joining bubble twice is idempotent - returns error but no state change',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Idempotent Join'),
      })

      // Bob joins
      const firstJoin = await bobRequest.post(
        `${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`
      )
      expect(firstJoin.status()).toBe(200)

      // Get member count
      const bubbleResponse1 = await aliceRequest.get(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
      )
      const bubbleData1 = await bubbleResponse1.json()
      const memberCountBefore = bubbleData1.members.length

      // Bob tries to join again
      const secondJoin = await bobRequest.post(
        `${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`
      )
      expect(secondJoin.status()).toBe(400)

      // Verify member count hasn't changed (idempotent behavior)
      const bubbleResponse2 = await aliceRequest.get(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}`
      )
      const bubbleData2 = await bubbleResponse2.json()
      expect(bubbleData2.members.length).toBe(memberCountBefore)
    }
  )

  multiUserTest('member can leave bubble themselves', async ({ aliceRequest, bobRequest }) => {
    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Self Leave'),
    })

    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // Bob removes himself
    const leaveResponse = await bobRequest.delete(
      `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`
    )

    expect(leaveResponse.status()).toBe(204)

    // Verify Bob is no longer a member
    const bobBubblesResponse = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
    const bobBubbles = await bobBubblesResponse.json()
    const bobInBubble = bobBubbles.bubbles.find(
      (b: { id: string }) => b.id === bubble.id
    )
    expect(bobInBubble).toBeUndefined()
  })
})
