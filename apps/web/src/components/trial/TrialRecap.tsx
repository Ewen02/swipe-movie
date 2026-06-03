'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth-client'
import { clearTrialData } from '@/lib/trial'
import { Button } from '@swipe-movie/ui'
import type { MovieBasic } from '@/schemas/movies'

interface TrialRecapProps {
  likedMovies: MovieBasic[]
  locale: string
  swipeCount: number
  onSignUp: () => void
  onRetry: () => void
}

export function TrialRecap({ likedMovies, locale, swipeCount, onSignUp, onRetry }: TrialRecapProps) {
  const t = useTranslations('trial.recap')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const callbackUrl = `/${locale}/try?migrate=true`

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: callbackUrl,
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    clearTrialData()
    router.push(`/${locale}/try`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Celebration heading */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl mb-4"
          >
            🎬🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('swipedCount', { count: swipeCount })}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Liked movies grid */}
        {likedMovies.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full mb-8"
          >
            <p className="text-sm text-muted-foreground text-center mb-3">
              {t('likedMovies', { count: likedMovies.length })}
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
              {likedMovies.slice(0, 12).map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.4 + index * 0.06,
                    type: 'spring',
                    damping: 15,
                    stiffness: 200,
                  }}
                  className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md border border-border/50"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
              ))}
            </div>
            {likedMovies.length > 12 && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t('moreCount', { count: likedMovies.length - 12 })}
              </p>
            )}
          </motion.div>
        )}

        {/* CTA buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm space-y-3"
        >
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            size="lg"
            className="w-full text-base py-6 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                <span>{t('connecting')}</span>
              </div>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t('createAccount')}
              </>
            )}
          </Button>

          <button
            onClick={handleRetry}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-3 transition-colors"
          >
            {t('retry')}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
