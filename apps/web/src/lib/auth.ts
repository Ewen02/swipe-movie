import NextAuth from "next-auth"
import { getServerSession, type NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, name: user.name ?? undefined }),
        })

        if (!response.ok) {
          const text = await response.text()
          console.error("oauth-upsert failed with status:", response.status, "body:", text)
          // Bloquer l'authentification si l'upsert échoue
          return false
        }

        return true
      } catch (e) {
        console.error("oauth-upsert failed", e)
        // Bloquer l'authentification si l'upsert échoue
        return false
      }
    },
    async jwt({ token, user }) {
      if (user?.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login-oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          })

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
          console.error("login-oauth failed", e)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken
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
