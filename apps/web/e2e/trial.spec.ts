import { test, expect, type Page } from '@playwright/test';

// All trial tests require a running API to create ghost users and rooms.
// CI provisions both Postgres and the API in the e2e workflow — see
// .github/workflows/e2e.yml. To skip locally without the API, set
// SKIP_TRIAL_E2E=1.
test.describe('Trial Flow', () => {
  test.skip(process.env.SKIP_TRIAL_E2E === '1', 'API not running locally');

  /**
   * Helper: start a trial by navigating to /try, picking the first genre,
   * and waiting for the redirect to the room page.
   * Returns the room code extracted from the URL.
   */
  async function createTrialRoom(page: Page): Promise<string> {
    await page.goto('/fr/try');

    // Click the first genre button (Action / 💥)
    const genreButtons = page.locator('button:has-text("Action"), button:has-text("💥")');
    await genreButtons.first().click();

    // Wait for the loading screen
    await expect(page.getByText('Création de ta room...')).toBeVisible({ timeout: 5_000 });

    // Wait for the redirect to a room URL
    await page.waitForURL(/\/rooms\/[A-Z0-9]+$/i, { timeout: 15_000 });

    // Extract the room code from the URL
    const url = page.url();
    const match = url.match(/\/rooms\/([A-Z0-9]+)$/i);
    if (!match || !match[1]) {
      throw new Error(`Could not extract room code from URL: ${url}`);
    }
    return match[1];
  }

  // ─── Test 1: Trial genre picker loads ───────────────────────────────

  test('trial genre picker loads', async ({ page }) => {
    await page.goto('/fr/try');
    await page.waitForLoadState('networkidle');

    // 8 genre buttons should be visible
    const genreButtons = page.locator('.grid button');
    await expect(genreButtons).toHaveCount(8);

    // Verify "Gratuit · Sans inscription" badge
    await expect(page.getByText('Gratuit · Sans inscription')).toBeVisible();

    // Verify trust badges at the bottom
    await expect(page.getByText('100% gratuit')).toBeVisible();
    await expect(page.getByText('Sans inscription')).toBeVisible();
    await expect(page.getByText('Prêt en 30s')).toBeVisible();
  });

  // ─── Test 2: Trial creates room and redirects ──────────────────────

  test('trial creates room and redirects', async ({ page }) => {
    await page.goto('/fr/try');
    await page.waitForLoadState('networkidle');

    // Click the Action genre button
    const actionButton = page.locator('button:has-text("Action")');
    await actionButton.first().click();

    // Loading screen should appear
    await expect(page.getByText('Création de ta room...')).toBeVisible({ timeout: 5_000 });

    // Should redirect to a /rooms/<CODE> URL
    await page.waitForURL(/\/rooms\/[A-Z0-9]+$/i, { timeout: 15_000 });

    // Room page should load — look for room header or swipe content
    const roomLoaded = page
      .locator('[data-testid="room-header"], header, [role="tablist"]')
      .first();
    await expect(roomLoaded).toBeVisible({ timeout: 10_000 });
  });

  // ─── Test 3: Trial join page works ─────────────────────────────────

  test('trial join page works', async ({ page, context }) => {
    // First create a trial room to get a valid code
    const roomCode = await createTrialRoom(page);

    // Open a new page (fresh context = different guest) to join the room
    const joinPage = await context.newPage();
    await joinPage.goto(`/fr/try/join/${roomCode}`);

    // Should redirect to /rooms/<CODE>
    await joinPage.waitForURL(new RegExp(`/rooms/${roomCode}`, 'i'), {
      timeout: 15_000,
    });

    // Verify the room page loaded
    const roomContent = joinPage
      .locator('[data-testid="room-header"], header, [role="tablist"]')
      .first();
    await expect(roomContent).toBeVisible({ timeout: 10_000 });

    await joinPage.close();
  });

  // ─── Test 4: Login wall appears after swipes ───────────────────────

  test('login wall appears after swipes', async ({ page }) => {
    // Create a trial room
    await createTrialRoom(page);

    // Wait for movies to load (swipe cards or tab panel)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2_000);

    // Perform 16 swipes by clicking the Nope (X) button repeatedly.
    // The soft limit is 15 swipes, so the login wall should appear after that.
    const nopeButton = page.locator('button[aria-label="Nope"]');
    const likeButton = page.locator('button[aria-label="Like"]');

    for (let i = 0; i < 16; i++) {
      // Try Nope first, fall back to Like
      const swipeBtn = (await nopeButton.isVisible()) ? nopeButton : likeButton;
      await swipeBtn.click();
      // Small delay to let animation/api call settle
      await page.waitForTimeout(600);
    }

    // The login wall modal should now be visible
    const loginWall = page.getByText('Tu kiffes le concept ?');
    await expect(loginWall).toBeVisible({ timeout: 10_000 });

    // "Continuer avec Google" button should be present
    await expect(page.getByText('Continuer avec Google')).toBeVisible();
  });

  // ─── Test 5: Trial banner is visible ───────────────────────────────

  test('trial banner is visible', async ({ page }) => {
    // Create a trial room and land on the room page
    await createTrialRoom(page);

    // Wait for the room page to fully render
    await page.waitForLoadState('networkidle');

    // The trial banner should display "Mode essai"
    const trialBanner = page.getByText(/Mode essai/);
    await expect(trialBanner).toBeVisible({ timeout: 10_000 });
  });

  // ─── Test 6: /try/migrate without trial data redirects ─────────────

  test('migrate route without trial data redirects to /rooms', async ({ page }) => {
    // No trial cookie/localStorage: hitting the migrate route should bounce
    // the user back to the rooms list rather than render a broken state.
    await page.goto('/fr/try/migrate');
    await page.waitForURL(/\/rooms$/, { timeout: 10_000 });
  });

  // ─── Test 7: Legacy /try?migrate=true forwards to /try/migrate ─────

  test('legacy ?migrate=true forwards to /try/migrate', async ({ page }) => {
    // Older Better Auth callbacks point at /try?migrate=true; the picker
    // route must forward them to the dedicated migration page rather than
    // silently ignoring the param.
    await page.goto('/fr/try?migrate=true');
    await page.waitForURL(/\/try\/migrate|\/rooms$/, { timeout: 10_000 });
  });

  // ─── Test 8: Migration error screen shows on backend failure ───────

  test('migration error screen renders when backend fails', async ({ page, context }) => {
    // Seed a trial room so getTrialData() returns something.
    const roomCode = await createTrialRoom(page);

    // Intercept the migrate endpoint and force a 500 so we can verify the
    // error UI without needing a real OAuth flow.
    await context.route('**/trial/migrate', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'forced failure for test' }),
      }),
    );

    await page.goto('/fr/try/migrate');

    // The dedicated error UI (not the room page) must be visible.
    await expect(page.getByText('Impossible de finaliser ton compte')).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole('button', { name: 'Réessayer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voir mes rooms' })).toBeVisible();

    // We must still be on /try/migrate (not redirected to the broken room).
    expect(page.url()).toContain('/try/migrate');

    // The trial cookie should still exist for the retry path.
    const cookies = await context.cookies();
    const trialCookie = cookies.find((c) => c.name === 'trial-session');
    expect(trialCookie).toBeDefined();

    // Sanity: the room code is still extractable from storage for retry.
    expect(roomCode).toMatch(/^[A-Z0-9]+$/i);
  });
});
