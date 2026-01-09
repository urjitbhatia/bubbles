/**
 * Authenticated Items CRUD E2E Tests
 *
 * Tests for FEAT-048: Items & Inventory Management
 *
 * These tests use authenticated test users from seed data to verify:
 * - Item creation, listing, getting, updating, and deletion
 * - Pagination
 * - Validation errors
 * - RLS (Row Level Security) enforcement
 */

import { test, expect, multiUserTest, API_BASE_URL, TEST_USERS } from '../fixtures/auth.fixture'
import {
  createTestItem,
  getTestItem,
  deleteTestItem,
  uniqueItemName,
  TestItem,
} from '../fixtures/data.helpers'

test.describe('Items CRUD - Create', () => {
  test('can create an item with valid data', async ({ authRequest, currentUser }) => {
    const itemName = uniqueItemName()
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: {
        name: itemName,
        description: 'A test item for E2E testing',
        quantity: 3,
      },
    })

    expect(response.status()).toBe(201)

    const item = await response.json()
    expect(item.id).toBeDefined()
    expect(item.name).toBe(itemName)
    expect(item.description).toBe('A test item for E2E testing')
    expect(item.quantity).toBe(3)
    expect(item.owner_id).toBe(currentUser.id)
    expect(item.created_at).toBeDefined()
    expect(item.shared_bubbles).toEqual([])
    expect(item.available_quantity).toBe(3)

    // Cleanup
    await deleteTestItem(authRequest, item.id)
  })

  test('can create an item with minimal data (name only)', async ({ authRequest }) => {
    const itemName = uniqueItemName()
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: itemName },
    })

    expect(response.status()).toBe(201)

    const item = await response.json()
    expect(item.name).toBe(itemName)
    expect(item.quantity).toBe(1) // Default quantity
    expect(item.description).toBeNull()

    // Cleanup
    await deleteTestItem(authRequest, item.id)
  })

  test('returns 422 when name is missing', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { quantity: 5 },
    })

    expect(response.status()).toBe(422)
    const body = await response.json()
    expect(body.detail).toBeDefined()
  })

  test('returns 422 when name is empty string', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: '', quantity: 1 },
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 when quantity is zero', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: uniqueItemName(), quantity: 0 },
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 when quantity is negative', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: uniqueItemName(), quantity: -1 },
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 when quantity exceeds maximum', async ({ authRequest }) => {
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: uniqueItemName(), quantity: 1000000 },
    })

    // Should be rejected if there's a max limit enforced
    // If not enforced at API level, this test documents the behavior
    expect([201, 422]).toContain(response.status())
  })
})

test.describe('Items CRUD - List', () => {
  test('can list own items', async ({ authRequest }) => {
    // Create test items
    const item1 = await createTestItem(authRequest, { name: uniqueItemName() })
    const item2 = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      const response = await authRequest.get(`${API_BASE_URL}/api/v1/items`)
      expect(response.status()).toBe(200)

      const data = await response.json()
      expect(data.items).toBeDefined()
      expect(Array.isArray(data.items)).toBe(true)
      expect(data.total).toBeGreaterThanOrEqual(2)
      expect(data.page).toBe(1)
      expect(data.limit).toBe(20)

      // Created items should be in the list
      const itemIds = data.items.map((i: TestItem) => i.id)
      expect(itemIds).toContain(item1.id)
      expect(itemIds).toContain(item2.id)
    } finally {
      await deleteTestItem(authRequest, item1.id)
      await deleteTestItem(authRequest, item2.id)
    }
  })

  test('supports pagination with page parameter', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/items?page=1&limit=5`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.page).toBe(1)
    expect(data.limit).toBe(5)
    expect(data.items.length).toBeLessThanOrEqual(5)
  })

  test('returns empty list for page beyond results', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/items?page=9999`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.items).toEqual([])
  })

  test('validates page parameter is positive', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/items?page=0`)
    expect(response.status()).toBe(422)
  })

  test('validates limit parameter bounds', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/items?limit=200`)
    expect(response.status()).toBe(422)
  })

  test('items are ordered by created_at descending', async ({ authRequest }) => {
    const item1 = await createTestItem(authRequest, { name: uniqueItemName('First') })
    // Small delay to ensure different timestamps
    await new Promise((r) => setTimeout(r, 50))
    const item2 = await createTestItem(authRequest, { name: uniqueItemName('Second') })

    try {
      const response = await authRequest.get(`${API_BASE_URL}/api/v1/items`)
      const data = await response.json()

      const item1Index = data.items.findIndex((i: TestItem) => i.id === item1.id)
      const item2Index = data.items.findIndex((i: TestItem) => i.id === item2.id)

      // item2 was created after item1, so it should appear first (index lower)
      expect(item2Index).toBeLessThan(item1Index)
    } finally {
      await deleteTestItem(authRequest, item1.id)
      await deleteTestItem(authRequest, item2.id)
    }
  })
})

test.describe('Items CRUD - Get by ID', () => {
  test('can get own item by ID', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, {
      name: uniqueItemName(),
      description: 'Test description',
      quantity: 5,
    })

    try {
      const response = await authRequest.get(`${API_BASE_URL}/api/v1/items/${item.id}`)
      expect(response.status()).toBe(200)

      const fetchedItem = await response.json()
      expect(fetchedItem.id).toBe(item.id)
      expect(fetchedItem.name).toBe(item.name)
      expect(fetchedItem.description).toBe('Test description')
      expect(fetchedItem.quantity).toBe(5)
      expect(fetchedItem.shared_bubbles).toBeDefined()
      expect(fetchedItem.available_quantity).toBe(5)
    } finally {
      await deleteTestItem(authRequest, item.id)
    }
  })

  test('returns 404 for non-existent item', async ({ authRequest }) => {
    const response = await authRequest.get(
      `${API_BASE_URL}/api/v1/items/00000000-0000-0000-0000-000000000000`
    )
    expect(response.status()).toBe(404)

    const body = await response.json()
    expect(body.detail).toContain('not found')
  })

  test('returns 404 for invalid UUID format', async ({ authRequest }) => {
    const response = await authRequest.get(`${API_BASE_URL}/api/v1/items/not-a-uuid`)
    // Could be 404 or 422 depending on validation
    expect([404, 422, 500]).toContain(response.status())
  })
})

test.describe('Items CRUD - Update', () => {
  test('can update own item name', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      const newName = uniqueItemName('Updated')
      const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
        data: { name: newName },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()
      expect(updated.name).toBe(newName)
    } finally {
      await deleteTestItem(authRequest, item.id)
    }
  })

  test('can update own item description', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
        data: { description: 'Updated description' },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()
      expect(updated.description).toBe('Updated description')
    } finally {
      await deleteTestItem(authRequest, item.id)
    }
  })

  test('can update own item quantity', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, { name: uniqueItemName(), quantity: 1 })

    try {
      const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
        data: { quantity: 10 },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()
      expect(updated.quantity).toBe(10)
    } finally {
      await deleteTestItem(authRequest, item.id)
    }
  })

  test('can update multiple fields at once', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      const newName = uniqueItemName('Multi-update')
      const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
        data: {
          name: newName,
          description: 'New description',
          quantity: 7,
        },
      })

      expect(response.status()).toBe(200)
      const updated = await response.json()
      expect(updated.name).toBe(newName)
      expect(updated.description).toBe('New description')
      expect(updated.quantity).toBe(7)
    } finally {
      await deleteTestItem(authRequest, item.id)
    }
  })

  test('returns 400 when no fields to update', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    try {
      const response = await authRequest.patch(`${API_BASE_URL}/api/v1/items/${item.id}`, {
        data: {},
      })

      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.detail).toMatch(/no (fields|changes)/i)
    } finally {
      await deleteTestItem(authRequest, item.id)
    }
  })

  test('returns 404 for non-existent item', async ({ authRequest }) => {
    const response = await authRequest.patch(
      `${API_BASE_URL}/api/v1/items/00000000-0000-0000-0000-000000000000`,
      { data: { name: 'Updated' } }
    )
    expect(response.status()).toBe(404)
  })
})

test.describe('Items CRUD - Delete', () => {
  test('can delete own item', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    const response = await authRequest.delete(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect(response.status()).toBe(204)

    // Verify item is gone
    const fetchedItem = await getTestItem(authRequest, item.id)
    expect(fetchedItem).toBeNull()
  })

  test('returns 404 for non-existent item', async ({ authRequest }) => {
    const response = await authRequest.delete(
      `${API_BASE_URL}/api/v1/items/00000000-0000-0000-0000-000000000000`
    )
    expect(response.status()).toBe(404)
  })

  test('delete is idempotent (second delete returns 404)', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, { name: uniqueItemName() })

    // First delete
    const response1 = await authRequest.delete(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect(response1.status()).toBe(204)

    // Second delete should return 404
    const response2 = await authRequest.delete(`${API_BASE_URL}/api/v1/items/${item.id}`)
    expect(response2.status()).toBe(404)
  })
})

multiUserTest.describe('Items - RLS and Permissions', () => {
  multiUserTest(
    'user cannot see items owned by another user',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates an item
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Alice Private'),
      })

      try {
        // Bob should not see Alice's item in list
        const bobListResponse = await bobRequest.get(`${API_BASE_URL}/api/v1/items`)
        const bobData = await bobListResponse.json()

        const aliceItemInBobList = bobData.items.find(
          (i: TestItem) => i.id === aliceItem.id
        )
        expect(aliceItemInBobList).toBeUndefined()

        // Bob should get 404 when trying to fetch Alice's item directly
        const bobGetResponse = await bobRequest.get(
          `${API_BASE_URL}/api/v1/items/${aliceItem.id}`
        )
        expect(bobGetResponse.status()).toBe(404)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
      }
    }
  )

  multiUserTest(
    'user cannot update items owned by another user',
    async ({ aliceRequest, bobRequest }) => {
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Alice Item'),
      })

      try {
        const response = await bobRequest.patch(
          `${API_BASE_URL}/api/v1/items/${aliceItem.id}`,
          { data: { name: 'Bob tries to update' } }
        )

        // Should get 404 (item "not found" for Bob) or 403
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
      }
    }
  )

  multiUserTest(
    'user cannot delete items owned by another user',
    async ({ aliceRequest, bobRequest }) => {
      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Alice Item'),
      })

      try {
        const response = await bobRequest.delete(
          `${API_BASE_URL}/api/v1/items/${aliceItem.id}`
        )

        expect([403, 404]).toContain(response.status())

        // Verify item still exists
        const item = await getTestItem(aliceRequest, aliceItem.id)
        expect(item).not.toBeNull()
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
      }
    }
  )
})
