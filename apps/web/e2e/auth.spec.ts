import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login')
  })

  test('should display login page with Google OAuth button', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Swipe Movie/i)

    // Check for Google OAuth button
    const googleButton = page.getByRole('button', { name: /sign in with google/i })
    await expect(googleButton).toBeVisible()
  })

  test('should redirect to rooms page when already authenticated', async ({ page, context }) => {
    // Mock authentication by setting a session cookie
    // Note: This is a simplified mock - in real tests, you'd use proper OAuth flow mocking
    await context.addCookies([
      {
        name: 'next-auth.session-token',
        value: 'mock-session-token',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ])

    await page.goto('/login')

    // Should redirect to rooms page
    await expect(page).toHaveURL(/\/rooms/)
  })

  test('should show error message on failed authentication', async ({ page }) => {
    // Navigate with error query parameter
    await page.goto('/login?error=OAuthAccountNotLinked')

    // Check for error message display
    const errorMessage = page.getByText(/authentication failed/i)
    await expect(errorMessage).toBeVisible()
  })

  test('should have language selector visible', async ({ page }) => {
    // Check for language selector
    const languageSelector = page.locator('[aria-label*="language" i], [title*="language" i]')
    await expect(languageSelector).toBeVisible()
  })

  test('should have theme toggle visible', async ({ page }) => {
    // Check for theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme/i })
    await expect(themeToggle).toBeVisible()
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected routes without auth', async ({ page }) => {
    // Try to access rooms page without authentication
    await page.goto('/rooms')

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect to login when accessing room detail without auth', async ({ page }) => {
    // Try to access a specific room without authentication
    await page.goto('/rooms/ABC123')

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/)
  })
})
