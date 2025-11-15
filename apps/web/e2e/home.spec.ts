import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/Swipe Movie/i)

    // Check main heading
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should display navigation header', async ({ page }) => {
    await page.goto('/')

    // Check for logo or site name
    const logo = page.locator('header').first()
    await expect(logo).toBeVisible()
  })

  test('should have call-to-action button', async ({ page }) => {
    await page.goto('/')

    // Check for main CTA (login/get started)
    const cta = page.getByRole('link', { name: /connexion|se connecter|commencer/i })
    await expect(cta).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Page should load without horizontal scroll
    const body = await page.locator('body').boundingBox()
    expect(body?.width).toBeLessThanOrEqual(375)
  })

  test('should have footer', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer').first()
    await expect(footer).toBeVisible()
  })
})
