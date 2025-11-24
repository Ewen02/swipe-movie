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
} from '@/components/ui/select'
import { Globe } from 'lucide-react'
import { useTransition } from 'react'
import { setUserLocale } from '@/actions/locale'

export function LanguageSelector() {
  const locale = useLocale()
  const [, startTransition] = useTransition()
  const pathname = useNextPathname()

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return

    // Remove locale prefix from pathname to get the base path
    const basePath = pathname.replace(/^\/(fr|en)/, '') || '/'

    // Use transition for smooth navigation
    startTransition(async () => {
      await setUserLocale(newLocale, basePath)
    })
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
