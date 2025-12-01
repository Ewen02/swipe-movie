import NextAuth from "next-auth"
import { getServerSession, type NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"

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

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
    signOut: '/',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const response = await fetchWithRetry(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-upsert`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, name: user.name ?? undefined }),
          },
          2 // 2 retries with exponential backoff
        )

        if (!response.ok) {
          const text = await response.text()
          console.error("oauth-upsert failed with status:", response.status, "body:", text)
          // Allow sign in even if upsert fails (graceful degradation)
          // The user will be created on next successful attempt
          console.warn("Allowing sign in despite upsert failure for better UX")
          return true
        }

        return true
      } catch (e) {
        console.error("oauth-upsert failed after retries", e)
        // Allow sign in even if upsert fails (graceful degradation)
        // This prevents blocking users due to temporary backend issues
        console.warn("Allowing sign in despite upsert error for resilience")
        return true
      }
    },
    async jwt({ token, user }) {
      if (user?.email) {
        try {
          const res = await fetchWithRetry(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login-oauth`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: user.email }),
            },
            2 // 2 retries with exponential backoff
          )

          if (res.ok) {
            const data = await res.json()
            if (data?.accessToken) {
              token.accessToken = data.accessToken
            }
          } else {
            const text = await res.text()
            console.error("login-oauth failed with status:", res.status, "body:", text)
          }
        } catch (e) {
          console.error("login-oauth failed after retries", e)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken

        // Decode JWT to get user ID
        try {
          const base64Url = token.accessToken.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const payload = JSON.parse(Buffer.from(base64, 'base64').toString())

          if (session.user && payload.sub) {
            session.user.id = payload.sub
          }
        } catch (e) {
          console.error("Failed to decode JWT token", e)
        }
      } else {
        session.accessToken = undefined
      }
      return session
    },
  },
}

export const authHandler = NextAuth(authOptions)

export function auth() {
  return getServerSession(authOptions)
}
