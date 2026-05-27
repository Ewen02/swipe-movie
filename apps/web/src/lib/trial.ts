const TRIAL_COOKIE = 'trial-session'
const TRIAL_STORAGE_KEY = 'trial-data'
const TRIAL_DURATION_MS = 2 * 60 * 60 * 1000 // 2 hours

export type TrialData = {
  guestId: string
  roomCode: string
  token: string
  startedAt: number
}

/**
 * Read trial data from localStorage
 */
export function getTrialData(): TrialData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(TRIAL_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as TrialData
  } catch {
    return null
  }
}

/**
 * Write trial data to localStorage and set a cookie with the token for API calls
 */
export function setTrialData(data: TrialData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(data))
  // Set a cookie so middleware / SSR can read the token
  const maxAge = Math.floor(TRIAL_DURATION_MS / 1000)
  document.cookie = `${TRIAL_COOKIE}=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/**
 * Remove trial data from localStorage and cookie
 */
export function clearTrialData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TRIAL_STORAGE_KEY)
  document.cookie = `${TRIAL_COOKIE}=; path=/; max-age=0`
}

/**
 * Check if trial data exists and token is not expired
 */
export function isTrialActive(): boolean {
  const data = getTrialData()
  if (!data) return false
  return Date.now() - data.startedAt < TRIAL_DURATION_MS
}

/**
 * Start a trial session by calling the public endpoint
 */
export async function startTrial(options?: {
  genreId?: number
  type?: string
}): Promise<TrialData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const body: Record<string, unknown> = {}
  if (options?.genreId) body.genreId = options.genreId
  if (options?.type) body.type = options.type

  const res = await fetch(`${apiUrl}/trial/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Failed to start trial: ${res.status}`)
  }

  const json = await res.json()
  const data: TrialData = {
    guestId: json.guestId,
    roomCode: json.roomCode,
    token: json.token,
    startedAt: Date.now(),
  }

  setTrialData(data)
  return data
}

/**
 * Like the regular apiFetch but uses the trial token from localStorage.
 * Does NOT set X-User-Email (no real user).
 */
export async function trialApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const data = getTrialData()
  const headers = new Headers(init.headers)

  if (data?.token) {
    headers.set('Authorization', `Bearer ${data.token}`)
  }
  if (!headers.has('Content-Type') && init.method && init.method !== 'GET') {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(`${apiUrl}${path}`, { ...init, headers })
}
