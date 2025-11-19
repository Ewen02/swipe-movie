import createMiddleware from 'next-intl/middleware'
import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n'

const isDevelopment = process.env.NODE_ENV === 'development'

// Create i18n middleware with locale detection enabled
// This will automatically read the NEXT_LOCALE cookie set by our server action
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't show /fr in URL for default locale
  localeDetection: true, // Enable automatic locale detection from cookie
})

// Public paths that don't require authentication
const publicPaths = ['/', '/login', '/about', '/contact', '/privacy', '/terms', '/preview']

function isPublicPath(pathname: string): boolean {
  // Remove locale prefix if present
  const pathWithoutLocale = pathname.replace(/^\/(fr|en)/, '') || '/'
  return publicPaths.some(path => pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/'))
}

// Combine auth and i18n middleware
export default withAuth(
  function middleware(req) {
    if (isDevelopment) {
      console.log('[middleware] request', req.nextUrl.pathname)
      // Log cookie for debugging
      const locale = req.cookies.get('NEXT_LOCALE')
      console.log('[middleware] NEXT_LOCALE cookie:', locale?.value || 'not set')
    }

    // Apply i18n middleware for all requests
    return intlMiddleware(req as unknown as NextRequest)
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Allow access to public paths
        if (isPublicPath(pathname)) {
          return true
        }

        // Require auth for all other paths
        const isAuthorized = Boolean(token?.email)

        if (isDevelopment) {
          console.log('[middleware] authorized', {
            path: pathname,
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
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
