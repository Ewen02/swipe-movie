import { createAuthClient } from "better-auth/react"
import { clearSessionCache } from "@/lib/session-cache"

// Use NEXT_PUBLIC_AUTH_URL if set, otherwise auto-detect from VERCEL_URL or fallback to localhost
const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_AUTH_URL) {
    return process.env.NEXT_PUBLIC_AUTH_URL
  }
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

// Wrap signOut to clear session cache
const originalSignOut = authClient.signOut
const wrappedSignOut: typeof originalSignOut = async (options) => {
  clearSessionCache()
  return originalSignOut(options)
}

// Export commonly used functions and hooks
export const {
  signIn,
  useSession,
  getSession,
} = authClient

export const signOut = wrappedSignOut
