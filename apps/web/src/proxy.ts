import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import { locales, defaultLocale } from './i18n';

const isDevelopment = process.env.NODE_ENV === 'development';

// Create i18n proxy with automatic locale detection
// Detects locale from:
// 1. NEXT_LOCALE cookie (user preference)
// 2. Accept-Language header (browser language)
// 3. defaultLocale as fallback
const intlProxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't show /fr in URL for default locale
  localeDetection: true, // Auto-detect from cookie and Accept-Language header
});

// Routes that require authentication. Anything outside this list is treated as
// public and rendered server-side for crawlers (SEO landing/programmatic pages).
// Keep this list in sync with the (protected) route group under app/[locale].
const protectedPrefixes = [
  '/discover',
  '/library',
  '/settings',
  '/admin',
  '/rooms',
  '/onboarding',
  '/dashboard',
  '/connections',
  '/auth',
];

const localePrefixPattern = new RegExp(`^/(${locales.join('|')})(?=/|$)`);

function isPublicPath(pathname: string): boolean {
  // Remove locale prefix if present
  const pathWithoutLocale = pathname.replace(localePrefixPattern, '') || '/';
  return !protectedPrefixes.some(
    (prefix) => pathWithoutLocale === prefix || pathWithoutLocale.startsWith(prefix + '/'),
  );
}

export default async function proxy(req: NextRequest) {
  if (isDevelopment) {
    console.log('[proxy] request', req.nextUrl.pathname);
    const locale = req.cookies.get('NEXT_LOCALE');
    console.log('[proxy] NEXT_LOCALE cookie:', locale?.value || 'not set');
  }

  const pathname = req.nextUrl.pathname;

  // Check if user is authenticated using Better Auth session cookie
  const sessionCookie = getSessionCookie(req, {
    cookiePrefix: 'swipe-movie',
  });
  const isAuthenticated = Boolean(sessionCookie);

  // Check if path is public
  const isPublic = isPublicPath(pathname);

  if (isDevelopment) {
    console.log('[proxy] auth check', {
      path: pathname,
      isPublic,
      isAuthenticated,
    });
  }

  // If not authenticated and trying to access protected path
  if (!isAuthenticated && !isPublic) {
    // Get the locale from the path or use default
    const locale = pathname.match(localePrefixPattern)?.[1] || defaultLocale;
    const loginUrl = new URL(`/${locale === defaultLocale ? '' : locale + '/'}login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Apply i18n proxy for all requests
  return intlProxy(req);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
