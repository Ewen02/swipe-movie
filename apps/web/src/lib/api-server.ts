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

interface ServerFetchOptions extends RequestInit {
  revalidate?: number | false
}

async function serverApiFetch(input: string, init: ServerFetchOptions = {}) {
  const reqHeaders = new Headers(init.headers)
  const userEmail = await getServerUserEmail()

  if (userEmail) {
    reqHeaders.set("X-User-Email", userEmail)
  }

  const { revalidate = 60, ...fetchInit } = init

  // Add cache configuration for Next.js
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, {
    ...fetchInit,
    headers: reqHeaders,
    // Use Next.js cache with revalidation
    next: {
      revalidate,
    },
  })

  return response
}

/**
 * Server-side GET helper
 */
export async function serverGET(input: string, init: ServerFetchOptions = {}) {
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
 * Cached for 24h since genres rarely change
 */
export async function getGenresServer() {
  try {
    const response = await serverGET("/movies/genres", { revalidate: 86400 }) // 24h cache
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Get room by code from server-side
 * Used for prefetching room data in room layouts
 */
export async function getRoomByCodeServer(code: string) {
  try {
    const response = await serverGET(`/rooms/code/${code}`, { revalidate: 60 })
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch {
    return null
  }
}
