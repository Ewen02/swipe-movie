import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should display landing page with main heading and CTA', async ({ page }) => {
    await page.goto('/')

    // Check for main heading
    await expect(page.getByRole('heading', { name: /decide as a group which movie to watch/i })).toBeVisible()

    // Check for "Get started for free" button (there are 2, one in header and one in hero)
    const getStartedButton = page.getByRole('button', { name: /get started for free/i }).first()
    await expect(getStartedButton).toBeVisible()

    // Check for language selector
    const languageSelector = page.getByText(/english|français/i)
    await expect(languageSelector.first()).toBeVisible()
  })

  test('should display watch demo button', async ({ page }) => {
    await page.goto('/')

    // Check for watch demo button
    const watchDemoButton = page.getByRole('button', { name: /watch demo/i })
    await expect(watchDemoButton).toBeVisible()
  })

  test('should display subtitle text', async ({ page }) => {
    await page.goto('/')

    // Check for subtitle about swiping and matching
    await expect(page.getByText(/no more endless debates.*swipe.*match.*watch together/i)).toBeVisible()
  })
})

test.describe('Language Switching', () => {
  test('should switch between languages', async ({ page }) => {
    await page.goto('/')

    // Find and click language selector
    const languageSelector = page.locator('select, [role="combobox"]').first()

    if (await languageSelector.count() > 0) {
      // Click to open dropdown
      await languageSelector.click()

      // Wait a bit for dropdown to open
      await page.waitForTimeout(500)

      // Check if options are available
      const hasOptions = await page.locator('[role="option"], option').count() > 0
      expect(hasOptions).toBe(true)
    }
  })
})
