import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display sign in button on landing page', async ({ page }) => {
    await page.goto('/')

    // Check for sign in button
    const signInButton = page.getByRole('link', { name: /connexion|se connecter|sign in|login/i })
    await expect(signInButton).toBeVisible()
  })

  test('should redirect to NextAuth when clicking sign in', async ({ page }) => {
    await page.goto('/')

    // Find and click sign in button
    const signInButton = page.getByRole('link', { name: /connexion|se connecter|sign in|login/i })
    await signInButton.click()

    // Should redirect to NextAuth page
    await expect(page).toHaveURL(/\/api\/auth\/signin/)
  })

  test('should show Google OAuth provider', async ({ page }) => {
    await page.goto('/api/auth/signin')

    // Wait for the signin page to load
    await page.waitForLoadState('networkidle')

    // Check for Google sign in option
    const googleButton = page.locator('button, form').filter({ hasText: /google/i })
    await expect(googleButton).toBeVisible()
  })

  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/rooms')

    // Should be redirected to signin or home
    await expect(page).toHaveURL(/\/(api\/auth\/signin|$)/)
  })

  test('should mock authenticated session and access rooms page', async ({ page, context }) => {
    // Mock authenticated session
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

    // Mock session API
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            email: 'test@example.com',
            name: 'Test User',
            id: 'test-user-id',
          },
          accessToken: 'mock-access-token',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      })
    })

    // Mock backend endpoints
    await page.route('**/rooms/mine', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rooms: [] }),
      })
    })

    await page.route('**/movies/genres', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 28, name: 'Action' },
          { id: 35, name: 'Comedy' },
        ]),
      })
    })

    // Should be able to access rooms page
    await page.goto('/rooms')

    // Verify we're on the rooms page
    await expect(page).toHaveURL(/\/rooms/)

    // Should see rooms page content
    await expect(page.getByText(/rooms|salles/i)).toBeVisible()
  })

  test('should handle authentication errors gracefully', async ({ page }) => {
    await page.goto('/api/auth/signin')

    // Mock an error response from the auth endpoint
    await page.route('**/api/auth/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Authentication failed' }),
      })
    })

    // The page should still load without crashing
    await expect(page.locator('body')).toBeVisible()
  })
})
