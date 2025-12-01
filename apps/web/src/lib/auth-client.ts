import { createAuthClient } from "better-auth/react"
import { clearSessionCache } from "@/lib/session-cache"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
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
