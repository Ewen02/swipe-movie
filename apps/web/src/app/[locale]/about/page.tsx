"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Users, Film, Sparkles, ArrowRight } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      <PublicHeader />

      {/* Background orbs */}
      <div className="fixed top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="flex-1 container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              À propos
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
          </motion.div>

          {/* Content Cards */}
          <div className="space-y-6">
            {/* Mission */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">{t('mission.title')}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('mission.p1')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('mission.p2')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* How it Works */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">{t('howItWorks.title')}</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="pl-4 border-l-2 border-primary/30">
                      <h3 className="font-semibold text-lg mb-2">{t('howItWorks.step1Title')}</h3>
                      <p className="text-muted-foreground">{t('howItWorks.step1Desc')}</p>
                    </div>
                    <div className="pl-4 border-l-2 border-primary/30">
                      <h3 className="font-semibold text-lg mb-2">{t('howItWorks.step2Title')}</h3>
                      <p className="text-muted-foreground">{t('howItWorks.step2Desc')}</p>
                    </div>
                    <div className="pl-4 border-l-2 border-primary/30">
                      <h3 className="font-semibold text-lg mb-2">{t('howItWorks.step3Title')}</h3>
                      <p className="text-muted-foreground">{t('howItWorks.step3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Catalog */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <Film className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">{t('catalog.title')}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('catalog.description')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Free */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">{t('free.title')}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('free.description')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="p-12 text-center">
                  <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
                  <Link href="/login">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button size="lg" className="text-lg px-12 py-6">
                        {t('cta.button')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
