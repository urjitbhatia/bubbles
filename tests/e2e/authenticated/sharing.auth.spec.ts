/**
 * Authenticated Item Sharing E2E Tests
 *
 * Tests for item sharing functionality.
 *
 * These tests use authenticated test users from seed data to verify:
 * - Share item to a single bubble
 * - Share item to multiple bubbles
 * - Cannot share to non-member bubble
 * - Replace existing shares
 * - Unshare from all bubbles
 * - Shared items visible to bubble members
 */

import { test, expect, multiUserTest, API_BASE_URL, TEST_USERS } from '../fixtures/auth.fixture'
import {
  createTestItem,
  createTestBubble,
  shareItemToBubbles,
  getTestItem,
  deleteTestItem,
  deleteTestBubble,
  uniqueItemName,
  uniqueBubbleName,
  TestItem,
} from '../fixtures/data.helpers'

test.describe('Item Sharing - Basic Operations', () => {
  test('can share item to a bubble', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
        data: { bubble_ids: [bubble.id] },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()

      expect(updated.shared_bubbles).toHaveLength(1)
      expect(updated.shared_bubbles[0].id).toBe(bubble.id)
      expect(updated.shared_bubbles[0].name).toBe(bubble.name)
    } finally {
      await deleteTestItem(authRequest, item.id)
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('can share item to multiple bubbles', async ({ authRequest }) => {
    const bubble1 = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const bubble2 = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
        data: { bubble_ids: [bubble1.id, bubble2.id] },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()

      expect(updated.shared_bubbles).toHaveLength(2)
      const sharedBubbleIds = updated.shared_bubbles.map((b: any) => b.id)
      expect(sharedBubbleIds).toContain(bubble1.id)
      expect(sharedBubbleIds).toContain(bubble2.id)
    } finally {
      await deleteTestItem(authRequest, item.id)
      await deleteTestBubble(authRequest, bubble1.id)
      await deleteTestBubble(authRequest, bubble2.id)
    }
  })

  test('sharing replaces existing shares', async ({ authRequest }) => {
    const bubble1 = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const bubble2 = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      // Share to bubble1 first
      await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
        data: { bubble_ids: [bubble1.id] },
      })

      // Share to bubble2 only (replaces bubble1)
      const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
        data: { bubble_ids: [bubble2.id] },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()

      expect(updated.shared_bubbles).toHaveLength(1)
      expect(updated.shared_bubbles[0].id).toBe(bubble2.id)
    } finally {
      await deleteTestItem(authRequest, item.id)
      await deleteTestBubble(authRequest, bubble1.id)
      await deleteTestBubble(authRequest, bubble2.id)
    }
  })

  test('can unshare from all bubbles', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      // Share first
      await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
        data: { bubble_ids: [bubble.id] },
      })

      // Unshare by passing empty array
      const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
        data: { bubble_ids: [] },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()
      expect(updated.shared_bubbles).toEqual([])
    } finally {
      await deleteTestItem(authRequest, item.id)
      await deleteTestBubble(authRequest, bubble.id)
    }
  })

  test('item shows shared bubbles after sharing', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      await shareItemToBubbles(authRequest, item.id, [bubble.id])

      // Fetch item and verify shared_bubbles
      const fetchedItem = await getTestItem(authRequest, item.id)
      expect(fetchedItem).not.toBeNull()
      expect(fetchedItem!.shared_bubbles).toHaveLength(1)
    } finally {
      await deleteTestItem(authRequest, item.id)
      await deleteTestBubble(authRequest, bubble.id)
    }
  })
})

test.describe('Item Sharing - Permission Checks', () => {
  test('cannot share item to non-member bubble', async ({ authRequest }) => {
    // Create item, but the bubble ID we try to share to doesn't exist or user isn't member
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      const fakeBubbleId = '00000000-0000-0000-0000-000000000000'
      const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
        data: { bubble_ids: [fakeBubbleId] },
      })

      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.detail).toContain('Not a member of bubbles')
    } finally {
      await deleteTestItem(authRequest, item.id)
    }
  })

  test('cannot share non-existent item', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, { name: uniqueBubbleName() })

    try {
      const fakeItemId = '00000000-0000-0000-0000-000000000000'
      const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${fakeItemId}/share`, {
        data: { bubble_ids: [bubble.id] },
      })

      expect(response.status()).toBe(404)
      const body = await response.json()
      expect(body.detail).toContain('not found')
    } finally {
      await deleteTestBubble(authRequest, bubble.id)
    }
  })
})

multiUserTest.describe('Item Sharing - Cross-User Access', () => {
  multiUserTest(
    'cannot share item owned by another user',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates item and bubble
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        // Bob joins bubble
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Bob tries to share Alice's item
        const response = await bobRequest.post(
          `${API_BASE_URL}/api/v1/items/${item.id}/share`,
          { data: { bubble_ids: [bubble.id] } }
        )

        // Should fail - Bob doesn't own the item
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'bubble member can see items shared to their bubble',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Shared Item'),
        description: 'An item shared with the bubble',
      })

      try {
        // Bob joins bubble
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Alice shares item
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Bob should be able to see the item via get
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
        expect(response.status()).toBe(200)

        const fetchedItem = await response.json()
        expect(fetchedItem.name).toContain('Shared Item')
        expect(fetchedItem.owner_id).toBe(TEST_USERS.alice.id)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'non-member cannot see items shared to bubble',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        // Bob joins bubble, Carol does not
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Alice shares item to bubble
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Carol (non-member) cannot see the item
        const response = await carolRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
        expect(response.status()).toBe(404)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'member loses access when item is unshared',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        // Bob joins and item is shared
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Verify Bob can access
        const accessCheck = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
        expect(accessCheck.status()).toBe(200)

        // Alice unshares
        await aliceRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
          data: { bubble_ids: [] },
        })

        // Bob can no longer access
        const afterUnshare = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
        expect(afterUnshare.status()).toBe(404)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'member loses access when removed from bubble',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        // Bob joins and item is shared
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Verify Bob can access
        const accessCheck = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
        expect(accessCheck.status()).toBe(200)

        // Alice removes Bob from bubble
        await aliceRequest.delete(
          `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`
        )

        // Bob can no longer access
        const afterRemoval = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
        expect(afterRemoval.status()).toBe(404)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Item Sharing - Edge Cases', () => {
  multiUserTest(
    'sharing to multiple bubbles grants access to all members',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble1 = await createTestBubble(aliceRequest, { name: uniqueBubbleName('Bubble 1') })
      const bubble2 = await createTestBubble(aliceRequest, { name: uniqueBubbleName('Bubble 2') })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        // Bob joins bubble1, Carol joins bubble2
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble1.invite_code}`)
        await carolRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble2.invite_code}`)

        // Alice shares to both bubbles
        await shareItemToBubbles(aliceRequest, item.id, [bubble1.id, bubble2.id])

        // Both Bob and Carol can access
        const bobAccess = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
        expect(bobAccess.status()).toBe(200)

        const carolAccess = await carolRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
        expect(carolAccess.status()).toBe(200)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble1.id)
        await deleteTestBubble(aliceRequest, bubble2.id)
      }
    }
  )

  multiUserTest(
    'partial share update removes access for excluded bubbles',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble1 = await createTestBubble(aliceRequest, { name: uniqueBubbleName('Bubble 1') })
      const bubble2 = await createTestBubble(aliceRequest, { name: uniqueBubbleName('Bubble 2') })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        // Bob joins bubble1, Carol joins bubble2
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble1.invite_code}`)
        await carolRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble2.invite_code}`)

        // Share to both initially
        await shareItemToBubbles(aliceRequest, item.id, [bubble1.id, bubble2.id])

        // Verify both have access
        expect((await bobRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)).status()).toBe(200)
        expect((await carolRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)).status()).toBe(
          200
        )

        // Update share to only bubble1
        await aliceRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
          data: { bubble_ids: [bubble1.id] },
        })

        // Bob still has access, Carol loses it
        expect((await bobRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)).status()).toBe(200)
        expect((await carolRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)).status()).toBe(
          404
        )
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble1.id)
        await deleteTestBubble(aliceRequest, bubble2.id)
      }
    }
  )

  multiUserTest(
    'shared item shows in owner item list with sharing info',
    async ({ aliceRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName('Listed Item') })

      try {
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const response = await aliceRequest.get(`${API_BASE_URL}/api/v1/items`)
        expect(response.status()).toBe(200)

        const data = await response.json()
        const foundItem = data.items.find((i: any) => i.id === item.id)
        expect(foundItem).toBeDefined()
        expect(foundItem.shared_bubbles).toHaveLength(1)
        expect(foundItem.shared_bubbles[0].id).toBe(bubble.id)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})
