"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Sparkles, Users } from "lucide-react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { Footer } from "@/components/layout/Footer"

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
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="hidden md:block">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bienvenue sur Swipe Movie
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Décidez enfin quel film regarder en groupe, sans débat sans fin ! 🎬
            </p>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Créez une room en 30 secondes</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez vos critères, invitez vos amis et swipez ensemble
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Film className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Des milliers de films et séries</h3>
                  <p className="text-sm text-muted-foreground">
                    Catalogue complet avec filtres par genre, plateforme, année...
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Matches en temps réel</h3>
                  <p className="text-sm text-muted-foreground">
                    Notification instantanée dès que vous avez un match !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <Card className="border-2 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4">
                <Film className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Connexion</CardTitle>
              <CardDescription className="text-base">
                Connectez-vous pour créer votre première room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                size="lg"
                className="w-full text-lg py-6 relative"
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

              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">100% gratuit · Sans carte bancaire</p>
                <p>
                  En vous connectant, vous acceptez nos{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    CGU
                  </Link>{" "}
                  et notre{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    politique de confidentialité
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile branding */}
          <div className="md:hidden text-center space-y-4">
            <p className="text-muted-foreground">
              Rejoignez des milliers d'utilisateurs qui ne perdent plus de temps à choisir ! 🎉
            </p>
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
