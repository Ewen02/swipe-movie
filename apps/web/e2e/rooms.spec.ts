import { test, expect } from '@playwright/test'

// Mock data
const mockGenres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 878, name: 'Science Fiction' },
]

const mockRoom = {
  id: 'test-room-id',
  code: 'TEST123',
  name: 'Test Movie Room',
  movieGenreIds: [28, 35],
  minYear: 2000,
  maxYear: 2024,
  createdAt: new Date().toISOString(),
}

const mockRooms = {
  rooms: [
    {
      ...mockRoom,
      role: 'admin',
      participantCount: 1,
      matchCount: 0,
    },
  ],
}

test.describe('Room Management', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up authenticated session
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

    // Mock genres endpoint
    await page.route('**/movies/genres', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGenres),
      })
    })

    // Mock rooms endpoint initially with empty rooms
    await page.route('**/rooms/mine', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rooms: [] }),
      })
    })
  })

  test('should display rooms page with create and join buttons', async ({ page }) => {
    await page.goto('/rooms')

    // Should see create room button
    await expect(page.getByRole('button', { name: /create|créer/i })).toBeVisible()

    // Should see join room button
    await expect(page.getByRole('button', { name: /join|rejoindre/i })).toBeVisible()
  })

  test('should open create room dialog', async ({ page }) => {
    await page.goto('/rooms')

    // Click create room button
    const createButton = page.getByRole('button', { name: /create|créer/i }).first()
    await createButton.click()

    // Dialog should be visible
    await expect(page.getByRole('dialog')).toBeVisible()

    // Should have room name input
    await expect(page.getByLabel(/name|nom/i)).toBeVisible()
  })

  test('should create a new room successfully', async ({ page }) => {
    // Mock successful room creation
    await page.route('**/rooms', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(mockRoom),
        })
      }
    })

    await page.goto('/rooms')

    // Open create dialog
    const createButton = page.getByRole('button', { name: /create|créer/i }).first()
    await createButton.click()

    // Fill in room details
    await page.getByLabel(/name|nom/i).fill('Test Movie Room')

    // Select genres (if visible)
    const genreSelect = page.locator('[role="combobox"]').first()
    if (await genreSelect.isVisible()) {
      await genreSelect.click()
      await page.getByText('Action').click()
    }

    // Submit form
    const submitButton = page.getByRole('button', { name: /create|créer/i }).last()
    await submitButton.click()

    // Should redirect to the room page
    await expect(page).toHaveURL(/\/rooms\/TEST123/)
  })

  test('should validate room creation form', async ({ page }) => {
    await page.goto('/rooms')

    // Open create dialog
    const createButton = page.getByRole('button', { name: /create|créer/i }).first()
    await createButton.click()

    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: /create|créer/i }).last()
    await submitButton.click()

    // Should show validation errors
    await expect(page.getByText(/required|requis|obligatoire/i)).toBeVisible()
  })

  test('should open join room dialog', async ({ page }) => {
    await page.goto('/rooms')

    // Click join room button
    const joinButton = page.getByRole('button', { name: /join|rejoindre/i }).first()
    await joinButton.click()

    // Dialog should be visible
    await expect(page.getByRole('dialog')).toBeVisible()

    // Should have room code input
    await expect(page.getByLabel(/code/i)).toBeVisible()
  })

  test('should join a room successfully', async ({ page }) => {
    // Mock successful room join
    await page.route('**/rooms/join', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRoom),
      })
    })

    await page.goto('/rooms')

    // Open join dialog
    const joinButton = page.getByRole('button', { name: /join|rejoindre/i }).first()
    await joinButton.click()

    // Fill in room code
    await page.getByLabel(/code/i).fill('TEST123')

    // Submit form
    const submitButton = page.getByRole('button', { name: /join|rejoindre/i }).last()
    await submitButton.click()

    // Should redirect to the room page
    await expect(page).toHaveURL(/\/rooms\/TEST123/)
  })

  test('should handle join room errors', async ({ page }) => {
    // Mock room not found error
    await page.route('**/rooms/join', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Room not found' }),
      })
    })

    await page.goto('/rooms')

    // Open join dialog
    const joinButton = page.getByRole('button', { name: /join|rejoindre/i }).first()
    await joinButton.click()

    // Fill in invalid room code
    await page.getByLabel(/code/i).fill('INVALID')

    // Submit form
    const submitButton = page.getByRole('button', { name: /join|rejoindre/i }).last()
    await submitButton.click()

    // Should show error message
    await expect(page.getByText(/not found|introuvable|error|erreur/i)).toBeVisible()
  })

  test('should display existing rooms', async ({ page }) => {
    // Mock rooms with data
    await page.route('**/rooms/mine', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRooms),
      })
    })

    await page.goto('/rooms')

    // Should display room name
    await expect(page.getByText('Test Movie Room')).toBeVisible()

    // Should display room code
    await expect(page.getByText('TEST123')).toBeVisible()
  })

  test('should navigate to room when clicking on it', async ({ page }) => {
    // Mock rooms with data
    await page.route('**/rooms/mine', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRooms),
      })
    })

    await page.goto('/rooms')

    // Click on the room
    const roomCard = page.locator('a[href*="/rooms/TEST123"]').first()
    await roomCard.click()

    // Should navigate to room page
    await expect(page).toHaveURL(/\/rooms\/TEST123/)
  })

  test('should show onboarding tutorial on first visit', async ({ page, context }) => {
    // Clear localStorage to simulate first visit
    await context.clearCookies()
    await page.goto('/rooms')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    // Should show onboarding tutorial
    await expect(page.getByRole('heading', { name: /tutorial|guide|bienvenue|welcome/i })).toBeVisible()
  })

  test('should skip onboarding tutorial', async ({ page, context }) => {
    // Clear localStorage to simulate first visit
    await context.clearCookies()
    await page.goto('/rooms')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    // Click skip button
    const skipButton = page.getByRole('button', { name: /skip|passer/i })
    await skipButton.click()

    // Tutorial should be hidden
    await expect(page.getByRole('heading', { name: /tutorial|guide|bienvenue|welcome/i })).not.toBeVisible()
  })
})
