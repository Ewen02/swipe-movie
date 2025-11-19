'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'

export function LanguageSelector() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

    // Add new locale to pathname
    const newPath = newLocale === 'fr'
      ? pathWithoutLocale // Don't show /fr in URL for default locale
      : `/${newLocale}${pathWithoutLocale}`

    router.push(newPath)
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[140px] gap-2">
        <Globe className="h-4 w-4" />
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
