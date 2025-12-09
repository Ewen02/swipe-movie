"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { ArrowRight, Users, Film, Sparkles, Heart, X, Zap, Shield, Globe, Star, Quote, CheckCircle2, Clock, Smartphone, Play } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { useTranslations } from 'next-intl'
import { PublicHeader } from "@/components/layout/PublicHeader"
import { Footer } from "@/components/layout/Footer"
import { ShimmerEffect } from "@/components/animations/AnimatedGradient"
import { ScrollReveal } from "@/components/animations/ScrollAnimations"
import { CountUp } from "@/components/animations/TextReveal"
import { InteractiveSwipeDemo } from "@/components/demo/InteractiveSwipeDemo"

export default function LandingPage() {
  const { data: session, isPending } = useSession()
  const t = useTranslations('landing')

  if (isPending) {
    return null
  }

  const isAuthenticated = !!session

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <PublicHeader variant="landing" isAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center -mt-20 pt-20">
        {/* Background effects - starts transparent to blend with header */}
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main hero card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Decorative orbs */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl hidden md:block" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl hidden md:block" />

              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                {/* Top gradient bar */}
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="p-8 md:p-16">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="text-center lg:text-left">
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Gratuit & sans inscription pour rejoindre
                      </motion.div>

                      <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="text-foreground">Swipe, Match, Watch </span>
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Together.</span>
                      </motion.h1>

                      <motion.p
                        className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Fini les débats interminables ! Swipez, matchez et regardez ensemble en quelques secondes.
                      </motion.p>

                      <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link href={isAuthenticated ? "/rooms" : "/login"}>
                          <ShimmerEffect delay={3}>
                            <Button size="lg" className="text-lg px-8 py-7 shadow-xl shadow-primary/25 w-full sm:w-auto">
                              {isAuthenticated ? t('hero.ctaAuth') : "Créer ma room gratuite"}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </ShimmerEffect>
                        </Link>
                      </motion.div>

                      {/* Trust indicators */}
                      <motion.div
                        className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {[
                          { icon: CheckCircle2, text: "100% gratuit" },
                          { icon: Clock, text: "Prêt en 30 secondes" },
                          { icon: Shield, text: "Sans carte bancaire" },
                        ].map((item, i) => (
                          <span key={i} className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-green-500" />
                            {item.text}
                          </span>
                        ))}
                      </motion.div>
                    </div>

                    {/* Right content - Demo cards */}
                    <motion.div
                      className="hidden lg:block relative"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    >
                      <div className="relative w-72 h-96 mx-auto">
                        {/* Background cards */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-2xl border border-white/10"
                          style={{ transform: "rotate(8deg) translateX(30px)" }}
                          animate={{ rotate: [8, 10, 8] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/20 rounded-full">
                            <X className="w-5 h-5 text-red-500" />
                          </div>
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl border border-white/10"
                          style={{ transform: "rotate(-5deg) translateX(-20px)" }}
                          animate={{ rotate: [-5, -7, -5] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                          <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 rounded-full">
                            <Heart className="w-5 h-5 text-green-500" />
                          </div>
                        </motion.div>
                        {/* Front card */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-background to-muted rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="h-2/3 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="text-8xl">🎬</span>
                          </div>
                          <div className="p-4 text-center">
                            <p className="font-bold text-lg">Inception</p>
                            <p className="text-sm text-muted-foreground">2010 • Sci-Fi • 2h28</p>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-sm font-medium">8.8</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - seamless transition from hero */}
      <section className="py-20 relative overflow-hidden -mt-10">
        {/* Gradient that blends with hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { value: 10000, suffix: "+", label: "Films disponibles", color: "text-green-500" },
                    { value: 50, suffix: "+", label: "Plateformes", color: "text-blue-500" },
                    { value: 30, suffix: "s", label: "Pour décider", color: "text-purple-500" },
                    { value: 100, suffix: "%", label: "Gratuit", color: "text-orange-500" },
                  ].map((stat, index) => (
                    <ScrollReveal key={index} delay={index * 0.1}>
                      <div className="text-center">
                        <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                          <CountUp end={stat.value} suffix={stat.suffix} />
                        </div>
                        <p className="text-muted-foreground">{stat.label}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" />
                Simple comme bonjour
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-foreground">Comment ça </span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">marche ?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Trois étapes simples pour trouver votre film parfait</p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  icon: Film,
                  title: "Créez une room",
                  desc: "Choisissez vos filtres : genre, plateforme, note minimum...",
                  color: "from-primary to-accent",
                  delay: 0
                },
                {
                  step: "2",
                  icon: Users,
                  title: "Invitez vos amis",
                  desc: "Partagez le code. Pas besoin de compte pour rejoindre !",
                  color: "from-blue-500 to-cyan-500",
                  delay: 0.15
                },
                {
                  step: "3",
                  icon: Heart,
                  title: "Swipez & matchez",
                  desc: "Quand tout le monde like le même film : c'est un match !",
                  color: "from-green-500 to-emerald-500",
                  delay: 0.3
                },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={item.delay}>
                  <motion.div
                    className="relative group"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Decorative orb */}
                    <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${item.color} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />

                    <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full">
                      <div className={`h-1 bg-gradient-to-r ${item.color}`} />
                      <div className="p-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mb-6 shadow-lg`}>
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white`}>
                            Étape {item.step}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Decorative orbs */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl hidden md:block" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl hidden md:block" />

              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-green-500 to-accent" />

                <div className="p-8 md:p-16">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text content */}
                    <ScrollReveal direction="left">
                      <div className="text-center lg:text-left">
                        <motion.div
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-green-500 text-sm font-medium mb-6"
                        >
                          <Play className="w-4 h-4" />
                          Démo interactive
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                          <span className="text-foreground">Testez </span>
                          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">l'expérience</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                          Glissez les cartes pour découvrir comment fonctionne le swipe. C'est exactement comme dans l'app !
                        </p>

                        <div className="space-y-4">
                          {[
                            { icon: Heart, text: "Droite = J'adore", color: "text-green-500 bg-green-500/10" },
                            { icon: X, text: "Gauche = Pas pour moi", color: "text-red-500 bg-red-500/10" },
                            { icon: Sparkles, text: "Match = Tout le monde a liké !", color: "text-primary bg-primary/10" },
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              className="flex items-center gap-3 justify-center lg:justify-start"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                            >
                              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                                <item.icon className="w-5 h-5" />
                              </div>
                              <span className="text-muted-foreground">{item.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>

                    {/* Interactive demo */}
                    <ScrollReveal direction="right" delay={0.2}>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-green-500/20 rounded-3xl blur-2xl" />
                        <div className="relative bg-background/50 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
                          <InteractiveSwipeDemo />
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" />
                Fonctionnalités
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-foreground">Pourquoi </span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Swipe Movie ?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">L'application qui transforme le chaos en consensus</p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Users, title: "Fini les disputes", desc: "\"C'est toujours toi qui choisis !\" Plus jamais. Tout le monde vote, personne n'est frustré.", color: "from-blue-500 to-cyan-500", delay: 0 },
                { icon: Zap, title: "2 minutes chrono", desc: "Plus besoin de scroller 30 minutes. Filtrez, swipez, trouvez LE film parfait.", color: "from-yellow-500 to-orange-500", delay: 0.1 },
                { icon: Globe, title: "Toutes vos plateformes", desc: "Netflix, Disney+, Prime, Canal+... On ne montre que ce que VOUS pouvez regarder.", color: "from-purple-500 to-pink-500", delay: 0.2 },
                { icon: Heart, title: "Addictif (mais utile)", desc: "L'interface swipe rend le choix fun. Vos amis vont adorer participer !", color: "from-red-500 to-pink-500", delay: 0.3 },
              ].map((feature, index) => (
                <ScrollReveal key={index} delay={feature.delay}>
                  <motion.div
                    className="relative group"
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                    <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${feature.color}`} />
                      <div className="p-8">
                        <div className="flex gap-5">
                          <div className={`flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg`}>
                            <feature.icon className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full text-yellow-500 text-sm font-medium mb-6"
              >
                <Star className="w-4 h-4 fill-yellow-500" />
                Témoignages
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-foreground">Ils </span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">adorent</span>
              </h2>
              <p className="text-lg text-muted-foreground">Rejoignez des milliers d'utilisateurs satisfaits</p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Marie L.",
                  role: "Colocation de 4",
                  content: "Fini les débats interminables ! On trouve un film en 2 minutes maintenant. C'est devenu notre rituel du vendredi soir.",
                  avatar: "👩‍🦰",
                  delay: 0,
                },
                {
                  name: "Thomas D.",
                  role: "Père de famille",
                  content: "Parfait pour les soirées en famille. Les enfants adorent swiper et on finit toujours par trouver un film qui plaît à tout le monde.",
                  avatar: "👨",
                  delay: 0.1,
                },
                {
                  name: "Sophie M.",
                  role: "Cinéphile",
                  content: "J'ai découvert plein de films que je n'aurais jamais regardés ! Les filtres sont super précis et le catalogue est énorme.",
                  avatar: "👩",
                  delay: 0.2,
                },
              ].map((testimonial, index) => (
                <ScrollReveal key={index} delay={testimonial.delay}>
                  <motion.div
                    className="relative group h-full"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                    <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full">
                      <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
                      <div className="p-8">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                        <Quote className="w-8 h-8 text-primary/20 mb-3" />
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl border border-white/10">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, text: "100% Gratuit", subtext: "Sans frais cachés", color: "from-green-500 to-emerald-500" },
                { icon: Clock, text: "Prêt en 30s", subtext: "Setup ultra-rapide", color: "from-blue-500 to-cyan-500" },
                { icon: Smartphone, text: "Mobile-first", subtext: "Optimisé tactile", color: "from-purple-500 to-pink-500" },
                { icon: Users, text: "Google Sign-in", subtext: "Connexion 1-clic", color: "from-orange-500 to-red-500" },
              ].map((badge, index) => (
                <ScrollReveal key={index} delay={index * 0.08}>
                  <motion.div
                    className="relative group"
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r ${badge.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                    <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${badge.color}`} />
                      <div className="p-6 text-center">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${badge.color} mb-4 shadow-lg`}>
                          <badge.icon className="w-7 h-7 text-white" />
                        </div>
                        <p className="font-bold text-lg mb-1">{badge.text}</p>
                        <p className="text-sm text-muted-foreground">{badge.subtext}</p>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

                <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                  <div className="p-8 md:p-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      {/* Left content */}
                      <div className="text-center md:text-left">
                        <motion.div
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Sparkles className="w-4 h-4" />
                          Prêt en 30 secondes
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                          <span className="text-foreground">Votre prochaine </span>
                          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">soirée ciné</span>
                          <span className="text-foreground"> commence ici</span>
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                          {isAuthenticated
                            ? "Créez une nouvelle room et invitez vos amis à voter pour le film parfait."
                            : "Rejoignez des milliers d'utilisateurs qui ont dit adieu aux débats interminables."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                          <Link href={isAuthenticated ? "/rooms" : "/login"}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ShimmerEffect delay={3}>
                                <Button size="lg" className="text-lg px-8 py-7 shadow-xl shadow-primary/25 w-full sm:w-auto">
                                  {isAuthenticated ? "Créer une room" : "Commencer gratuitement"}
                                  <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                              </ShimmerEffect>
                            </motion.div>
                          </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                          {[
                            { icon: Shield, text: "100% gratuit" },
                            { icon: CheckCircle2, text: "Sans carte bancaire" },
                          ].map((item, i) => (
                            <motion.span
                              key={i}
                              className="flex items-center gap-2"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                            >
                              <item.icon className="w-4 h-4 text-green-500" />
                              {item.text}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Right content - Visual element */}
                      <div className="hidden md:block relative">
                        <motion.div
                          className="relative"
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        >
                          {/* Stacked cards visual */}
                          <div className="relative w-64 h-80 mx-auto">
                            {/* Background card */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl border border-white/10"
                              style={{ transform: "rotate(6deg) translateX(20px)" }}
                              animate={{ rotate: [6, 8, 6] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                            {/* Middle card */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl border border-white/10"
                              style={{ transform: "rotate(-3deg) translateX(-10px)" }}
                              animate={{ rotate: [-3, -5, -3] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            />
                            {/* Front card */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-background to-muted rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center justify-center p-6"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="text-6xl mb-4">🎬</div>
                              <div className="text-center">
                                <p className="font-bold text-lg">Match trouvé !</p>
                                <p className="text-sm text-muted-foreground">Tout le monde a liké</p>
                              </div>
                              <motion.div
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Heart className="w-4 h-4 text-green-500 fill-green-500" />
                                <span className="text-green-500 text-sm font-medium">C'est un match !</span>
                              </motion.div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
