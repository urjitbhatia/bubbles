/**
 * RLS Security Tests - Bubbles
 *
 * TEST-018: Verifies Row Level Security policies for bubbles.
 * Tests that users cannot access non-member bubbles and that
 * role-based permissions (admin vs member) are enforced.
 */

import { multiUserTest, expect, API_BASE_URL, TEST_USERS } from '../fixtures/auth.fixture'
import {
  createTestBubble,
  joinTestBubble,
  deleteTestBubble,
  uniqueBubbleName,
} from '../fixtures/data.helpers'

multiUserTest.describe('Bubbles RLS - Non-Member Access', () => {
  multiUserTest(
    'user cannot see bubbles they are not a member of via GET /bubbles/:id',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a private bubble
      const aliceBubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Alice Only'),
        description: 'Private bubble',
      })

      try {
        // Bob tries to access Alice's bubble directly
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles/${aliceBubble.id}`)

        // Should return 404 (not found for this user)
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestBubble(aliceRequest, aliceBubble.id)
      }
    }
  )

  multiUserTest(
    'user only sees their own bubbles in list',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const aliceBubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Alice Private'),
      })

      // Bob creates a bubble
      const bobBubble = await createTestBubble(bobRequest, {
        name: uniqueBubbleName('Bob Private'),
      })

      try {
        // Alice lists her bubbles
        let response = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
        expect(response.ok()).toBe(true)
        let body = await response.json()

        // Alice should see her bubble but NOT Bob's
        const aliceSeesHer = body.bubbles.some(
          (b: { id: string }) => b.id === aliceBubble.id
        )
        const aliceSeesBob = body.bubbles.some(
          (b: { id: string }) => b.id === bobBubble.id
        )
        expect(aliceSeesHer).toBe(true)
        expect(aliceSeesBob).toBe(false)

        // Bob lists his bubbles
        response = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
        expect(response.ok()).toBe(true)
        body = await response.json()

        // Bob should see his bubble but NOT Alice's
        const bobSeesHis = body.bubbles.some(
          (b: { id: string }) => b.id === bobBubble.id
        )
        const bobSeesAlice = body.bubbles.some(
          (b: { id: string }) => b.id === aliceBubble.id
        )
        expect(bobSeesHis).toBe(true)
        expect(bobSeesAlice).toBe(false)
      } finally {
        await deleteTestBubble(aliceRequest, aliceBubble.id)
        await deleteTestBubble(bobRequest, bobBubble.id)
      }
    }
  )
})

multiUserTest.describe('Bubbles RLS - Admin-Only Operations', () => {
  multiUserTest(
    'non-admin member cannot update bubble',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble (she's the admin)
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Admin Test'),
        description: 'Original description',
      })

      // Bob joins as a regular member
      await joinTestBubble(bobRequest, bubble.invite_code)

      try {
        // Bob tries to update the bubble
        const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
          data: { name: 'Unauthorized Name Change' },
        })

        // Should be forbidden (not admin)
        expect(response.status()).toBe(403)

        const body = await response.json()
        expect(body.detail).toContain('Admin')

        // Verify bubble wasn't changed
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        const unchanged = await checkResponse.json()
        expect(unchanged.name).not.toBe('Unauthorized Name Change')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'non-admin member cannot delete bubble',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Delete Test'),
      })

      // Bob joins
      await joinTestBubble(bobRequest, bubble.invite_code)

      try {
        // Bob tries to delete
        const response = await bobRequest.delete(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)

        expect(response.status()).toBe(403)

        // Bubble still exists
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        expect(checkResponse.ok()).toBe(true)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'non-admin cannot change member roles',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Role Test'),
      })

      // Bob and Carol join
      await joinTestBubble(bobRequest, bubble.invite_code)
      await joinTestBubble(carolRequest, bubble.invite_code)

      try {
        // Bob (non-admin) tries to make Carol an admin
        const response = await bobRequest.patch(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.carol.id}`,
          {
            data: { role: 'admin' },
          }
        )

        expect(response.status()).toBe(403)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'non-admin cannot remove other members',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Remove Test'),
      })

      // Bob and Carol join
      await joinTestBubble(bobRequest, bubble.invite_code)
      await joinTestBubble(carolRequest, bubble.invite_code)

      try {
        // Bob (non-admin) tries to remove Carol
        const response = await bobRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.carol.id}`
        )

        expect(response.status()).toBe(403)

        // Carol should still be a member
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        const bubbleData = await checkResponse.json()
        const carolStillMember = bubbleData.members.some(
          (m: { id: string }) => m.id === TEST_USERS.carol.id
        )
        expect(carolStillMember).toBe(true)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'non-admin cannot regenerate invite code',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Code Test'),
      })
      const originalCode = bubble.invite_code

      // Bob joins
      await joinTestBubble(bobRequest, bubble.invite_code)

      try {
        // Bob tries to regenerate the code
        const response = await bobRequest.post(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/regenerate-code`
        )

        expect(response.status()).toBe(403)

        // Code should be unchanged
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        const bubbleData = await checkResponse.json()
        expect(bubbleData.invite_code).toBe(originalCode)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Bubbles RLS - Self-Actions', () => {
  multiUserTest(
    'member CAN leave bubble (self-remove)',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Leave Test'),
      })

      // Bob joins
      await joinTestBubble(bobRequest, bubble.invite_code)

      // Verify Bob is a member
      let response = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
      expect(response.ok()).toBe(true)

      try {
        // Bob removes himself (leaves the bubble)
        response = await bobRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`
        )

        // Should succeed (204 No Content)
        expect(response.status()).toBe(204)

        // Bob should no longer see the bubble
        response = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'last admin cannot leave bubble',
    async ({ aliceRequest }) => {
      // Alice creates a bubble (she's the only admin)
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Solo Admin'),
      })

      try {
        // Alice tries to leave (but she's the only admin)
        const response = await aliceRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.alice.id}`
        )

        // Should fail - cannot leave as last admin
        expect(response.status()).toBe(400)

        const body = await response.json()
        expect(body.detail).toContain('admin')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'admin can leave if there is another admin',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Multi Admin'),
      })

      // Bob joins
      await joinTestBubble(bobRequest, bubble.invite_code)

      // Alice promotes Bob to admin
      await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`,
        {
          data: { role: 'admin' },
        }
      )

      try {
        // Alice can now leave because Bob is also an admin
        const response = await aliceRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.alice.id}`
        )

        expect(response.status()).toBe(204)

        // Alice no longer has access
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        expect([403, 404]).toContain(checkResponse.status())
      } finally {
        // Bob is now the admin, cleanup with Bob
        await deleteTestBubble(bobRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Bubbles RLS - Admin Permissions', () => {
  multiUserTest(
    'admin CAN update bubble',
    async ({ aliceRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Update Test'),
        description: 'Original',
      })

      try {
        const response = await aliceRequest.patch(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`, {
          data: {
            name: 'Updated Name',
            description: 'Updated description',
          },
        })

        expect(response.ok()).toBe(true)

        const updated = await response.json()
        expect(updated.name).toBe('Updated Name')
        expect(updated.description).toBe('Updated description')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'admin CAN remove other members',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Admin Remove'),
      })

      await joinTestBubble(bobRequest, bubble.invite_code)

      try {
        // Alice (admin) removes Bob
        const response = await aliceRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`
        )

        expect(response.status()).toBe(204)

        // Bob no longer has access
        const checkResponse = await bobRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        expect([403, 404]).toContain(checkResponse.status())
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'admin CAN change member roles',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Role Change'),
      })

      await joinTestBubble(bobRequest, bubble.invite_code)

      try {
        // Alice promotes Bob to admin
        const response = await aliceRequest.patch(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`,
          {
            data: { role: 'admin' },
          }
        )

        expect(response.ok()).toBe(true)

        const updated = await response.json()
        expect(updated.role).toBe('admin')

        // Verify by getting bubble info
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        const bubbleData = await checkResponse.json()
        const bobMember = bubbleData.members.find(
          (m: { id: string }) => m.id === TEST_USERS.bob.id
        )
        expect(bobMember.role).toBe('admin')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'admin cannot change their own role',
    async ({ aliceRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Self Role'),
      })

      try {
        // Alice tries to demote herself
        const response = await aliceRequest.patch(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.alice.id}`,
          {
            data: { role: 'member' },
          }
        )

        expect(response.status()).toBe(400)

        const body = await response.json()
        expect(body.detail).toContain('own role')
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Bubbles RLS - Third Party', () => {
  multiUserTest(
    'third user has no visibility into private bubble between others',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      // Alice creates bubble, Bob joins, Carol is NOT involved
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Private Club'),
      })

      await joinTestBubble(bobRequest, bubble.invite_code)

      try {
        // Carol cannot see the bubble
        const response = await carolRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
        expect([403, 404]).toContain(response.status())

        // Carol's bubble list doesn't include it
        const listResponse = await carolRequest.get(`${API_BASE_URL}/api/v1/bubbles`)
        const list = await listResponse.json()
        const found = list.bubbles.some((b: { id: string }) => b.id === bubble.id)
        expect(found).toBe(false)
      } finally {
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})
