import { getSession } from "@/lib/auth-client"
import { getCachedEmail, setCachedEmail, clearSessionCache } from "@/lib/session-cache"

async function getCachedUserEmail(): Promise<string | undefined> {
  // Return cached email if available
  const cached = getCachedEmail()
  if (cached) {
    return cached
  }

  try {
    const session = await getSession()
    const email = session?.data?.user?.email

    if (email) {
      setCachedEmail(email)
    } else {
      clearSessionCache()
    }

    return email
  } catch (e) {
    console.error("[api] Failed to get session:", e)
    clearSessionCache()
    return undefined
  }
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const reqHeaders = new Headers(init.headers)
  const userEmail = await getCachedUserEmail()

  if (userEmail) {
    reqHeaders.set("X-User-Email", userEmail)
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, { ...init, headers: reqHeaders })
}

// Helpers REST
export async function GET(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: "GET" })
}

export async function POST(input: string, init: RequestInit = {}) {
  return apiFetch(input, {
    ...init,
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  })
}

export async function PUT(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: "PUT" })
}

export async function DELETE(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: "DELETE" })
}
