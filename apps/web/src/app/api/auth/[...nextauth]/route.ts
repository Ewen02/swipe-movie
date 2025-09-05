import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface JWT {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // 1) À la 1ère connexion, on s'assure que l'utilisateur existe côté API Nest
    async signIn({ user }) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, name: user.name ?? undefined }),
        });
      } catch (e) {
        console.error("oauth-upsert failed", e);
        return false;
      }
      return true;
    },

    // 2) On échange l'email contre un accessToken JWT émis par l'API Nest
    async jwt({ token, user }) {
      // seulement au 1er passage (quand 'user' est défini)
      if (user?.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login-oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.accessToken) token.accessToken = data.accessToken;
          }
        } catch (e) {
          console.error("login-oauth failed", e);
        }
      }
      return token;
    },

    // 3) On expose accessToken dans la session (utile pour fetch côté serveur)
    async session({ session, token }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      } else {
        session.accessToken = undefined;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };