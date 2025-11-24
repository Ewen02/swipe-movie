import { test, expect } from '@playwright/test'

// Mock data
const mockRoom = {
  id: 'test-room-id',
  code: 'TEST123',
  name: 'Test Movie Room',
  type: 'movie',
  genreId: 28,
  minYear: 2000,
  maxYear: 2024,
  members: [
    { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
  ],
}

const mockMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    overview: 'A great action movie',
    poster_path: '/test-poster-1.jpg',
    backdrop_path: '/test-backdrop-1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
  },
  {
    id: 2,
    title: 'Test Movie 2',
    overview: 'Another action movie',
    poster_path: '/test-poster-2.jpg',
    backdrop_path: '/test-backdrop-2.jpg',
    release_date: '2023-02-01',
    vote_average: 7.8,
  },
  {
    id: 3,
    title: 'Test Movie 3',
    overview: 'Yet another movie',
    poster_path: '/test-poster-3.jpg',
    backdrop_path: '/test-backdrop-3.jpg',
    release_date: '2023-03-01',
    vote_average: 9.0,
  },
]

const mockSwipes = [
  {
    id: 'swipe-1',
    movieId: '1',
    value: true,
    userId: 'test-user-id',
  },
]

test.describe('Movie Swiping', () => {
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

    // Mock room endpoint
    await page.route('**/rooms/TEST123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRoom),
      })
    })

    // Mock swipes endpoint (empty initially)
    await page.route('**/rooms/*/swipes/mine', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    // Mock movies endpoint
    await page.route('**/movies/discover**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          results: mockMovies,
          total_pages: 1,
          total_results: mockMovies.length,
        }),
      })
    })

    // Mock TMDB image endpoint
    await page.route('**image.tmdb.org/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/jpeg',
        body: Buffer.from('fake-image-data'),
      })
    })
  })

  test('should display movie cards in room', async ({ page }) => {
    await page.goto('/rooms/TEST123')

    // Wait for movies to load
    await page.waitForLoadState('networkidle')

    // Should display movie title
    await expect(page.getByText('Test Movie 1')).toBeVisible()

    // Should display movie overview
    await expect(page.getByText(/A great action movie/i)).toBeVisible()
  })

  test('should swipe right on a movie (like)', async ({ page }) => {
    // Mock swipe creation endpoint
    let swipeCreated = false
    await page.route('**/rooms/*/swipes', async (route) => {
      if (route.request().method() === 'POST') {
        swipeCreated = true
        const body = route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-swipe-id',
            movieId: body.movieId,
            value: body.value,
            userId: 'test-user-id',
            matchCreated: false,
          }),
        })
      }
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Find and click the like button (right swipe)
    const likeButton = page.getByRole('button', { name: /like|j'aime|👍|❤️/i }).first()
    await likeButton.click()

    // Wait for swipe to be created
    await page.waitForTimeout(500)

    // Verify swipe was sent to backend
    expect(swipeCreated).toBe(true)

    // The next movie should be visible
    await expect(page.getByText('Test Movie 2')).toBeVisible()
  })

  test('should swipe left on a movie (dislike)', async ({ page }) => {
    // Mock swipe creation endpoint
    let swipeCreated = false
    await page.route('**/rooms/*/swipes', async (route) => {
      if (route.request().method() === 'POST') {
        swipeCreated = true
        const body = route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-swipe-id',
            movieId: body.movieId,
            value: body.value,
            userId: 'test-user-id',
            matchCreated: false,
          }),
        })
      }
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Find and click the dislike button (left swipe)
    const dislikeButton = page.getByRole('button', { name: /dislike|skip|pass|👎|✕/i }).first()
    await dislikeButton.click()

    // Wait for swipe to be created
    await page.waitForTimeout(500)

    // Verify swipe was sent to backend
    expect(swipeCreated).toBe(true)

    // The next movie should be visible
    await expect(page.getByText('Test Movie 2')).toBeVisible()
  })

  test('should undo a swipe', async ({ page }) => {
    // Mock swipes with one existing swipe
    await page.route('**/rooms/*/swipes/mine', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSwipes),
      })
    })

    // Mock delete swipe endpoint
    let swipeDeleted = false
    await page.route('**/rooms/*/swipes/*', async (route) => {
      if (route.request().method() === 'DELETE') {
        swipeDeleted = true
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      }
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Navigate to history tab
    await page.getByRole('tab', { name: /history|historique/i }).click()

    // Find and click undo button
    const undoButton = page.getByRole('button', { name: /undo|annuler/i }).first()
    if (await undoButton.isVisible()) {
      await undoButton.click()

      // Confirm in dialog if present
      const confirmButton = page.getByRole('button', { name: /confirm|yes|oui/i })
      if (await confirmButton.isVisible()) {
        await confirmButton.click()
      }

      // Wait for operation
      await page.waitForTimeout(500)

      // Verify swipe was deleted
      expect(swipeDeleted).toBe(true)
    }
  })

  test('should show movie details when clicking info button', async ({ page }) => {
    // Mock movie details endpoint
    await page.route('**/movies/1**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...mockMovies[0],
          genres: [{ id: 28, name: 'Action' }],
          runtime: 120,
          vote_count: 1000,
        }),
      })
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Find and click info button
    const infoButton = page.getByRole('button', { name: /info|details|more/i }).first()
    await infoButton.click()

    // Modal should open with movie details
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Test Movie 1')).toBeVisible()
  })

  test('should handle swipe errors gracefully', async ({ page }) => {
    // Mock swipe creation failure
    await page.route('**/rooms/*/swipes', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Failed to create swipe' }),
        })
      }
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Swipe on a movie
    const likeButton = page.getByRole('button', { name: /like|j'aime|👍|❤️/i }).first()
    await likeButton.click()

    // Wait for error handling
    await page.waitForTimeout(500)

    // Movie should still be visible (error recovery)
    await expect(page.getByText('Test Movie 1')).toBeVisible()
  })

  test('should display empty state when all movies are swiped', async ({ page }) => {
    // Mock empty movies response
    await page.route('**/movies/discover**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        }),
      })
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Should show empty state
    await expect(page.getByText(/no movies|aucun film|all swiped/i)).toBeVisible()
  })

  test('should navigate between tabs', async ({ page }) => {
    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Navigate to matches tab
    await page.getByRole('tab', { name: /matches/i }).click()
    await expect(page.getByRole('tabpanel')).toBeVisible()

    // Navigate to history tab
    await page.getByRole('tab', { name: /history|historique/i }).click()
    await expect(page.getByRole('tabpanel')).toBeVisible()

    // Navigate to stats tab
    await page.getByRole('tab', { name: /stats|analytics/i }).click()
    await expect(page.getByRole('tabpanel')).toBeVisible()

    // Navigate to members tab
    await page.getByRole('tab', { name: /members|membres/i }).click()
    await expect(page.getByRole('tabpanel')).toBeVisible()
    await expect(page.getByText('Test User')).toBeVisible()

    // Navigate back to swipe tab
    await page.getByRole('tab', { name: /swipe/i }).click()
    await expect(page.getByText('Test Movie 1')).toBeVisible()
  })

  test('should show loading state while fetching movies', async ({ page }) => {
    // Delay movie response
    await page.route('**/movies/discover**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          results: mockMovies,
          total_pages: 1,
          total_results: mockMovies.length,
        }),
      })
    })

    await page.goto('/rooms/TEST123')

    // Should show loading skeleton
    await expect(page.locator('.animate-pulse')).toBeVisible()

    // Wait for movies to load
    await page.waitForLoadState('networkidle')

    // Loading should be gone, movies visible
    await expect(page.getByText('Test Movie 1')).toBeVisible()
  })
})
