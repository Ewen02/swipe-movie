"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Github } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Contactez-nous
        </h1>

        <p className="text-xl text-muted-foreground mb-12">
          Une question, une suggestion ou un problème ? Nous sommes là pour vous aider !
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Email</h2>
              <p className="text-muted-foreground mb-4">
                Pour toute question générale ou support
              </p>
              <a
                href="mailto:contact@swipe-movie.com"
                className="text-primary hover:underline font-medium"
              >
                contact@swipe-movie.com
              </a>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">GitHub</h2>
              <p className="text-muted-foreground mb-4">
                Signalez un bug ou proposez une amélioration
              </p>
              <a
                href="https://github.com/Ewen02/swipe-movie/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Ouvrir une issue
              </a>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Questions fréquentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Swipe Movie est-il vraiment gratuit ?
                </h3>
                <p className="text-muted-foreground">
                  Oui, 100% gratuit et sans publicité. Pas de frais cachés, pas d'abonnement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Comment inviter mes amis dans une room ?
                </h3>
                <p className="text-muted-foreground">
                  Après avoir créé une room, vous recevez un code unique. Partagez ce code avec vos amis,
                  ils pourront rejoindre la room depuis la page d'accueil en cliquant sur "Rejoindre une room".
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Faut-il être connecté en même temps pour swiper ?
                </h3>
                <p className="text-muted-foreground">
                  Non ! Chaque membre peut swiper à son rythme. Dès que tous les membres ont liké le même film,
                  vous recevez une notification de match.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  D'où viennent les informations sur les films ?
                </h3>
                <p className="text-muted-foreground">
                  Nous utilisons The Movie Database (TMDb), une base de données collaborative avec des millions
                  de films et séries. Les informations sont régulièrement mises à jour.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Mes données personnelles sont-elles sécurisées ?
                </h3>
                <p className="text-muted-foreground">
                  Absolument. Nous ne collectons que les informations strictement nécessaires (nom et email via Google OAuth).
                  Consultez notre <Link href="/privacy" className="text-primary hover:underline">politique de confidentialité</Link> pour plus de détails.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-muted-foreground mb-6">
              N'hésitez pas à nous contacter par email, nous vous répondrons dans les plus brefs délais.
            </p>
            <a href="mailto:contact@swipe-movie.com">
              <Button size="lg" className="text-lg px-12 py-6">
                <Mail className="mr-2 h-5 w-5" />
                Nous contacter
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
