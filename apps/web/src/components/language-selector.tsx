'use client'

import { useLocale } from 'next-intl'
import { usePathname as useNextPathname } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@swipe-movie/ui'
import { Globe } from 'lucide-react'
import { useTransition, useState, useEffect } from 'react'
import { setUserLocale } from '@/actions/locale'

export function LanguageSelector() {
  const locale = useLocale()
  const [, startTransition] = useTransition()
  const pathname = useNextPathname()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return

    // Remove locale prefix from pathname to get the base path
    const basePath = (pathname ?? '/').replace(/^\/(fr|en)/, '') || '/'

    // Use transition for smooth navigation
    startTransition(async () => {
      await setUserLocale(newLocale, basePath)
    })
  }

  // Prevent hydration mismatch - show skeleton until client-side mounted
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-[140px]" />
      </div>
    )
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[140px] gap-2" aria-label="Select language">
        <Globe className="h-4 w-4" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc as Locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
