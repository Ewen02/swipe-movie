import { test, expect } from '@playwright/test'

test.describe('Rooms Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Note: This assumes user is authenticated
    // In a real scenario, you'd set up authentication state
    await page.goto('/rooms')
  })

  test('should display rooms page', async ({ page }) => {
    // Check page heading
    const heading = page.getByRole('heading', { name: /mes rooms/i })
    await expect(heading).toBeVisible()
  })

  test('should show create room button', async ({ page }) => {
    // Look for create room action
    const createButton = page.getByText(/créer une room/i)
    await expect(createButton).toBeVisible()
  })

  test('should show join room button', async ({ page }) => {
    // Look for join room action
    const joinButton = page.getByText(/rejoindre une room/i)
    await expect(joinButton).toBeVisible()
  })

  test('should open create room dialog', async ({ page }) => {
    // Click create room
    const createButton = page.getByText(/créer une room/i).first()
    await createButton.click()

    // Dialog should open
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Check for form fields
    const nameInput = page.getByPlaceholder(/nom de la room/i)
    await expect(nameInput).toBeVisible()
  })

  test('should open join room dialog', async ({ page }) => {
    // Click join room
    const joinButton = page.getByText(/rejoindre une room/i).first()
    await joinButton.click()

    // Dialog should open
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Check for code input
    const codeInput = page.getByPlaceholder(/code/i)
    await expect(codeInput).toBeVisible()
  })

  test('should validate room name input', async ({ page }) => {
    // Open create dialog
    const createButton = page.getByText(/créer une room/i).first()
    await createButton.click()

    // Try to submit without name
    const submitButton = page.getByRole('button', { name: /créer/i })
    await submitButton.click()

    // Should show validation error or stay on dialog
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
  })

  test('should select room type', async ({ page }) => {
    // Open create dialog
    const createButton = page.getByText(/créer une room/i).first()
    await createButton.click()

    // Check for movie/TV toggle
    const movieButton = page.getByText(/films/i).first()
    const tvButton = page.getByText(/séries/i).first()

    await expect(movieButton).toBeVisible()
    await expect(tvButton).toBeVisible()

    // Click TV shows
    await tvButton.click()

    // Button should be selected (visual feedback)
    // Note: Actual assertion depends on implementation
  })

  test('should display genre selector', async ({ page }) => {
    // Open create dialog
    const createButton = page.getByText(/créer une room/i).first()
    await createButton.click()

    // Look for genre selector
    const genreSelector = page.getByText(/genre/i)
    await expect(genreSelector).toBeVisible()
  })

  test('should handle empty rooms state', async ({ page }) => {
    // If no rooms, should show empty state
    const emptyState = page.getByText(/aucune room|pas de room/i)

    // Either empty state or rooms list should be visible
    const roomsList = page.locator('[data-testid="rooms-list"]')

    const hasRooms = await roomsList.count() > 0
    const hasEmptyState = await emptyState.count() > 0

    expect(hasRooms || hasEmptyState).toBe(true)
  })
})
