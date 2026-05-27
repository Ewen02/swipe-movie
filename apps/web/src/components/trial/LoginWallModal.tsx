'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { signIn } from '@/lib/auth-client'
import { Sparkles, Heart } from 'lucide-react'
import { Button } from '@swipe-movie/ui'

interface LoginWallModalProps {
  show: boolean
  trigger: 'match' | 'swipe_limit' | null
  isHardBlock: boolean
  locale: string
  onDismiss: () => void
}

export function LoginWallModal({
  show,
  trigger,
  isHardBlock,
  locale,
  onDismiss,
}: LoginWallModalProps) {
  const t = useTranslations('trial.loginWall')
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

  const isMatch = trigger === 'match'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={!isHardBlock ? onDismiss : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-sm bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
          >
            {/* Header gradient */}
            <div
              className={`px-6 pt-8 pb-6 text-center ${
                isMatch
                  ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-background'
                  : 'bg-gradient-to-br from-primary/20 via-primary/10 to-background'
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                className="mb-4"
              >
                {isMatch ? (
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-green-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                )}
              </motion.div>

              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground"
              >
                {isMatch ? t('matchTitle') : t('limitTitle')}
              </motion.h2>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground mt-2 leading-relaxed"
              >
                {isMatch ? t('matchDescription') : t('limitDescription')}
              </motion.p>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 space-y-3">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
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
                      <span>Connexion...</span>
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
                      {t('cta')}
                    </>
                  )}
                </Button>
              </motion.div>

              {!isHardBlock && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={onDismiss}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
                  >
                    {t('dismiss')}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
