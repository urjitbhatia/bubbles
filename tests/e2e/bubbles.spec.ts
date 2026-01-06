import { test, expect } from '@playwright/test'

/**
 * Bubbles E2E Tests
 *
 * Tests for FEAT-047: Bubbles - Create, Join, Manage
 *
 * Note: These tests require authentication. They test the UI components
 * and user flows for bubble management.
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:6174'
const API_BASE_URL = 'http://localhost:9990'

test.describe('Bubbles API Endpoints', () => {
  test('GET /api/v1/bubbles requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/bubbles`)

    // Should return 401 or 403 for unauthenticated request
    expect([401, 403]).toContain(response.status())
  })

  test('POST /api/v1/bubbles requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/bubbles`, {
      data: { name: 'Test Bubble' }
    })

    expect([401, 403]).toContain(response.status())
  })

  test('POST /api/v1/bubbles/join/{code} requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/bubbles/join/abc123`)

    expect([401, 403]).toContain(response.status())
  })

  test('GET /api/v1/bubbles/{id} requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/bubbles/test-id`)

    expect([401, 403]).toContain(response.status())
  })

  test('DELETE /api/v1/bubbles/{id} requires authentication', async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/api/v1/bubbles/test-id`)

    expect([401, 403]).toContain(response.status())
  })

  test('PATCH /api/v1/bubbles/{id} requires authentication', async ({ request }) => {
    const response = await request.patch(`${API_BASE_URL}/api/v1/bubbles/test-id`, {
      data: { name: 'Updated' }
    })

    expect([401, 403]).toContain(response.status())
  })

  test('DELETE /api/v1/bubbles/{id}/members/{member_id} requires auth', async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/api/v1/bubbles/test-id/members/user-id`)

    expect([401, 403]).toContain(response.status())
  })

  test('PATCH /api/v1/bubbles/{id}/members/{member_id} requires auth', async ({ request }) => {
    const response = await request.patch(`${API_BASE_URL}/api/v1/bubbles/test-id/members/user-id`, {
      data: { role: 'admin' }
    })

    expect([401, 403]).toContain(response.status())
  })
})

test.describe('Bubbles UI (Unauthenticated)', () => {
  test('bubbles list page redirects to login', async ({ page }) => {
    // Don't wait for full load - the redirect happens before API calls
    await page.goto(`${FRONTEND_URL}/bubbles`, { waitUntil: 'commit' })

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 })
  })

  test('bubble detail page redirects to login', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/bubbles/test-bubble-id`, {
      waitUntil: 'commit',
    })

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 })
  })
})

test.describe('Join Bubble Flow', () => {
  test('join page displays invite information', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/join/abc123def456`)

    // Check for invite message
    await expect(page.getByText(/invited to join a Bubble/i)).toBeVisible()

    // Check for action button
    await expect(page.getByRole('link', { name: /Sign In to Join/i })).toBeVisible()
  })

  test('join page link includes redirect parameter', async ({ page }) => {
    const inviteCode = 'testcode789'
    await page.goto(`${FRONTEND_URL}/join/${inviteCode}`)

    const signInLink = page.getByRole('link', { name: /Sign In to Join/i })

    // Should have redirect to this join page (URL encoded)
    await expect(signInLink).toHaveAttribute('href', /redirect=/)
  })
})
