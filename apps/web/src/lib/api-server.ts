import { headers, cookies } from "next/headers"
import { auth } from "@/lib/auth"

/**
 * Server-side API fetch for use in Server Components
 * Uses Better Auth's server-side session handling
 */
async function getServerUserEmail(): Promise<string | undefined> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return session?.user?.email
  } catch {
    return undefined
  }
}

async function serverApiFetch(input: string, init: RequestInit = {}) {
  const reqHeaders = new Headers(init.headers)
  const userEmail = await getServerUserEmail()

  if (userEmail) {
    reqHeaders.set("X-User-Email", userEmail)
  }

  // Add cache configuration for Next.js
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, {
    ...init,
    headers: reqHeaders,
    // Use Next.js cache with revalidation
    next: {
      revalidate: 60, // Revalidate every 60 seconds
    },
  })

  return response
}

/**
 * Server-side GET helper
 */
export async function serverGET(input: string, init: RequestInit = {}) {
  return serverApiFetch(input, { ...init, method: "GET" })
}

/**
 * Get user's rooms from server-side
 */
export async function getMyRoomServer() {
  try {
    const response = await serverGET("/rooms/my")
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Get genres from server-side
 */
export async function getGenresServer() {
  try {
    const response = await serverGET("/movies/genres")
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch {
    return null
  }
}
