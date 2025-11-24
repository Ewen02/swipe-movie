import { test as base, expect, Page } from '@playwright/test'
import path from 'path'

// Mock user data for testing
export const mockUser = {
  email: 'test@example.com',
  name: 'Test User',
  id: 'test-user-id',
}

// Mock session token for NextAuth
export const mockSession = {
  user: mockUser,
  accessToken: 'mock-access-token',
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
}

// Storage state path for authenticated sessions
export const authFile = path.join(__dirname, '../.auth/user.json')

// Extended test with authentication helpers
export const test = base.extend<{
  authenticatedPage: Page
}>({
  authenticatedPage: async ({ page, context }, use) => {
    // Mock NextAuth session cookie
    await context.addCookies([
      {
        name: 'next-auth.session-token',
        value: 'mock-session-token',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      },
    ])

    // Mock API responses for authentication
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSession),
      })
    })

    // Mock backend authentication endpoints
    await page.route('**/auth/oauth-upsert', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    await page.route('**/auth/login-oauth', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'mock-access-token' }),
      })
    })

    await use(page)
  },
})

export { expect }
