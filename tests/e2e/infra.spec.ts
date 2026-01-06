import { test, expect } from '@playwright/test'

/**
 * Infrastructure E2E Tests
 *
 * These tests verify the foundational infrastructure is working correctly.
 * Run with: npx playwright test tests/e2e/infra.spec.ts
 *
 * Prerequisites:
 * - Backend running on http://localhost:9990
 * - Frontend running on http://localhost:6174 (for full stack tests)
 */

const API_BASE_URL = 'http://localhost:9990'

test.describe('Health Check Endpoints', () => {
  test('GET /api/health returns 200 and healthy status', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`)

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.status).toBe('healthy')
    expect(body.service).toBe('bubbles-api')
    expect(body.timestamp).toBeDefined()
  })

  test('GET /api/health/db returns database connectivity status', async ({ request }) => {
    // Note: This test may return 503 if Supabase is not configured
    // In a real CI environment, you'd have Supabase running
    const response = await request.get(`${API_BASE_URL}/api/health/db`)

    // Accept either 200 (connected) or 503 (not configured)
    // The important thing is the endpoint exists and responds
    expect([200, 503]).toContain(response.status())

    const body = await response.json()
    if (response.status() === 200) {
      expect(body.status).toBe('healthy')
      expect(body.database).toBe('connected')
    } else {
      // 503 response has detail object
      expect(body.detail.status).toBe('unhealthy')
    }
  })
})

test.describe('API Documentation', () => {
  test('GET /docs returns OpenAPI documentation page', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/docs`)

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const contentType = response.headers()['content-type']
    expect(contentType).toContain('text/html')
  })

  test('GET /openapi.json returns OpenAPI schema', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/openapi.json`)

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.openapi).toBeDefined()
    expect(body.info.title).toBe('Bubbles API')
    expect(body.info.version).toBe('0.1.0')
  })
})

test.describe('CORS Configuration', () => {
  test('OPTIONS request from localhost:6174 is allowed', async ({ request }) => {
    const response = await request.fetch(`${API_BASE_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:6174',
        'Access-Control-Request-Method': 'GET',
      },
    })

    // CORS preflight should return 200
    expect(response.ok()).toBeTruthy()

    const headers = response.headers()
    expect(headers['access-control-allow-origin']).toBe('http://localhost:6174')
    expect(headers['access-control-allow-credentials']).toBe('true')
  })
})
