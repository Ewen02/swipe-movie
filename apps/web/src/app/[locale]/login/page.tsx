"use client"

import { signIn, useSession } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Film, Sparkles, Heart, X, CheckCircle2, Shield, Zap } from "lucide-react"
import { PublicHeader } from "@/components/layout/PublicHeader"

function LoginPageContent() {
  const t = useTranslations('login')
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") || "/rooms"

  useEffect(() => {
    if (session) {
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - only on mobile */}
      <div className="lg:hidden">
        <PublicHeader />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT SIDE - Login Form (40% on desktop) */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12 relative z-10">
          <div className="w-full max-w-md">
            {/* Logo - desktop only */}
            <Link href="/" className="hidden lg:block mb-12">
              <img src="/logo.png" alt="Swipe Movie" className="h-10" />
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Connexion en 1 clic
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {t('hero.title')}
              </h1>
              <p className="text-muted-foreground mb-8">
                {t('hero.subtitle')}
              </p>

              {/* Google Button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  size="lg"
                  className="w-full text-base py-6 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-3" />
                      {t('card.connecting')}
                    </>
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
                      {t('card.googleButton')}
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{t('card.free')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>{t('card.noCard')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span>Prêt en 30s</span>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-muted-foreground mt-8">
                {t('card.terms')}{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  {t('card.termsLink')}
                </Link>{" "}
                {t('card.and')}{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  {t('card.privacyLink')}
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE - Brand Visual (60% on desktop) */}
        <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-primary/10 via-accent/5 to-background relative overflow-hidden items-center justify-center p-12">
          {/* Background orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Tagline */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-foreground">Swipe. Match. Watch. </span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Together.
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Fini les débats interminables ! Swipez, matchez et regardez ensemble en quelques secondes.
              </p>

              {/* Demo Cards Visual */}
              <div className="relative w-80 h-96 mx-auto">
                {/* Background cards */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-2xl border border-white/10 backdrop-blur-sm"
                  style={{ transform: "rotate(8deg) translateX(30px)" }}
                  animate={{
                    rotate: [8, 10, 8],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500/20 rounded-full">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl border border-white/10 backdrop-blur-sm"
                  style={{ transform: "rotate(-5deg) translateX(-20px)" }}
                  animate={{
                    rotate: [-5, -7, -5],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500/20 rounded-full">
                    <Heart className="w-5 h-5 text-green-500" />
                  </div>
                </motion.div>

                {/* Front card */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="h-2/3 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-8xl">🎬</span>
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-bold text-lg">Inception</p>
                    <p className="text-sm text-muted-foreground">2010 • Sci-Fi • 2h28</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">8.8</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground mt-1">Films</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">50+</div>
                  <div className="text-sm text-muted-foreground mt-1">Plateformes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500">30s</div>
                  <div className="text-sm text-muted-foreground mt-1">Pour décider</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  const t = useTranslations('login')
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
