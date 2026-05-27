'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface TrialBannerProps {
  remaining: number
  locale: string
}

export function TrialBanner({ remaining, locale }: TrialBannerProps) {
  const t = useTranslations('trial')

  return (
    <div className="pointer-events-auto absolute left-1/2 top-4 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-1.5 text-xs text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">
            Mode essai&nbsp;&middot;&nbsp;
            <AnimatePresence mode="wait">
              <motion.span
                key={remaining}
                initial={{ scale: 1.3, color: 'hsl(var(--primary))' }}
                animate={{ scale: 1, color: 'rgba(255,255,255,0.7)' }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="inline-block"
              >
                {remaining}
              </motion.span>
            </AnimatePresence>
            {' '}swipes
          </span>
        </div>
        <div className="h-3 w-px bg-white/20" />
        <Link
          href={`/${locale}/login?callbackUrl=/${locale}/rooms`}
          className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          {t('bannerCta')}
        </Link>
      </div>
    </div>
  )
}
