"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Sparkles, Users } from "lucide-react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { Footer } from "@/components/layout/Footer"
import { fadeInUp, fadeInScale, staggerContainer, slideInLeft, slideInRight } from "@/lib/animations"

function LoginPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  // Get callbackUrl from query params, default to /rooms
  const callbackUrl = searchParams.get("callbackUrl") || "/rooms"

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
        <div className="text-center">
          <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (status === "authenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          {/* Hero Header */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20 mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeInScale}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
            <div className="relative p-8 md:p-12 text-center">
              <motion.div
                className="inline-flex p-4 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <Film className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Bienvenue sur Swipe Movie
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Décidez enfin quel film regarder en groupe, sans débat sans fin !
              </motion.p>
            </div>
          </motion.div>

          {/* Login Card & Features */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Features */}
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={slideInLeft}>
                <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-md group">
                  <CardContent className="p-6">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform">
                        <Users className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Créez une room en 30 secondes</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Choisissez vos critères, invitez vos amis et swipez ensemble
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={slideInLeft}>
                <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-md group">
                  <CardContent className="p-6">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform">
                        <Film className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Des milliers de films et séries</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Catalogue complet avec filtres par genre, plateforme, année...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={slideInLeft}>
                <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-md group">
                  <CardContent className="p-6">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl group-hover:scale-110 transition-transform">
                        <Sparkles className="h-7 w-7 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Matches en temps réel</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Notification instantanée dès que vous avez un match !
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Login Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInRight}
            >
              <Card className="border-2 hover:border-primary/30 transition-colors shadow-lg">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl md:text-3xl mb-2">Connexion</CardTitle>
                  <CardDescription className="text-base">
                    Connectez-vous pour créer votre première room
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    size="lg"
                    className="w-full text-lg py-6 relative border-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                    variant="outline"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2" />
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
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
                        Continuer avec Google
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground space-y-3">
                    <p className="flex items-center justify-center gap-2 flex-wrap font-medium">
                      <span className="text-green-500">✓</span> 100% gratuit
                      <span>•</span>
                      <span className="text-green-500">✓</span> Sans carte bancaire
                    </p>
                    <p className="text-xs">
                      En vous connectant, vous acceptez nos{" "}
                      <Link href="/terms" className="text-primary hover:underline font-medium">
                        CGU
                      </Link>{" "}
                      et notre{" "}
                      <Link href="/privacy" className="text-primary hover:underline font-medium">
                        politique de confidentialité
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
        <div className="text-center">
          <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
