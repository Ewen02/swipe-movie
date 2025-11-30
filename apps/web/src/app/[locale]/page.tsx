"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Film, Sparkles, Heart, X, Zap, Shield, Globe } from "lucide-react"
import { useSession } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { PublicHeader } from "@/components/layout/PublicHeader"
import { Footer } from "@/components/layout/Footer"
import { DemoDialog } from "@/components/demo/DemoDialog"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { AnimatedGradientBackground, ShimmerEffect } from "@/components/animations/AnimatedGradient"
import { ScrollReveal } from "@/components/animations/ScrollAnimations"
import { FloatingElement } from "@/components/animations/FloatingElement"
import { CountUp } from "@/components/animations/TextReveal"

export default function LandingPage() {
  const { status } = useSession()
  const [showDemo, setShowDemo] = useState(false)
  const t = useTranslations('landing')
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50])

  if (status === "loading") {
    return null
  }

  const isAuthenticated = status === "authenticated"

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <PublicHeader variant="landing" isAuthenticated={isAuthenticated} />

      {/* Hero Section with Animated Background */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center">
        <AnimatedGradientBackground className="absolute inset-0" intensity="subtle" speed="slow" />

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <motion.div
            className="max-w-6xl mx-auto"
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-background/60 backdrop-blur-xl border border-white/10 mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

              {/* Floating decorative elements */}
              <FloatingElement className="absolute top-10 left-10 opacity-15" intensity="subtle" speed="slow">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent blur-xl" />
              </FloatingElement>
              <FloatingElement className="absolute bottom-10 right-10 opacity-15" intensity="subtle" speed="slow" delay={1.5}>
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary blur-xl" />
              </FloatingElement>

              <div className="relative p-8 md:p-16 text-center">
                {/* Animated Icon */}
                <FloatingElement className="inline-block mb-6" intensity="subtle" speed="medium">
                  <motion.div
                    className="inline-flex p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg shadow-primary/20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
                  >
                    <Film className="w-12 h-12 text-white" />
                  </motion.div>
                </FloatingElement>

                {/* Title with gradient animation */}
                <motion.h1
                  className="text-5xl md:text-7xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                    {t('hero.title')}
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {t('hero.subtitle')}
                </motion.p>

                {/* CTA Buttons with shimmer effect */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link href={isAuthenticated ? "/rooms" : "/login"}>
                    <ShimmerEffect delay={3}>
                      <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02]">
                        {isAuthenticated ? t('hero.ctaAuth') : t('hero.cta')}
                        <Sparkles className="ml-2 h-5 w-5" />
                      </Button>
                    </ShimmerEffect>
                  </Link>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm"
                      onClick={() => setShowDemo(true)}
                    >
                      {t('hero.demo')}
                      <Film className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Demo Cards with stagger animation */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Pass Card */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } }}
              >
                <Card className="border-2 border-red-500/20 hover:border-red-500/40 transition-all overflow-hidden group bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="relative bg-gradient-to-br from-red-500/10 to-red-500/5 p-12 flex items-center justify-center h-48 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-red-500/10"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.3, opacity: 0.8 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <X className="h-16 w-16 text-red-500 relative z-10" />
                      </motion.div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-bold text-lg mb-2">{t('demoCards.pass.title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('demoCards.pass.description')}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Discover Card */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } }}
              >
                <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all overflow-hidden group bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-12 flex items-center justify-center h-48 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.3, opacity: 0.8 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Film className="h-16 w-16 text-primary relative z-10" />
                      </motion.div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-bold text-lg mb-2">{t('demoCards.discover.title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('demoCards.discover.description')}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Match Card */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } }}
              >
                <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-all overflow-hidden group bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="relative bg-gradient-to-br from-green-500/10 to-green-500/5 p-12 flex items-center justify-center h-48 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-green-500/10"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.3, opacity: 0.8 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{
                          scale: { duration: 2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
                        }}
                      >
                        <Heart className="h-16 w-16 text-green-500 relative z-10" />
                      </motion.div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-bold text-lg mb-2">{t('demoCards.match.title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('demoCards.match.description')}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <ScrollReveal className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <CountUp end={10000} suffix="+" />
              </div>
              <p className="text-muted-foreground">Films disponibles</p>
            </ScrollReveal>
            <ScrollReveal className="text-center" delay={0.1}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <CountUp end={50} suffix="+" />
              </div>
              <p className="text-muted-foreground">Plateformes</p>
            </ScrollReveal>
            <ScrollReveal className="text-center" delay={0.2}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <CountUp end={30} suffix="s" />
              </div>
              <p className="text-muted-foreground">Pour décider</p>
            </ScrollReveal>
            <ScrollReveal className="text-center" delay={0.3}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <CountUp end={100} suffix="%" />
              </div>
              <p className="text-muted-foreground">Gratuit</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-muted-foreground">Trois étapes simples pour trouver votre film</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-green-500/50" />

            <ScrollReveal delay={0}>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 group relative bg-background">
                <CardContent className="p-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 text-3xl shadow-lg shadow-primary/20"
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  >
                    <span className="text-white font-bold">1</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">Créez une room</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Choisissez un nom, le genre de films, les plateformes de streaming et tous les filtres que vous voulez
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 group relative bg-background">
                <CardContent className="p-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg shadow-primary/20"
                    whileHover={{ scale: 1.08, rotate: -3 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">Invitez vos amis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Partagez le code de la room avec vos colocs, votre famille ou vos potes. Tout le monde peut rejoindre !
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="border-2 hover:border-green-500/50 transition-all hover:shadow-xl hover:shadow-green-500/5 group relative bg-background">
                <CardContent className="p-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-lg shadow-green-500/20"
                    whileHover={{ scale: 1.08 }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                  >
                    <Heart className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">Swipez et matchez</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Chacun swipe de son côté. Dès que tout le monde aime le même film : c'est un match !
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Pourquoi Swipe Movie ?
              </h2>
              <p className="text-lg text-muted-foreground">L'application qui simplifie vos soirées ciné</p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Users, title: "Décision démocratique", desc: "Tout le monde a son mot à dire. Plus de \"c'est toujours toi qui choisis !\"", delay: 0 },
                { icon: Zap, title: "Filtres puissants", desc: "Genre, note, année, durée, plateforme de streaming... Trouvez exactement ce que vous voulez", delay: 0.1 },
                { icon: Globe, title: "Catalogue immense", desc: "Des milliers de films et séries grâce à la base de données The Movie Database", delay: 0.2 },
                { icon: Heart, title: "Interface fun", desc: "Swipez comme sur Tinder ! C'est rapide, intuitif et addictif", delay: 0.3 },
              ].map((feature, index) => (
                <ScrollReveal key={index} delay={feature.delay} direction="left">
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 250, damping: 20 }}>
                    <Card className="border border-border/50 hover:border-primary/30 transition-all bg-background/80 backdrop-blur-sm group">
                      <CardContent className="p-8">
                        <div className="flex gap-5">
                          <motion.div
                            className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-colors"
                            whileHover={{ rotate: 5 }}
                          >
                            <feature.icon className="h-7 w-7 text-primary" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl">
              <AnimatedGradientBackground className="absolute inset-0" intensity="subtle" speed="medium" />
              <div className="relative bg-background/60 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="text-center py-16 px-8">
                  <FloatingElement className="inline-block mb-6" intensity="subtle" speed="slow">
                    <motion.div
                      className="inline-flex p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg shadow-primary/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                  </FloatingElement>

                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Prêt à arrêter de chercher ?
                  </h2>

                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {isAuthenticated
                      ? "Créez une nouvelle room et swipez avec vos amis"
                      : "Créez votre première room et découvrez à quel point c'est simple de décider en groupe"}
                  </p>

                  <Link href={isAuthenticated ? "/rooms" : "/login"}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ShimmerEffect delay={4}>
                        <Button size="lg" className="text-lg px-12 py-6 shadow-lg shadow-primary/20">
                          {isAuthenticated ? "Créer une room" : "Commencer maintenant"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </ShimmerEffect>
                    </motion.div>
                  </Link>

                  <motion.div
                    className="mt-8 flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {["Gratuit", "Sans carte bancaire", "Prêt en 30 secondes"].map((text, i) => (
                      <motion.span
                        key={i}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                      >
                        <Shield className="w-4 h-4 text-green-500" />
                        {text}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Demo Dialog */}
      <DemoDialog open={showDemo} onOpenChange={setShowDemo} />

      {/* Global Styles for gradient animation */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  )
}
