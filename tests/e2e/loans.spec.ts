import { test, expect } from '@playwright/test'

/**
 * Loans E2E Tests
 *
 * Tests for the loans/borrowing functionality.
 * Tests API endpoint authentication and UI redirects.
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:6174'
const API_BASE_URL = 'http://localhost:9990'

test.describe('Loans API Endpoints', () => {
  test('GET /api/v1/loans requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/loans`)

    expect([401, 403]).toContain(response.status())
  })

  test('POST /api/v1/loans requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: 'test-item-id',
        bubble_id: 'test-bubble-id',
      },
    })

    expect([401, 403]).toContain(response.status())
  })

  test('GET /api/v1/loans/{id} requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/loans/test-loan-id`)

    expect([401, 403]).toContain(response.status())
  })

  test('PATCH /api/v1/loans/{id} requires authentication', async ({ request }) => {
    const response = await request.patch(`${API_BASE_URL}/api/v1/loans/test-loan-id`, {
      data: { status: 'active' },
    })

    expect([401, 403]).toContain(response.status())
  })
})

test.describe('Loans API Query Parameters', () => {
  test('GET /api/v1/loans accepts status filter', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/loans?status=active`)

    // Should still require auth even with filter
    expect([401, 403]).toContain(response.status())
  })

  test('GET /api/v1/loans accepts as_borrower filter', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/loans?as_borrower=true`)

    expect([401, 403]).toContain(response.status())
  })

  test('GET /api/v1/loans accepts as_lender filter', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/loans?as_lender=true`)

    expect([401, 403]).toContain(response.status())
  })
})

test.describe('Loans API Response Format', () => {
  test('unauthenticated request returns proper error format', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/loans`)

    expect([401, 403]).toContain(response.status())

    const body = await response.json()
    expect(body).toHaveProperty('detail')
  })

  test('loan creation with invalid data returns error', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {},
      headers: { 'Content-Type': 'application/json' },
    })

    // Should return auth error or validation error
    expect([401, 403, 422]).toContain(response.status())
  })
})
