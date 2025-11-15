"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Film, Sparkles, Heart, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { Footer } from "@/components/layout/Footer"

export default function LandingPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return null // or a loading spinner
  }

  const isAuthenticated = status === "authenticated"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader variant="landing" isAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            Décidez en groupe quel film regarder 🎬
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Fini les débats sans fin ! Swipez, matchez et regardez ensemble en quelques secondes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={isAuthenticated ? "/rooms" : "/login"}>
              <Button size="lg" className="text-lg px-8 py-6">
                {isAuthenticated ? "Accéder à mes rooms" : "Commencer gratuitement"}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Voir la démo
              <Film className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Visual Demo */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
            <div className="relative bg-card border-2 border-border rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                {/* Card animations demo */}
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-xl border border-red-500/30">
                  <X className="h-12 w-12 text-red-500" />
                </div>
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/30">
                  <Film className="h-12 w-12 text-primary" />
                </div>
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl border border-green-500/30">
                  <Heart className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Swipez à droite pour aimer, à gauche pour passer</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Comment ça marche ? 🤔
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 text-3xl">
                1️⃣
              </div>
              <h3 className="text-2xl font-bold mb-2">Créez une room</h3>
              <p className="text-muted-foreground">
                Choisissez un nom, le genre de films, les plateformes de streaming et tous les filtres que vous voulez
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 text-3xl">
                2️⃣
              </div>
              <h3 className="text-2xl font-bold mb-2">Invitez vos amis</h3>
              <p className="text-muted-foreground">
                Partagez le code de la room avec vos colocs, votre famille ou vos potes. Tout le monde peut rejoindre !
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 text-3xl">
                3️⃣
              </div>
              <h3 className="text-2xl font-bold mb-2">Swipez et matchez</h3>
              <p className="text-muted-foreground">
                Chacun swipe de son côté. Dès que tout le monde aime le même film : c'est un match ! 🎉
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Pourquoi Swipe Movie ? ✨
        </h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Décision démocratique</h3>
              <p className="text-muted-foreground">
                Tout le monde a son mot à dire. Plus de "c'est toujours toi qui choisis !"
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Filtres puissants</h3>
              <p className="text-muted-foreground">
                Genre, note, année, durée, plateforme de streaming... Trouvez exactement ce que vous voulez
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Catalogue immense</h3>
              <p className="text-muted-foreground">
                Des milliers de films et séries grâce à la base de données The Movie Database
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Interface fun</h3>
              <p className="text-muted-foreground">
                Swipez comme sur Tinder ! C'est rapide, intuitif et addictif
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="text-center py-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à arrêter de chercher ? 🍿
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {isAuthenticated ? "Créez une nouvelle room et swipez avec vos amis" : "Créez votre première room et découvrez à quel point c'est simple de décider en groupe"}
            </p>
            <Link href={isAuthenticated ? "/rooms" : "/login"}>
              <Button size="lg" className="text-lg px-12 py-6">
                {isAuthenticated ? "Créer une room" : "Commencer maintenant"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Gratuit · Sans carte bancaire · Prêt en 30 secondes
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
