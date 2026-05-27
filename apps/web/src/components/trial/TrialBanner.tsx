'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'

interface TrialBannerProps {
  remaining: number
  locale: string
}

export function TrialBanner({ remaining, locale }: TrialBannerProps) {
  const t = useTranslations('trial')

  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 px-4 py-2.5">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">{t('banner', { remaining })}</span>
        </div>
        <Link
          href={`/${locale}/login?callbackUrl=/${locale}/rooms`}
          className="text-xs font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          {t('bannerCta')}
        </Link>
      </div>
    </div>
  )
}
