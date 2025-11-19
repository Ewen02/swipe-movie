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
    // Remove current locale from pathname if it exists
    // Handle both /en/path and /path (for French)
    let pathWithoutLocale = pathname

    // If pathname starts with a locale, remove it
    if (pathname.startsWith('/en/') || pathname.startsWith('/fr/')) {
      pathWithoutLocale = pathname.substring(3) // Remove '/en' or '/fr'
    } else if (pathname === '/en' || pathname === '/fr') {
      pathWithoutLocale = '/'
    }

    // Ensure path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale
    }

    // Add new locale to pathname
    // For French (default), don't add locale prefix
    // For other locales, add the prefix
    const newPath = newLocale === 'fr'
      ? pathWithoutLocale
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
