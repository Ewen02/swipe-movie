import { getSession } from '@/lib/auth-client';
import { getCachedEmail, setCachedEmail, clearSessionCache } from '@/lib/session-cache';

async function getCachedUserEmail(): Promise<string | undefined> {
  const cached = getCachedEmail();
  if (cached) {
    return cached;
  }

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

export async function apiFetch(input: string, init: RequestInit = {}) {
  const reqHeaders = new Headers(init.headers);

  // A real Better Auth session always wins over a leftover trial token.
  // Why: after OAuth, the trial cookie can linger for a few ms before
  // clearTrialData() runs — using the guest JWT during that window would
  // authenticate the migrate/room calls as the (about-to-be-deleted) guest.
  // Cached email lookup avoids a network call when the session is known.
  const cachedEmail = getCachedEmail();
  if (cachedEmail) {
    reqHeaders.set('X-User-Email', cachedEmail);
  } else {
    const trialToken = getTrialToken();
    if (trialToken) {
      reqHeaders.set('Authorization', `Bearer ${trialToken}`);
    } else {
      const userEmail = await getCachedUserEmail();
      if (userEmail) {
        reqHeaders.set('X-User-Email', userEmail);
      }
    }
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, { ...init, headers: reqHeaders });
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
