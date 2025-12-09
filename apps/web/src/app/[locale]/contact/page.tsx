"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { Mail, MessageSquare, Github, Sparkles, ArrowRight } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function ContactPage() {
  const t = useTranslations('contact')

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      <PublicHeader />

      <div className="fixed top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="flex-1 container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              Nous contacter
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('description')}
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="p-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg mb-4">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">{t('email.title')}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t('email.description')}
                  </p>
                  <a
                    href="mailto:contact@swipe-movie.com"
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    contact@swipe-movie.com
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="p-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg mb-4">
                    <Github className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">{t('github.title')}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t('github.description')}
                  </p>
                  <a
                    href="https://github.com/Ewen02/swipe-movie/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    {t('github.link')}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ */}
          <motion.div
            className="relative group mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary to-accent" />
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  {t('faq.title')}
                </h2>
                <div className="space-y-6">
                  {faqs.map((faq, i) => (
                    <div key={i} className="pl-4 border-l-2 border-primary/20">
                      <h3 className="font-semibold mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground text-sm">
                        {faq.a}
                        {i === 4 && (
                          <>
                            {" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                              {t('faq.privacyLink')}
                            </Link>{" "}
                            {t('faq.a5End')}
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
                <p className="text-muted-foreground mb-6">{t('cta.description')}</p>
                <a href="mailto:contact@swipe-movie.com">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="lg" className="text-lg px-12 py-6">
                      <Mail className="mr-2 h-5 w-5" />
                      {t('cta.button')}
                    </Button>
                  </motion.div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
