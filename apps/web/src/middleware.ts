import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
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

export default async function middleware(req: NextRequest) {
  if (isDevelopment) {
    console.log('[middleware] request', req.nextUrl.pathname)
    const locale = req.cookies.get('NEXT_LOCALE')
    console.log('[middleware] NEXT_LOCALE cookie:', locale?.value || 'not set')
  }

  const pathname = req.nextUrl.pathname

  // Check if user is authenticated
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = Boolean(token?.email)

  // Check if path is public
  const isPublic = isPublicPath(pathname)

  if (isDevelopment) {
    console.log('[middleware] auth check', {
      path: pathname,
      isPublic,
      isAuthenticated,
    })
  }

  // If not authenticated and trying to access protected path
  if (!isAuthenticated && !isPublic) {
    // Get the locale from the path or use default
    const locale = pathname.match(/^\/(fr|en)/)?.[1] || defaultLocale
    const loginUrl = new URL(`/${locale === defaultLocale ? '' : locale + '/'}login`, req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Apply i18n middleware for all requests
  return intlMiddleware(req)
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
