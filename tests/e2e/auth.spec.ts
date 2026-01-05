import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests
 *
 * Tests for the authentication flow including login page,
 * magic link form, and protected route redirects.
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:6174'

test.describe('Login Page', () => {
  test('displays login page with all elements', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`)

    // Check page title
    await expect(page).toHaveTitle(/Bubbles/)

    // Check main heading
    await expect(page.getByRole('heading', { name: /Welcome to Bubbles/i })).toBeVisible()

    // Check tagline
    await expect(page.getByText(/Share what you own/i)).toBeVisible()

    // Check Google OAuth button
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible()

    // Check magic link form
    await expect(page.getByRole('textbox', { name: /Email/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Send magic link/i })).toBeVisible()

    // Check terms and privacy links
    await expect(page.getByRole('link', { name: /Terms of Service/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Privacy Policy/i })).toBeVisible()
  })

  test('magic link button is disabled without email', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`)

    const sendButton = page.getByRole('button', { name: /Send magic link/i })
    await expect(sendButton).toBeDisabled()
  })

  test('magic link button enables with valid email', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`)

    // Fill in email
    await page.getByRole('textbox', { name: /Email/i }).fill('test@example.com')

    // Button should be enabled
    const sendButton = page.getByRole('button', { name: /Send magic link/i })
    await expect(sendButton).toBeEnabled()
  })
})

test.describe('Protected Routes', () => {
  test('unauthenticated user is redirected to login from /inventory', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/inventory`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user is redirected to login from /bubbles', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/bubbles`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user is redirected to login from /profile', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/profile`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user is redirected to login from /dashboard', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/dashboard`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Join Bubble Page (Public)', () => {
  test('join page is accessible without authentication', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/join/testcode123`)

    // Should show join page, not redirect to login
    await expect(page.getByText(/invited to join a Bubble/i)).toBeVisible()

    // Should show sign in button since not authenticated
    await expect(page.getByRole('link', { name: /Sign In to Join/i })).toBeVisible()
  })

  test('join page shows sign in link with redirect', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/join/testcode123`)

    // Check for sign in link
    const signInLink = page.getByRole('link', { name: /Sign In to Join/i })
    await expect(signInLink).toBeVisible()

    // Link should include redirect parameter
    await expect(signInLink).toHaveAttribute('href', /redirect/)
  })
})

test.describe('Auth Callback Page', () => {
  test('auth callback redirects to login when no session', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/auth/callback`)

    // Should eventually redirect to login (no valid session)
    await page.waitForURL(/\/login/, { timeout: 5000 })
  })
})
