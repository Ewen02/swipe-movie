import { getSession } from '@/lib/auth-client';
import { getCachedEmail, setCachedEmail, clearSessionCache } from '@/lib/session-cache';

async function fetchSessionEmail(): Promise<string | undefined> {
  try {
    const session = await getSession();
    const email = session?.data?.user?.email;
    if (email) {
      setCachedEmail(email);
    } else {
      clearSessionCache();
    }
    return email;
  } catch (e) {
    console.error('[api] Failed to get session:', e);
    clearSessionCache();
    return undefined;
  }
}

function getTrialToken(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)trial-session=([^;]+)/);
  return match?.[1] || undefined;
}

type AuthHeader =
  | { kind: 'session'; name: 'X-User-Email'; value: string }
  | { kind: 'trial'; name: 'Authorization'; value: string }
  | { kind: 'none' };

/**
 * Resolve which auth header to send for this request. A real Better Auth
 * session always wins over a leftover trial token — after OAuth, the trial
 * cookie can linger for a few ms before clearTrialData() runs; using the
 * guest JWT during that window would authenticate calls as the (about-to-be-
 * deleted) guest. The cached email lookup avoids a network call when the
 * session is already known.
 */
async function resolveAuthHeader(): Promise<AuthHeader> {
  const cachedEmail = getCachedEmail();
  if (cachedEmail) {
    return { kind: 'session', name: 'X-User-Email', value: cachedEmail };
  }

  const trialToken = getTrialToken();
  if (trialToken) {
    return { kind: 'trial', name: 'Authorization', value: `Bearer ${trialToken}` };
  }

  const sessionEmail = await fetchSessionEmail();
  if (sessionEmail) {
    return { kind: 'session', name: 'X-User-Email', value: sessionEmail };
  }

  return { kind: 'none' };
}

/** Default per-request timeout. A slow/cold backend must never hang the UI
 * forever — without this, a never-resolving fetch leaves loaders spinning
 * indefinitely (e.g. the onboarding "Saving…" overlay). */
const DEFAULT_TIMEOUT_MS = 20_000;

export async function apiFetch(input: string, init: RequestInit = {}) {
  const reqHeaders = new Headers(init.headers);
  const auth = await resolveAuthHeader();
  if (auth.kind !== 'none') {
    reqHeaders.set(auth.name, auth.value);
  }
  // Respect a caller-provided signal if present; otherwise apply a default
  // timeout so the promise always settles.
  const signal = init.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS);
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, {
    ...init,
    headers: reqHeaders,
    signal,
  });
}

// Helpers REST
export async function GET(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: 'GET' });
}

export async function POST(input: string, init: RequestInit = {}) {
  return apiFetch(input, {
    ...init,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

export async function PUT(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: 'PUT' });
}

export async function PATCH(input: string, init: RequestInit = {}) {
  return apiFetch(input, {
    ...init,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

export async function DELETE(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: 'DELETE' });
}
