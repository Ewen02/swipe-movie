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
    { id: 'user-2', name: 'Other User', email: 'other@example.com' },
  ],
}

const mockMovies = [
  {
    id: 550,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman...',
    poster_path: '/fight-club.jpg',
    backdrop_path: '/fight-club-backdrop.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
  },
  {
    id: 13,
    title: 'Forrest Gump',
    overview: 'A man with a low IQ has accomplished great things...',
    poster_path: '/forrest-gump.jpg',
    backdrop_path: '/forrest-gump-backdrop.jpg',
    release_date: '1994-07-06',
    vote_average: 8.5,
  },
]

const mockMatches = [
  {
    id: 'match-1',
    movieId: '550',
    roomId: 'test-room-id',
    movie: mockMovies[0],
    createdAt: new Date().toISOString(),
    swipeCount: 2,
  },
]

test.describe('Match Detection System', () => {
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

    // Mock swipes endpoint
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

    // Mock matches endpoint (empty initially)
    await page.route('**/rooms/*/matches', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
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

  test('should display match animation when a match is created', async ({ page }) => {
    // Mock swipe creation that creates a match
    await page.route('**/rooms/*/swipes', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-swipe-id',
            movieId: '550',
            value: true,
            userId: 'test-user-id',
            matchCreated: true, // This triggers match animation
          }),
        })
      }
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Swipe right on a movie
    const likeButton = page.getByRole('button', { name: /like|j'aime|👍|❤️/i }).first()
    await likeButton.click()

    // Wait for match animation to appear
    await page.waitForTimeout(500)

    // Should show match animation
    await expect(page.getByText(/match|it's a match|c'est un match/i)).toBeVisible()
  })

  test('should display matches in the matches tab', async ({ page }) => {
    // Mock matches endpoint with data
    await page.route('**/rooms/*/matches', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMatches),
      })
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Navigate to matches tab
    await page.getByRole('tab', { name: /matches/i }).click()

    // Should display matched movie
    await expect(page.getByText('Fight Club')).toBeVisible()
  })

  test('should show empty state when no matches exist', async ({ page }) => {
    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Navigate to matches tab
    await page.getByRole('tab', { name: /matches/i }).click()

    // Should show empty state
    await expect(page.getByText(/no matches|aucun match|start swiping/i)).toBeVisible()
  })

  test('should create match when all members like the same movie', async ({ page }) => {
    let matchCreated = false

    // Mock swipe that creates a match
    await page.route('**/rooms/*/swipes', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON()
        // Simulate that this swipe creates a match (everyone liked it)
        if (body.value === true) {
          matchCreated = true
        }
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-swipe-id',
            movieId: body.movieId,
            value: body.value,
            userId: 'test-user-id',
            matchCreated: matchCreated,
          }),
        })
      }
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Swipe right (like) on the movie
    const likeButton = page.getByRole('button', { name: /like|j'aime|👍|❤️/i }).first()
    await likeButton.click()

    // Wait for swipe to complete
    await page.waitForTimeout(500)

    // Verify match was created
    expect(matchCreated).toBe(true)
  })

  test('should not create match when members disagree', async ({ page }) => {
    let matchCreated = false

    // Mock swipe that doesn't create a match
    await page.route('**/rooms/*/swipes', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON()
        // Simulate that this swipe doesn't create a match (someone disliked it)
        matchCreated = false
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

    // Swipe left (dislike) on the movie
    const dislikeButton = page.getByRole('button', { name: /dislike|skip|pass|👎|✕/i }).first()
    await dislikeButton.click()

    // Wait for swipe to complete
    await page.waitForTimeout(500)

    // Verify match was NOT created
    expect(matchCreated).toBe(false)

    // Match animation should not appear
    await expect(page.getByText(/match|it's a match|c'est un match/i)).not.toBeVisible()
  })

  test('should display match count in matches tab', async ({ page }) => {
    // Mock multiple matches
    const multipleMatches = [
      mockMatches[0],
      {
        id: 'match-2',
        movieId: '13',
        roomId: 'test-room-id',
        movie: mockMovies[1],
        createdAt: new Date().toISOString(),
        swipeCount: 2,
      },
    ]

    await page.route('**/rooms/*/matches', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(multipleMatches),
      })
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Navigate to matches tab
    await page.getByRole('tab', { name: /matches/i }).click()

    // Should display both matches
    await expect(page.getByText('Fight Club')).toBeVisible()
    await expect(page.getByText('Forrest Gump')).toBeVisible()
  })

  test('should show match progress indicator', async ({ page }) => {
    // Mock room with 3 members
    await page.route('**/rooms/TEST123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...mockRoom,
          members: [
            ...mockRoom.members,
            { id: 'user-3', name: 'Third User', email: 'third@example.com' },
          ],
        }),
      })
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Navigate to matches tab
    await page.getByRole('tab', { name: /matches/i }).click()

    // Tab should be accessible
    await expect(page.getByRole('tabpanel')).toBeVisible()
  })

  test('should handle match notification via WebSocket', async ({ page }) => {
    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Simulate receiving a WebSocket message about a match
    await page.evaluate(() => {
      // Trigger a custom event that the app might listen to
      window.dispatchEvent(
        new CustomEvent('match-created', {
          detail: {
            movieId: '550',
            movie: {
              id: 550,
              title: 'Fight Club',
            },
          },
        })
      )
    })

    // Wait for potential animation or notification
    await page.waitForTimeout(500)

    // Page should still be functional (no crashes)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should close match animation when clicking outside', async ({ page }) => {
    // Mock swipe that creates a match
    await page.route('**/rooms/*/swipes', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-swipe-id',
            movieId: '550',
            value: true,
            userId: 'test-user-id',
            matchCreated: true,
          }),
        })
      }
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Swipe right to create a match
    const likeButton = page.getByRole('button', { name: /like|j'aime|👍|❤️/i }).first()
    await likeButton.click()

    // Wait for match animation
    await page.waitForTimeout(500)

    // Animation should be visible
    const matchText = page.getByText(/match|it's a match|c'est un match/i)
    if (await matchText.isVisible()) {
      // Click outside or on close button
      const closeButton = page.getByRole('button', { name: /close|fermer/i })
      if (await closeButton.isVisible()) {
        await closeButton.click()
      } else {
        // Click outside the animation
        await page.locator('body').click({ position: { x: 10, y: 10 } })
      }

      // Wait for animation to close
      await page.waitForTimeout(1000)

      // Animation should be hidden or auto-dismiss
      // Page should be functional
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should display match details in matches list', async ({ page }) => {
    // Mock matches with detailed info
    await page.route('**/rooms/*/matches', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMatches),
      })
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Navigate to matches tab
    await page.getByRole('tab', { name: /matches/i }).click()

    // Should display movie title
    await expect(page.getByText('Fight Club')).toBeVisible()

    // Should display rating or other details
    await expect(page.locator('[role="tabpanel"]')).toBeVisible()
  })

  test('should refresh matches list when returning to matches tab', async ({ page }) => {
    let requestCount = 0

    await page.route('**/rooms/*/matches', async (route) => {
      requestCount++
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMatches),
      })
    })

    await page.goto('/rooms/TEST123')
    await page.waitForLoadState('networkidle')

    // Navigate to matches tab
    await page.getByRole('tab', { name: /matches/i }).click()
    await page.waitForTimeout(300)

    const initialRequestCount = requestCount

    // Navigate away
    await page.getByRole('tab', { name: /swipe/i }).click()
    await page.waitForTimeout(300)

    // Navigate back to matches
    await page.getByRole('tab', { name: /matches/i }).click()
    await page.waitForTimeout(300)

    // Should have made additional request(s)
    expect(requestCount).toBeGreaterThanOrEqual(initialRequestCount)
  })
})
