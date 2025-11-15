"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Film, Sparkles } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          À propos de Swipe Movie
        </h1>

        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Notre mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Swipe Movie est né d'un constat simple : choisir un film à regarder en groupe est souvent une source de débat sans fin.
                Combien de fois avez-vous passé 30 minutes à chercher un film, pour finalement abandonner et regarder la même série pour la énième fois ?
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Notre mission est de rendre cette décision <strong>rapide, démocratique et fun</strong>.
                Grâce à notre système de swipe inspiré des apps de rencontre, chaque membre du groupe peut exprimer ses préférences,
                et notre algorithme trouve automatiquement le film qui plaira à tout le monde.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Comment ça marche
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. Créez une room</h3>
                  <p className="text-muted-foreground">
                    Configurez vos préférences : genre de film, plateforme de streaming, note minimale, durée...
                    Les filtres s'appliquent pour tous les membres de la room.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">2. Invitez vos amis</h3>
                  <p className="text-muted-foreground">
                    Partagez le code de la room avec vos amis, votre famille ou vos collègues.
                    Pas besoin que tout le monde soit connecté en même temps !
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">3. Swipez</h3>
                  <p className="text-muted-foreground">
                    Chacun swipe de son côté. À droite si le film vous intéresse, à gauche sinon.
                    Dès que tous les membres ont liké le même film : c'est un match ! 🎉
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Film className="w-6 h-6 text-primary" />
                Catalogue de films
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous utilisons la base de données <strong>The Movie Database (TMDb)</strong>, qui contient des millions de films et séries.
                Les informations sont mises à jour régulièrement pour vous proposer les dernières sorties et les grands classiques.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Gratuit et sans publicité
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Swipe Movie est 100% gratuit et ne contient aucune publicité.
                Pas de carte bancaire requise, pas d'abonnement caché. Notre objectif est de vous faire gagner du temps, pas de l'argent.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à simplifier vos soirées film ?
              </h2>
              <Link href="/login">
                <Button size="lg" className="text-lg px-12 py-6">
                  Commencer gratuitement
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
