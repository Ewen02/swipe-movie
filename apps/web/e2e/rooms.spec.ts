import { test, expect, Page } from '@playwright/test'

// Helper function to mock authentication
async function mockAuth(page: Page) {
  await page.addInitScript(() => {
    // Mock NextAuth session
    window.localStorage.setItem(
      'next-auth.session',
      JSON.stringify({
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
    )
  })
}

test.describe('Rooms List Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
    await page.goto('/rooms')
  })

  test('should display rooms page with header', async ({ page }) => {
    // Check for page heading (supports both FR and EN)
    const heading = page.getByRole('heading', { name: /my.*rooms|mes.*rooms/i })
    await expect(heading).toBeVisible()
  })

  test('should display create room button', async ({ page }) => {
    // Check for create room button (FR/EN)
    const createButton = page.getByRole('button', { name: /create.*room|créer.*room/i })
    await expect(createButton).toBeVisible()
  })

  test('should display join room button', async ({ page }) => {
    // Check for join room button (FR/EN)
    const joinButton = page.getByRole('button', { name: /join.*room|rejoindre.*room/i })
    await expect(joinButton).toBeVisible()
  })

  test('should display room statistics', async ({ page }) => {
    // Check for stats cards
    const statsText = page.getByText(/total.*rooms|matches|swipes/i)
    await expect(statsText.first()).toBeVisible()
  })
})

test.describe('Create Room Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
    await page.goto('/rooms')
  })

  test('should open create room dialog', async ({ page }) => {
    // Click create room button
    const createButton = page.getByRole('button', { name: /create.*room|créer.*room/i })
    await createButton.click()

    // Check dialog is visible
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Check dialog has form fields
    await expect(page.getByPlaceholder(/nom.*room|room.*name/i)).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Open create room dialog
    await page.getByRole('button', { name: /create.*room|créer.*room/i }).click()

    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: /create|créer/i }).last()
    await submitButton.click()

    // Should stay on dialog or show error
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
  })

  test('should display room type selector', async ({ page }) => {
    // Open create room dialog
    await page.getByRole('button', { name: /create.*room|créer.*room/i }).click()

    // Check for movie/TV buttons (FR/EN)
    const movieButton = page.getByText(/🎬.*films|🎬.*movies/i).first()
    const tvButton = page.getByText(/📺.*séries|📺.*tv shows/i).first()

    await expect(movieButton).toBeVisible()
    await expect(tvButton).toBeVisible()
  })

  test('should display genre selector', async ({ page }) => {
    // Open create room dialog
    await page.getByRole('button', { name: /create.*room|créer.*room/i }).click()

    // Look for genre selector (FR/EN)
    const genreSelector = page.getByText(/genre/i)
    await expect(genreSelector).toBeVisible()
  })
})

test.describe('Join Room Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
    await page.goto('/rooms')
  })

  test('should open join room dialog', async ({ page }) => {
    // Click join room button
    const joinButton = page.getByRole('button', { name: /join.*room|rejoindre.*room/i })
    await joinButton.click()

    // Check dialog is visible
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Check dialog has code input field
    await expect(page.getByPlaceholder(/code/i)).toBeVisible()
  })

  test('should validate room code input', async ({ page }) => {
    // Open join room dialog
    await page.getByRole('button', { name: /join.*room|rejoindre.*room/i }).click()

    // Try to submit without code
    const submitButton = page.getByRole('button', { name: /join|rejoindre/i }).last()
    await submitButton.click()

    // Should stay on dialog or show error
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
  })
})

test.describe('Room Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
  })

  test('should display room tabs', async ({ page }) => {
    // Mock API response
    await page.route('**/api/rooms/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-room-id',
          code: 'TEST123',
          name: 'Test Room',
          type: 'movie',
          members: [
            { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
          ],
        }),
      })
    })

    await page.goto('/rooms/TEST123')

    // Check tabs are visible (FR/EN with emojis)
    await expect(page.getByRole('tab', { name: /🎬.*swipe|🎬.*swiper/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /✨.*matches/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /👥.*members|👥.*membres/i })).toBeVisible()
  })

  test('should display share button', async ({ page }) => {
    await page.route('**/api/rooms/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-room-id',
          code: 'TEST123',
          name: 'Test Room',
          type: 'movie',
          members: [{ id: 'test-user-id', name: 'Test User' }],
        }),
      })
    })

    await page.goto('/rooms/TEST123')

    // Check share button exists (FR/EN)
    const shareButton = page.getByRole('button', { name: /share|partager/i })
    await expect(shareButton).toBeVisible()
  })

  test('should switch between tabs', async ({ page }) => {
    await page.route('**/api/rooms/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-room-id',
          code: 'TEST123',
          name: 'Test Room',
          type: 'movie',
          members: [{ id: 'test-user-id', name: 'Test User' }],
        }),
      })
    })

    await page.goto('/rooms/TEST123')

    // Click on members tab
    await page.getByRole('tab', { name: /👥.*members|👥.*membres/i }).click()

    // Check members content is visible (FR/EN)
    await expect(page.getByText(/room members|membres.*room/i)).toBeVisible()

    // Click on matches tab
    await page.getByRole('tab', { name: /✨.*matches/i }).click()

    // Check matches content is visible (FR/EN)
    await expect(page.getByText(/no matches|aucun match|matched movies|films matchés/i)).toBeVisible()
  })
})
