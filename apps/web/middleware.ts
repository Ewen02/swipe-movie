import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log("[middleware] request", req.nextUrl.pathname)
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthorized = Boolean(token?.email)
        console.log("[middleware] authorized", {
          path: req.nextUrl.pathname,
          hasToken: Boolean(token),
          email: token?.email,
          isAuthorized,
        })
        return isAuthorized
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!login|api|_next/static|_next/image|favicon.ico).*)",
  ],
}
