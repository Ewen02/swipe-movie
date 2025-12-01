import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { PrismaClient } from "@prisma/client"

// Initialize Prisma client (singleton pattern for serverless)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/**
 * Fetch with retry logic for resilience against temporary network issues
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok || i === retries) {
        return response
      }
      // Wait before retry with exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    } catch (error) {
      if (i === retries) throw error
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
  throw new Error('Max retries reached')
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  advanced: {
    cookiePrefix: "swipe-movie",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [nextCookies()],
  // Callbacks to sync with backend API
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Sync user with backend API when a new user is created
          try {
            await fetchWithRetry(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-upsert`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user.email,
                  name: user.name ?? user.email?.split('@')[0] ?? 'User'
                }),
              },
              2
            )
            console.log(`[WEB] [Better Auth] User synced with backend: ${user.email}`)
          } catch (e) {
            console.error("[WEB] [Better Auth] Failed to sync user with backend:", e)
            // Don't block auth flow on backend sync failure
          }
        },
      },
    },
  },
})

// Type exports for client usage
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
