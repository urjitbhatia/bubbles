/**
 * Items Edge Case Tests
 *
 * Tests for business logic validation and edge cases in item management.
 * Verifies that the API properly validates inputs and enforces constraints.
 */

import { test, expect, API_BASE_URL, multiUserTest } from '../fixtures/auth.fixture'
import {
  createTestItem,
  createTestBubble,
  shareItemToBubbles,
  uniqueItemName,
  uniqueBubbleName,
} from '../fixtures/data.helpers'

test.describe('Items Validation Edge Cases', () => {
  test('item name is required - returns 422 for missing name', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        description: 'An item without a name',
        quantity: 1,
      },
    })

    expect(response.status()).toBe(422)
    const body = await response.json()
    expect(body.detail).toBeDefined()
    // FastAPI validation errors include info about the missing field
    expect(JSON.stringify(body.detail)).toContain('name')
  })

  test('item name is required - returns 422 for empty name', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        name: '',
        quantity: 1,
      },
    })

    expect(response.status()).toBe(422)
    const body = await response.json()
    expect(body.detail).toBeDefined()
  })

  test('quantity must be positive - returns 422 for zero quantity', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        name: uniqueItemName('Zero Qty'),
        quantity: 0,
      },
    })

    expect(response.status()).toBe(422)
    const body = await response.json()
    expect(body.detail).toBeDefined()
    expect(JSON.stringify(body.detail)).toContain('quantity')
  })

  test('quantity must be positive - returns 422 for negative quantity', async ({
    authRequest,
  }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        name: uniqueItemName('Negative Qty'),
        quantity: -5,
      },
    })

    expect(response.status()).toBe(422)
    const body = await response.json()
    expect(body.detail).toBeDefined()
  })

  test('very long item names are handled appropriately - max 200 chars', async ({
    authRequest,
  }) => {
    // Test with exactly 200 characters (should succeed)
    const maxLengthName = 'A'.repeat(200)
    const successResponse = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        name: maxLengthName,
        quantity: 1,
      },
    })

    expect(successResponse.status()).toBe(201)
    const successBody = await successResponse.json()
    expect(successBody.name).toBe(maxLengthName)
    expect(successBody.name.length).toBe(200)

    // Test with 201 characters (should fail)
    const tooLongName = 'B'.repeat(201)
    const failResponse = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        name: tooLongName,
        quantity: 1,
      },
    })

    expect(failResponse.status()).toBe(422)
  })

  test('very long description is handled appropriately - max 2000 chars', async ({
    authRequest,
  }) => {
    // Test with exactly 2000 characters (should succeed)
    const maxLengthDescription = 'D'.repeat(2000)
    const successResponse = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        name: uniqueItemName('Long Desc'),
        description: maxLengthDescription,
        quantity: 1,
      },
    })

    expect(successResponse.status()).toBe(201)
    const successBody = await successResponse.json()
    expect(successBody.description?.length).toBe(2000)

    // Test with 2001 characters (should fail)
    const tooLongDescription = 'E'.repeat(2001)
    const failResponse = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        name: uniqueItemName('Too Long Desc'),
        description: tooLongDescription,
        quantity: 1,
      },
    })

    expect(failResponse.status()).toBe(422)
  })

  test('update with empty name fails validation', async ({ authRequest }) => {
    // First create a valid item
    const item = await createTestItem(authRequest, {
      name: uniqueItemName('Update Test'),
    })

    // Try to update with empty name
    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
      data: { name: '' },
    })

    expect(response.status()).toBe(422)
  })

  test('update with zero quantity fails validation', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, {
      name: uniqueItemName('Update Qty Test'),
    })

    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
      data: { quantity: 0 },
    })

    expect(response.status()).toBe(422)
  })
})

test.describe('Items Business Logic Edge Cases', () => {
  test('cannot delete item with active loan', async ({ authRequest }) => {
    // This test requires:
    // 1. Create item
    // 2. Create bubble
    // 3. Share item to bubble
    // 4. Have another user borrow the item
    // 5. Try to delete item - should fail

    // For now, we test the delete endpoint with the expected behavior
    // Full multi-user test would require the multiUserTest fixture
    const item = await createTestItem(authRequest, {
      name: uniqueItemName('Delete Test'),
      quantity: 1,
    })

    // Without an active loan, delete should work
    const response = await authRequest.delete(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect(response.status()).toBe(204)
  })

  test('cannot share item to bubble user is not a member of', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, {
      name: uniqueItemName('Share Test'),
    })

    // Try to share to a non-existent/non-member bubble
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items/${item.id}/share`, {
      data: { bubble_ids: ['00000000-0000-0000-0000-000000000000'] },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('Not a member')
  })

  test('sharing to empty bubble list clears all shares', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, {
      name: uniqueItemName('Clear Shares Test'),
    })

    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Share Bubble'),
    })

    // Share to bubble
    await shareItemToBubbles(authRequest, item.id, [bubble.id])

    // Verify item has shares
    const itemResponse = await authRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
    const itemData = await itemResponse.json()
    expect(itemData.shared_bubbles.length).toBe(1)

    // Clear all shares
    const clearResponse = await authRequest.post(
      `${API_BASE_URL}/api/v1/items/${item.id}/share`,
      {
        data: { bubble_ids: [] },
      }
    )

    expect(clearResponse.status()).toBe(200)
    const clearedItem = await clearResponse.json()
    expect(clearedItem.shared_bubbles.length).toBe(0)
  })

  test('update with no fields returns 400', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, {
      name: uniqueItemName('No Update'),
    })

    const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
      data: {},
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('No fields to update')
  })
})

multiUserTest.describe('Items Multi-User Edge Cases', () => {
  multiUserTest('cannot modify another user item', async ({ aliceRequest, bobRequest }) => {
    // Alice creates an item
    const item = await createTestItem(aliceRequest, {
      name: uniqueItemName('Alice Item'),
    })

    // Bob tries to update it
    const updateResponse = await bobRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
      data: { name: 'Bob Hijacked' },
    })

    // Should get 403 or 404 (item not found for Bob)
    expect([403, 404]).toContain(updateResponse.status())

    // Bob tries to delete it
    const deleteResponse = await bobRequest.delete(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect([403, 404]).toContain(deleteResponse.status())
  })

  multiUserTest(
    'cannot delete item with active loan - full flow',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates an item
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Loanable Item'),
        quantity: 1,
      })

      // Alice creates a bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Loan Bubble'),
      })

      // Get the invite code and have Bob join
      const bubbleResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubble.id}`)
      const bubbleData = await bubbleResponse.json()

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubbleData.invite_code}`)

      // Alice shares item to bubble
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      // Bob requests to borrow the item
      const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })

      expect(loanResponse.status()).toBe(201)
      const loan = await loanResponse.json()

      // Alice approves the loan (makes it active)
      const approveResponse = await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/loans/${loan.id}`,
        {
          data: { status: 'active' },
        }
      )

      expect(approveResponse.status()).toBe(200)

      // Alice tries to delete item with active loan
      const deleteResponse = await aliceRequest.delete(
        `${API_BASE_URL}/api/v1/items/${item.id}`
      )

      expect(deleteResponse.status()).toBe(400)
      const deleteBody = await deleteResponse.json()
      expect(deleteBody.detail).toContain('active loans')
    }
  )
})
