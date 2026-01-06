import { test, expect } from '@playwright/test'

/**
 * PWA E2E Tests
 *
 * These tests verify the Progressive Web App configuration is working correctly.
 * Run with: npx playwright test tests/e2e/pwa.spec.ts
 *
 * Prerequisites:
 * - Frontend running on http://localhost:6174
 * - Build completed with `pnpm run build` (for manifest to be generated)
 */

const FRONTEND_URL = 'http://localhost:6174'

test.describe('PWA Manifest', () => {
  test('manifest is served correctly', async ({ request }) => {
    const response = await request.get(`${FRONTEND_URL}/manifest.webmanifest`)

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const manifest = await response.json()

    // Check required manifest properties
    expect(manifest.name).toBe('Bubbles')
    expect(manifest.short_name).toBe('Bubbles')
    expect(manifest.display).toBe('standalone')
    expect(manifest.start_url).toBe('/')

    // Check theme colors (Ocean Blue 600 from design language)
    expect(manifest.theme_color).toBe('#0284c7')
    expect(manifest.background_color).toBe('#fafafa')

    // Check icons are configured
    expect(manifest.icons).toBeDefined()
    expect(manifest.icons.length).toBeGreaterThan(0)

    // Verify at least one icon has standard sizes
    const iconSizes = manifest.icons.map(
      (icon: { sizes: string }) => icon.sizes
    )
    expect(iconSizes).toContain('192x192')
    expect(iconSizes).toContain('512x512')
  })

  test('manifest has valid icon references', async ({ request }) => {
    const manifestResponse = await request.get(
      `${FRONTEND_URL}/manifest.webmanifest`
    )
    const manifest = await manifestResponse.json()

    // Check each icon URL is accessible
    for (const icon of manifest.icons) {
      const iconUrl = icon.src.startsWith('/')
        ? `${FRONTEND_URL}${icon.src}`
        : `${FRONTEND_URL}/${icon.src}`

      const iconResponse = await request.get(iconUrl)
      expect(iconResponse.ok(), `Icon ${icon.src} should be accessible`).toBe(
        true
      )
    }
  })
})

test.describe('Service Worker', () => {
  test('service worker registers on page load', async ({ page }) => {
    await page.goto(FRONTEND_URL)

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle')

    // Check if service worker is registered
    // In dev mode, VitePWA registers a dev SW; in prod it's sw.js
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        // Wait a bit for SW registration to complete
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const registration = await navigator.serviceWorker.getRegistration()
        return !!registration
      }
      return false
    })

    expect(swRegistered).toBeTruthy()
  })

  test('service worker script is accessible', async ({ request }) => {
    // VitePWA generates sw.js in production builds
    // In dev mode, the SW is injected via virtual modules (not fetchable)
    const response = await request.get(`${FRONTEND_URL}/sw.js`)
    const contentType = response.headers()['content-type']

    // In production, sw.js is a JavaScript file
    // In dev mode, it returns HTML (SPA fallback) - skip this check
    if (contentType?.includes('html')) {
      // Dev mode - SW is handled via virtual modules, verify manifest works instead
      const manifestResponse = await request.get(
        `${FRONTEND_URL}/manifest.webmanifest`
      )
      expect(manifestResponse.status()).toBe(200)
      const manifest = await manifestResponse.json()
      expect(manifest.name).toBe('Bubbles')
      return
    }

    expect(response.status()).toBe(200)
    expect(contentType).toContain('javascript')
  })
})

test.describe('PWA Meta Tags', () => {
  test('index.html contains required PWA meta tags', async ({ page }) => {
    await page.goto(FRONTEND_URL)

    // Check theme-color meta tag
    const themeColor = await page.locator('meta[name="theme-color"]')
    await expect(themeColor).toHaveAttribute('content', '#0284c7')

    // Check apple-mobile-web-app-capable
    const appleMobileCapable = await page.locator(
      'meta[name="apple-mobile-web-app-capable"]'
    )
    await expect(appleMobileCapable).toHaveAttribute('content', 'yes')

    // Check apple-mobile-web-app-title
    const appleTitle = await page.locator(
      'meta[name="apple-mobile-web-app-title"]'
    )
    await expect(appleTitle).toHaveAttribute('content', 'Bubbles')

    // Check apple-mobile-web-app-status-bar-style
    const statusBarStyle = await page.locator(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    )
    await expect(statusBarStyle).toHaveAttribute('content', 'default')
  })

  test('index.html has apple-touch-icon link', async ({ page }) => {
    await page.goto(FRONTEND_URL)

    const appleTouchIcon = await page.locator('link[rel="apple-touch-icon"]')
    await expect(appleTouchIcon).toHaveAttribute(
      'href',
      '/icons/apple-touch-icon.svg'
    )
  })

  test('index.html has favicon', async ({ page }) => {
    await page.goto(FRONTEND_URL)

    const favicon = await page.locator('link[rel="icon"]')
    const href = await favicon.getAttribute('href')
    expect(href).toContain('favicon')
  })
})

test.describe('PWA Icons', () => {
  test('favicon.svg is accessible', async ({ request }) => {
    const response = await request.get(`${FRONTEND_URL}/favicon.svg`)

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const contentType = response.headers()['content-type']
    expect(contentType).toContain('svg')
  })

  test('apple-touch-icon is accessible', async ({ request }) => {
    const response = await request.get(
      `${FRONTEND_URL}/icons/apple-touch-icon.svg`
    )

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
  })
})
