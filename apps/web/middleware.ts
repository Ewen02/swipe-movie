import { withAuth } from "next-auth/middleware"

const isDevelopment = process.env.NODE_ENV === "development"

export default withAuth(
  function middleware(req) {
    if (isDevelopment) {
      console.log("[middleware] request", req.nextUrl.pathname)
    }
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthorized = Boolean(token?.email)

        if (isDevelopment) {
          console.log("[middleware] authorized", {
            path: req.nextUrl.pathname,
            hasToken: Boolean(token),
            email: token?.email,
            isAuthorized,
          })
        }

        return isAuthorized
      },
    },
  }
)

export const config = {
  matcher: [
    // Protéger toutes les routes sauf /, login, api, assets statiques, preview et pages légales
    "/((?!$|login|api|_next/static|_next/image|favicon.ico|preview|about|contact|privacy|terms|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)",
  ],
}
