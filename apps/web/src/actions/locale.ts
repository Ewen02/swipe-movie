'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function setUserLocale(locale: string, pathname: string) {
  const cookieStore = await cookies()

  // Set the cookie that next-intl middleware will read
  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 31536000, // 1 year
    sameSite: 'lax',
    httpOnly: false, // Allow JavaScript to read it
  })

  // Construct the new path based on locale
  const newPath = locale === 'fr'
    ? pathname // French is default, no prefix needed
    : `/${locale}${pathname}` // Other locales need prefix

  // Use server-side redirect to ensure cookie is set before navigation
  redirect(newPath)
}
