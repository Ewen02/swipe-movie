"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Conditions Générales d'Utilisation
        </h1>

        <p className="text-muted-foreground mb-8">
          Dernière mise à jour : 14 novembre 2025
        </p>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                1. Acceptation des conditions
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                En utilisant Swipe Movie, vous acceptez d'être lié par ces Conditions Générales d'Utilisation (CGU).
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications prendront effet
                immédiatement après leur publication sur cette page. Votre utilisation continue du service après
                la publication de modifications constitue votre acceptation de ces modifications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">2. Description du service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Swipe Movie est une application web gratuite qui permet aux utilisateurs de :
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                <li>Créer des "rooms" pour choisir des films en groupe</li>
                <li>Inviter d'autres utilisateurs à rejoindre leurs rooms</li>
                <li>Swiper sur des films pour exprimer leurs préférences</li>
                <li>Découvrir des "matches" lorsque tous les membres d'une room aiment le même film</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Le service utilise les données de The Movie Database (TMDb) pour fournir des informations sur les films.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                3. Utilisation autorisée
              </h2>
              <p className="text-muted-foreground mb-4">Vous êtes autorisé à :</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Utiliser Swipe Movie pour votre usage personnel et non commercial</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Créer un compte avec vos informations Google</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Créer et rejoindre des rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Swiper sur des films et voir vos matches</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Partager les codes de vos rooms avec vos amis</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-destructive" />
                4. Utilisation interdite
              </h2>
              <p className="text-muted-foreground mb-4">Il est strictement interdit de :</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Utiliser le service à des fins commerciales sans autorisation écrite</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Créer de faux comptes ou usurper l'identité d'autrui</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Tenter de pirater, compromettre ou perturber le service</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Utiliser des bots, scripts ou outils automatisés</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Extraire ou scraper des données du service</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Publier du contenu illégal, offensant ou inapproprié</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Utiliser le service pour envoyer du spam ou du contenu non sollicité</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">5. Comptes utilisateurs</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Pour utiliser Swipe Movie, vous devez créer un compte en vous connectant avec Google OAuth.
                  Vous êtes responsable de :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Maintenir la sécurité de votre compte Google</li>
                  <li>Toutes les activités effectuées depuis votre compte</li>
                  <li>Nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
                </ul>
                <p className="mt-4">
                  Nous nous réservons le droit de suspendre ou de supprimer votre compte si nous
                  soupçonnons une violation de ces CGU.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">6. Propriété intellectuelle</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Swipe Movie et tous ses contenus (logo, design, code, etc.) sont protégés par les lois
                  sur la propriété intellectuelle.
                </p>
                <p>
                  Les informations sur les films (affiches, synopsis, notes, etc.) sont fournies par
                  The Movie Database (TMDb) et sont soumises à leurs propres conditions d'utilisation.
                </p>
                <p>
                  Vous conservez tous les droits sur les données que vous créez dans l'application
                  (vos rooms, vos swipes, etc.).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                7. Limitation de responsabilité
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Swipe Movie est fourni "tel quel" sans garantie d'aucune sorte. Nous ne garantissons pas que :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Le service sera toujours disponible ou sans interruption</li>
                  <li>Les informations sur les films sont exactes ou à jour</li>
                  <li>Le service sera exempt d'erreurs ou de bugs</li>
                </ul>
                <p className="mt-4">
                  En aucun cas, Swipe Movie ne sera responsable de dommages directs, indirects, accessoires
                  ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">8. Résiliation</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Vous pouvez cesser d'utiliser le service et supprimer votre compte à tout moment en nous
                  contactant à <a href="mailto:contact@swipe-movie.com" className="text-primary hover:underline">contact@swipe-movie.com</a>.
                </p>
                <p>
                  Nous nous réservons le droit de suspendre ou de résilier votre accès au service à tout moment,
                  sans préavis, si nous estimons que vous avez violé ces CGU.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">9. Loi applicable</h2>
              <p className="text-muted-foreground">
                Ces CGU sont régies par le droit français. Tout litige relatif à l'interprétation ou à
                l'exécution de ces CGU sera soumis aux tribunaux français compétents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant ces Conditions Générales d'Utilisation, contactez-nous à{" "}
                <a href="mailto:legal@swipe-movie.com" className="text-primary hover:underline">
                  legal@swipe-movie.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">11. Intégralité de l'accord</h2>
              <p className="text-muted-foreground">
                Ces CGU, ainsi que notre <Link href="/privacy" className="text-primary hover:underline">Politique de confidentialité</Link>,
                constituent l'intégralité de l'accord entre vous et Swipe Movie concernant l'utilisation du service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
