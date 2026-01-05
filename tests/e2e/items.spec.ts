import { test, expect } from '@playwright/test'

/**
 * Items & Inventory E2E Tests
 *
 * Tests for FEAT-048: Items & Inventory Management
 *
 * Note: These tests require authentication for most flows.
 * They test API endpoints and UI components for item management.
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:6174'
const API_BASE_URL = 'http://localhost:9990'

test.describe('Items API Endpoints', () => {
  test('GET /api/v1/items requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/items`)

    expect([401, 403]).toContain(response.status())
  })

  test('POST /api/v1/items requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Test Item', quantity: 1 }
    })

    expect([401, 403]).toContain(response.status())
  })

  test('GET /api/v1/items/{id} requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/items/test-id`)

    expect([401, 403]).toContain(response.status())
  })

  test('PATCH /api/v1/items/{id} requires authentication', async ({ request }) => {
    const response = await request.patch(`${API_BASE_URL}/api/v1/items/test-id`, {
      data: { name: 'Updated Item' }
    })

    expect([401, 403]).toContain(response.status())
  })

  test('DELETE /api/v1/items/{id} requires authentication', async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/api/v1/items/test-id`)

    expect([401, 403]).toContain(response.status())
  })

  test('POST /api/v1/items/{id}/share requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/items/test-id/share`, {
      data: { bubble_ids: ['bubble-123'] }
    })

    expect([401, 403]).toContain(response.status())
  })
})

test.describe('Items API Validation', () => {
  // These tests verify request validation works even for unauthenticated requests
  // The API should validate the request body before checking auth (or return auth error)

  test('POST /api/v1/items rejects empty body', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/items`, {
      data: {}
    })

    // Should return 401 (no auth) or 422 (validation error)
    expect([401, 403, 422]).toContain(response.status())
  })

  test('POST /api/v1/items validates quantity is positive', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/items`, {
      data: { name: 'Test', quantity: -1 },
      headers: { 'Content-Type': 'application/json' }
    })

    // Should return 401 or 422
    expect([401, 403, 422]).toContain(response.status())
  })
})

test.describe('Inventory UI (Unauthenticated)', () => {
  test('inventory page redirects to login', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/inventory`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('item detail page redirects to login', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/items/test-item-id`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Items API Response Format', () => {
  // Test that the API returns proper error responses

  test('unauthenticated request returns proper error format', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/items`)

    expect([401, 403]).toContain(response.status())

    const body = await response.json()
    // Should have detail field for error message
    expect(body).toHaveProperty('detail')
  })
})
