"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Film, Sparkles, Heart, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { PublicHeader } from "@/components/layout/PublicHeader"
import { Footer } from "@/components/layout/Footer"
import { DemoDialog } from "@/components/demo/DemoDialog"
import { fadeInUp, fadeInScale, staggerContainer, slideInLeft, slideInRight } from "@/lib/animations"

export default function LandingPage() {
  const { data: session, status } = useSession()
  const [showDemo, setShowDemo] = useState(false)
  const t = useTranslations('landing')

  if (status === "loading") {
    return null // or a loading spinner
  }

  const isAuthenticated = status === "authenticated"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader variant="landing" isAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Header with Gradient */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20 mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeInScale}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
            <div className="relative p-8 md:p-16 text-center">
              <motion.div
                className="inline-flex p-4 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <Film className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {t('hero.title')}
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {t('hero.subtitle')}
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link href={isAuthenticated ? "/rooms" : "/login"}>
                  <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                    {isAuthenticated ? t('hero.ctaAuth') : t('hero.cta')}
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 hover:border-primary/50 transition-colors"
                  onClick={() => setShowDemo(true)}
                >
                  {t('hero.demo')}
                  <Film className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Visual Demo Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="border-2 border-red-500/30 hover:border-red-500/50 transition-colors overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-red-500/20 to-red-500/10 p-12 flex items-center justify-center h-48 group-hover:scale-105 transition-transform">
                    <X className="h-16 w-16 text-red-500" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">{t('demoCards.pass.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('demoCards.pass.description')}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-2 border-primary/30 hover:border-primary/50 transition-colors overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-12 flex items-center justify-center h-48 group-hover:scale-105 transition-transform">
                    <Film className="h-16 w-16 text-primary" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">{t('demoCards.discover.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('demoCards.discover.description')}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-colors overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-green-500/20 to-green-500/10 p-12 flex items-center justify-center h-48 group-hover:scale-105 transition-transform">
                    <Heart className="h-16 w-16 text-green-500" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">{t('demoCards.match.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('demoCards.match.description')}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-muted-foreground">Trois étapes simples pour trouver votre film</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 text-3xl group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Créez une room</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Choisissez un nom, le genre de films, les plateformes de streaming et tous les filtres que vous voulez
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 text-3xl group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Invitez vos amis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Partagez le code de la room avec vos colocs, votre famille ou vos potes. Tout le monde peut rejoindre !
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Swipez et matchez</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Chacun swipe de son côté. Dès que tout le monde aime le même film : c'est un match !
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pourquoi Swipe Movie ?
            </h2>
            <p className="text-lg text-muted-foreground">L'application qui simplifie vos soirées ciné</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                      <Users className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Décision démocratique</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Tout le monde a son mot à dire. Plus de "c'est toujours toi qui choisis !"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                      <Sparkles className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Filtres puissants</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Genre, note, année, durée, plateforme de streaming... Trouvez exactement ce que vous voulez
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                      <Film className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Catalogue immense</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Des milliers de films et séries grâce à la base de données The Movie Database
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Interface fun</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Swipez comme sur Tinder ! C'est rapide, intuitif et addictif
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
            <div className="relative text-center py-16 px-8">
              <motion.div
                className="inline-flex p-4 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Prêt à arrêter de chercher ?
              </motion.h2>
              <motion.p
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {isAuthenticated ? "Créez une nouvelle room et swipez avec vos amis" : "Créez votre première room et découvrez à quel point c'est simple de décider en groupe"}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link href={isAuthenticated ? "/rooms" : "/login"}>
                  <Button size="lg" className="text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-shadow">
                    {isAuthenticated ? "Créer une room" : "Commencer maintenant"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.p
                className="mt-6 text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="inline-flex items-center gap-1">
                  ✓ Gratuit
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  ✓ Sans carte bancaire
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  ✓ Prêt en 30 secondes
                </span>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Demo Dialog */}
      <DemoDialog open={showDemo} onOpenChange={setShowDemo} />
    </div>
  )
}
