/**
 * @jest-environment jsdom
 */

// Mock dependencies BEFORE importing the module under test.
const mockGetCachedEmail = jest.fn();
const mockSetCachedEmail = jest.fn();
const mockClearSessionCache = jest.fn();
const mockGetSession = jest.fn();

jest.mock('@/lib/session-cache', () => ({
  getCachedEmail: () => mockGetCachedEmail(),
  setCachedEmail: (...args: unknown[]) => mockSetCachedEmail(...args),
  clearSessionCache: () => mockClearSessionCache(),
}));

jest.mock('@/lib/auth-client', () => ({
  getSession: () => mockGetSession(),
}));

import { apiFetch } from '../api';

describe('apiFetch — auth header priority', () => {
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;

  beforeAll(() => {
    // jsdom + Node 20 makes global.fetch non-configurable for spyOn(), so we
    // replace it outright and restore it after the suite.
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://api.test';
    document.cookie = '';
    // jsdom does not expose Response; the production code only reads the
    // returned Response in callers, not here, so a minimal stub suffices.
    fetchMock.mockResolvedValue({ ok: true, status: 200 } as unknown as Response);
  });

  afterEach(() => {
    // Clear the trial cookie between tests so leftover state doesn't leak.
    document.cookie = 'trial-session=; path=/; max-age=0';
  });

  function getSentHeaders(): Headers {
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    return new Headers(init.headers);
  }

  it('sends X-User-Email when the session is already cached', async () => {
    mockGetCachedEmail.mockReturnValue('alice@example.com');
    document.cookie = 'trial-session=guest.jwt.here';

    await apiFetch('/anything');

    const h = getSentHeaders();
    expect(h.get('X-User-Email')).toBe('alice@example.com');
    // Critical: the trial cookie must NOT win over the real session, because
    // after OAuth the guest user is about to be deleted server-side.
    expect(h.get('Authorization')).toBeNull();
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('falls back to the trial token when no cached session exists', async () => {
    mockGetCachedEmail.mockReturnValue(undefined);
    document.cookie = 'trial-session=guest.jwt.here';

    await apiFetch('/anything');

    const h = getSentHeaders();
    expect(h.get('Authorization')).toBe('Bearer guest.jwt.here');
    expect(h.get('X-User-Email')).toBeNull();
  });

  it('fetches a fresh session as last resort when neither cache nor trial exists', async () => {
    mockGetCachedEmail.mockReturnValue(undefined);
    mockGetSession.mockResolvedValue({ data: { user: { email: 'bob@example.com' } } });

    await apiFetch('/anything');

    const h = getSentHeaders();
    expect(h.get('X-User-Email')).toBe('bob@example.com');
    expect(mockSetCachedEmail).toHaveBeenCalledWith('bob@example.com');
  });

  it('sends no auth header when there is neither session nor trial token', async () => {
    mockGetCachedEmail.mockReturnValue(undefined);
    mockGetSession.mockResolvedValue({ data: null });

    await apiFetch('/anything');

    const h = getSentHeaders();
    expect(h.get('Authorization')).toBeNull();
    expect(h.get('X-User-Email')).toBeNull();
    expect(mockClearSessionCache).toHaveBeenCalled();
  });

  it('forwards method and body untouched', async () => {
    mockGetCachedEmail.mockReturnValue('alice@example.com');

    await apiFetch('/x', { method: 'POST', body: 'hello' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://api.test/x');
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).body).toBe('hello');
  });
});
