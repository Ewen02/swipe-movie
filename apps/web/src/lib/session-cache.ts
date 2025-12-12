// Session cache to avoid multiple get-session requests per page load
let cachedSession: { email: string; timestamp: number } | null = null
const SESSION_CACHE_TTL = 5 * 60 * 1000 // 5 minutes cache (aligned with server cookie cache)

export function getCachedEmail(): string | undefined {
  const now = Date.now()
  if (cachedSession && now - cachedSession.timestamp < SESSION_CACHE_TTL) {
    return cachedSession.email
  }
  return undefined
}

export function setCachedEmail(email: string): void {
  cachedSession = { email, timestamp: Date.now() }
}

export function clearSessionCache(): void {
  cachedSession = null
}
