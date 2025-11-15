"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, Trash2, Database } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Politique de confidentialité
        </h1>

        <p className="text-muted-foreground mb-8">
          Dernière mise à jour : 14 novembre 2025
        </p>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Notre engagement
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Chez Swipe Movie, nous prenons votre vie privée au sérieux. Cette politique de confidentialité
                explique quelles données nous collectons, pourquoi nous les collectons, et comment nous les utilisons.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Notre principe fondamental :</strong> nous ne collectons que les données strictement nécessaires
                au fonctionnement de l'application, et nous ne les vendons jamais à des tiers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" />
                Données collectées
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. Informations de compte</h3>
                  <p className="text-muted-foreground">
                    Lorsque vous vous connectez avec Google OAuth, nous collectons :
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                    <li>Votre nom</li>
                    <li>Votre adresse email</li>
                    <li>Votre photo de profil Google (si disponible)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">2. Données d'utilisation</h3>
                  <p className="text-muted-foreground">
                    Pour faire fonctionner l'application, nous stockons :
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                    <li>Les rooms que vous créez ou rejoignez</li>
                    <li>Vos swipes (like/dislike sur les films)</li>
                    <li>Les matches détectés dans vos rooms</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">3. Données techniques</h3>
                  <p className="text-muted-foreground">
                    Pour améliorer l'expérience utilisateur, nous collectons via Vercel Analytics :
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                    <li>Pages visitées (de manière anonymisée)</li>
                    <li>Temps passé sur l'application</li>
                    <li>Pays d'origine (pour les statistiques générales)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-primary" />
                Comment nous utilisons vos données
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Fournir le service :</strong> vos données de compte permettent de vous identifier,
                    vos swipes permettent de trouver des matches avec les autres membres de vos rooms.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Améliorer l'application :</strong> les données d'usage nous aident à comprendre
                    quelles fonctionnalités sont utilisées et lesquelles doivent être améliorées.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Communication :</strong> nous pouvons vous envoyer des notifications par email
                    concernant votre compte (matches, invitations à des rooms, etc.).
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                Sécurité des données
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Nous mettons en place des mesures de sécurité techniques et organisationnelles
                  pour protéger vos données :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Connexion sécurisée via HTTPS</li>
                  <li>Authentification via Google OAuth 2.0</li>
                  <li>Base de données hébergée sur des serveurs sécurisés (Neon PostgreSQL)</li>
                  <li>Sessions chiffrées et tokens d'authentification sécurisés</li>
                  <li>Aucun stockage de mots de passe (délégué à Google)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-primary" />
                Vos droits (RGPD)
              </h2>
              <p className="text-muted-foreground mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Droit d'accès :</strong> vous pouvez demander une copie de toutes vos données personnelles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Droit de rectification :</strong> vous pouvez modifier vos informations de compte
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Droit à l'effacement :</strong> vous pouvez demander la suppression complète de votre compte et de vos données
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Droit à la portabilité :</strong> vous pouvez récupérer vos données dans un format exploitable
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Pour exercer ces droits, contactez-nous à{" "}
                <a href="mailto:privacy@swipe-movie.com" className="text-primary hover:underline">
                  privacy@swipe-movie.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Partage de données avec des tiers</h2>
              <p className="text-muted-foreground mb-4">
                Nous ne vendons jamais vos données personnelles. Nous partageons certaines données uniquement avec :
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                <li>
                  <strong>Google :</strong> pour l'authentification OAuth
                </li>
                <li>
                  <strong>Vercel :</strong> hébergement de l'application et analytics anonymisés
                </li>
                <li>
                  <strong>Railway :</strong> hébergement du backend API
                </li>
                <li>
                  <strong>Neon :</strong> hébergement de la base de données PostgreSQL
                </li>
                <li>
                  <strong>The Movie Database (TMDb) :</strong> pour récupérer les informations sur les films
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Cookies</h2>
              <p className="text-muted-foreground">
                Nous utilisons des cookies strictement nécessaires au fonctionnement de l'application :
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4 mt-3">
                <li>Cookie de session pour l'authentification (obligatoire)</li>
                <li>Cookie de préférence de thème (dark/light mode)</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Modifications de cette politique</h2>
              <p className="text-muted-foreground">
                Nous pouvons mettre à jour cette politique de confidentialité de temps en temps.
                La date de dernière mise à jour est indiquée en haut de cette page.
                En cas de changements importants, nous vous en informerons par email.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles,
                contactez-nous à{" "}
                <a href="mailto:privacy@swipe-movie.com" className="text-primary hover:underline">
                  privacy@swipe-movie.com
                </a>
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
