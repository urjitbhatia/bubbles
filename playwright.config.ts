import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Bubbles E2E tests
 *
 * Run tests with:
 *   npx playwright test
 *
 * Run specific test file:
 *   npx playwright test tests/e2e/infra.spec.ts
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    // Base URL for API tests
    baseURL: 'http://localhost:9990',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Optionally run dev servers before tests
  // webServer: [
  //   {
  //     command: 'cd api && make dev',
  //     url: 'http://localhost:9990/api/health',
  //     reuseExistingServer: !process.env.CI,
  //   },
  //   {
  //     command: 'cd web && pnpm run dev',
  //     url: 'http://localhost:6174',
  //     reuseExistingServer: !process.env.CI,
  //   },
  // ],
})
