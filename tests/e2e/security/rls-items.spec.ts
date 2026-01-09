/**
 * RLS Security Tests - Items
 *
 * TEST-018: Verifies Row Level Security policies for items.
 * Tests that users cannot access, modify, or delete other users' items
 * unless the items are shared to a bubble they belong to.
 */

import { multiUserTest, expect, API_BASE_URL, TEST_USERS } from '../fixtures/auth.fixture'
import {
  createTestItem,
  createTestBubble,
  shareItemToBubbles,
  joinTestBubble,
  deleteTestItem,
  deleteTestBubble,
  uniqueItemName,
  uniqueBubbleName,
} from '../fixtures/data.helpers'

multiUserTest.describe('Items RLS - Cross-User Access', () => {
  multiUserTest(
    'user cannot see another user\'s unshared items via GET /items/:id',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a private item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Alice Private'),
        description: 'This is Alice\'s private item',
        quantity: 1,
      })

      try {
        // Bob tries to access Alice's item directly - should fail
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)

        // Should return 404 (item not found for this user) or 403 (forbidden)
        expect([403, 404]).toContain(response.status())

        // Verify error response format
        const body = await response.json()
        expect(body).toHaveProperty('detail')
      } finally {
        // Cleanup
        await deleteTestItem(aliceRequest, aliceItem.id)
      }
    }
  )

  multiUserTest(
    'user cannot see another user\'s items in their list',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Alice Inventory'),
        quantity: 5,
      })

      try {
        // Bob lists his items
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/items`)
        expect(response.ok()).toBe(true)

        const body = await response.json()

        // Bob's list should not contain Alice's item
        const foundAliceItem = body.items.find((item: { id: string }) => item.id === aliceItem.id)
        expect(foundAliceItem).toBeUndefined()
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
      }
    }
  )

  multiUserTest(
    'user CAN see items shared to their bubble',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Sharing Test'),
        description: 'Bubble for sharing test',
      })

      // Bob joins Alice's bubble
      await joinTestBubble(bobRequest, bubble.invite_code)

      // Alice creates an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Shared Item'),
        description: 'Item shared to bubble',
        quantity: 2,
      })

      // Alice shares the item to the bubble
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      try {
        // Bob should now be able to see the shared item
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        expect(response.ok()).toBe(true)

        const body = await response.json()
        expect(body.id).toBe(aliceItem.id)
        expect(body.name).toBe(aliceItem.name)
      } finally {
        // Cleanup
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'user cannot see shared item after being removed from bubble',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Remove Member Test'),
      })

      // Bob joins
      await joinTestBubble(bobRequest, bubble.invite_code)

      // Alice creates and shares an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Soon Inaccessible'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      // Verify Bob can see it
      let response = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
      expect(response.ok()).toBe(true)

      // Alice removes Bob from the bubble
      await aliceRequest.delete(
        `${API_BASE_URL}/api/v1/bubbles/${bubble.id}/members/${TEST_USERS.bob.id}`
      )

      try {
        // Bob should no longer be able to see the item
        response = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Items RLS - Update Restrictions', () => {
  multiUserTest(
    'user cannot update another user\'s item',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('No Update'),
        quantity: 1,
      })

      try {
        // Bob tries to update Alice's item
        const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`, {
          data: { name: 'Hacked by Bob' },
        })

        // Should be forbidden or not found
        expect([403, 404]).toContain(response.status())

        // Verify item wasn't actually changed
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        const unchanged = await checkResponse.json()
        expect(unchanged.name).not.toBe('Hacked by Bob')
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
      }
    }
  )

  multiUserTest(
    'user cannot update shared item even if they can view it',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble and Bob joins
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('View Only'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      // Alice creates and shares an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('View Only Item'),
        quantity: 3,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      // Bob can view it
      let response = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
      expect(response.ok()).toBe(true)

      try {
        // But Bob cannot update it
        response = await bobRequest.patch(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`, {
          data: { name: 'Unauthorized Update', quantity: 999 },
        })

        expect([403, 404]).toContain(response.status())

        // Verify unchanged
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        const item = await checkResponse.json()
        expect(item.name).toBe(aliceItem.name)
        expect(item.quantity).toBe(3)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Items RLS - Delete Restrictions', () => {
  multiUserTest(
    'user cannot delete another user\'s item',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Do Not Delete'),
        quantity: 1,
      })

      try {
        // Bob tries to delete Alice's item
        const response = await bobRequest.delete(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)

        // Should be forbidden or not found
        expect([403, 404]).toContain(response.status())

        // Verify item still exists
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        expect(checkResponse.ok()).toBe(true)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
      }
    }
  )

  multiUserTest(
    'user cannot delete shared item even if they can view it',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates a bubble and Bob joins
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('No Delete'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      // Alice creates and shares an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Protected'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      try {
        // Bob cannot delete it
        const response = await bobRequest.delete(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        expect([403, 404]).toContain(response.status())

        // Item still exists
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        expect(checkResponse.ok()).toBe(true)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Items RLS - Share Restrictions', () => {
  multiUserTest(
    'user cannot share another user\'s item',
    async ({ aliceRequest, bobRequest }) => {
      // Both create bubbles
      const aliceBubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Alice Bubble'),
      })
      const bobBubble = await createTestBubble(bobRequest, {
        name: uniqueBubbleName('Bob Bubble'),
      })

      // Alice creates an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('No Steal'),
        quantity: 1,
      })

      try {
        // Bob tries to share Alice's item to his bubble
        const response = await bobRequest.post(
          `${API_BASE_URL}/api/v1/items/${aliceItem.id}/share`,
          {
            data: { bubble_ids: [bobBubble.id] },
          }
        )

        // Should fail
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, aliceBubble.id)
        await deleteTestBubble(bobRequest, bobBubble.id)
      }
    }
  )

  multiUserTest(
    'user cannot share item to bubble they are not a member of',
    async ({ aliceRequest, bobRequest }) => {
      // Bob creates a bubble (Alice is not a member)
      const bobBubble = await createTestBubble(bobRequest, {
        name: uniqueBubbleName('Bob Only'),
      })

      // Alice creates an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Cannot Share'),
        quantity: 1,
      })

      try {
        // Alice tries to share to Bob's bubble (which she's not a member of)
        const response = await aliceRequest.post(
          `${API_BASE_URL}/api/v1/items/${aliceItem.id}/share`,
          {
            data: { bubble_ids: [bobBubble.id] },
          }
        )

        // Should fail - not a member
        expect([400, 403]).toContain(response.status())
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(bobRequest, bobBubble.id)
      }
    }
  )
})

multiUserTest.describe('Items RLS - Third Party Access', () => {
  multiUserTest(
    'third user cannot see item shared only to bubble they are not in',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      // Alice creates a bubble, Bob joins, Carol does NOT join
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Exclusive'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)
      // Carol is NOT joining

      // Alice creates and shares an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Exclusive Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      try {
        // Bob CAN see it (he's in the bubble)
        let response = await bobRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        expect(response.ok()).toBe(true)

        // Carol CANNOT see it (she's not in the bubble)
        response = await carolRequest.get(`${API_BASE_URL}/api/v1/items/${aliceItem.id}`)
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})
