"use client"

import { useState } from 'react'
import { getTranslations } from 'next-intl/server'
import { PricingCard } from '@/components/pricing/PricingCard'
import { motion } from 'framer-motion'
import { Check, HelpCircle, Zap } from 'lucide-react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Footer } from '@/components/layout/Footer'
import {
  Badge,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@swipe-movie/ui"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  // Plans with both monthly and annual pricing
  const plans = [
    {
      name: 'FREE',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Parfait pour découvrir Swipe Movie',
      features: [
        { text: '2 rooms actives simultanées', included: true },
        { text: 'Jusqu\'à 5 participants par room', included: true },
        { text: '100 swipes par mois', included: true },
        { text: 'Rooms expirées après 7 jours', included: true },
        { text: 'Filtres avancés', included: false },
        { text: 'Support par email', included: false },
      ],
      cta: 'Commencer gratuitement',
      highlighted: false,
      comingSoon: false,
      popular: false,
    },
    {
      name: 'PRO',
      monthlyPrice: 9.99,
      annualPrice: 95.90, // ~20% discount (9.99 * 12 * 0.8)
      description: 'Pour les cinéphiles passionnés',
      features: [
        { text: 'Rooms illimitées', included: true },
        { text: 'Jusqu\'à 20 participants par room', included: true },
        { text: 'Swipes illimités', included: true },
        { text: 'Aucune expiration des rooms', included: true },
        { text: 'Filtres avancés (genre, note, plateforme)', included: true },
        { text: 'Support par email prioritaire', included: true },
        { text: 'Historique complet des swipes', included: true },
        { text: 'Statistiques détaillées', included: true },
      ],
      cta: 'Passer à PRO',
      highlighted: true,
      badge: 'Le plus populaire',
      comingSoon: false,
      popular: true,
    },
  ]

  const faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements prendront effet immédiatement et seront calculés au prorata.',
    },
    {
      question: 'Quelle est la différence entre le paiement mensuel et annuel ?',
      answer: 'Le paiement annuel vous permet d\'économiser environ 20% par rapport au paiement mensuel. De plus, vous bénéficiez d\'une facturation simplifiée et de la garantie de prix pour toute l\'année.',
    },
    {
      question: 'Comment fonctionne la période d\'essai ?',
      answer: 'Tous les plans payants offrent une période d\'essai gratuite de 14 jours. Aucune carte bancaire n\'est requise pour commencer. Vous pouvez annuler à tout moment pendant la période d\'essai sans frais.',
    },
    {
      question: 'Que se passe-t-il si j\'annule mon abonnement ?',
      answer: 'Si vous annulez, vous conservez l\'accès aux fonctionnalités premium jusqu\'à la fin de votre période de facturation. Vos rooms et historiques restent accessibles, mais vous repassez aux limites du plan gratuit.',
    },
    {
      question: 'Les prix incluent-ils la TVA ?',
      answer: 'Les prix affichés sont hors taxes. La TVA applicable sera ajoutée lors du paiement en fonction de votre pays de résidence.',
    },
  ]

  return (
    <>
      <PublicHeader />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
        {/* Background orbs */}
        <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Pricing simple et transparent</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Trouvez le plan parfait pour vous
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Commencez gratuitement, passez à un plan premium quand vous êtes prêt.
              Aucune carte bancaire requise pour essayer.
            </p>

            {/* Billing Period Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-full">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  billingPeriod === 'annual'
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annuel
                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                  -20%
                </Badge>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-24">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                {...plan}
                price={billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                period={billingPeriod === 'monthly' ? 'mois' : 'an'}
                billingPeriod={billingPeriod}
                index={index}
              />
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Questions fréquentes
              </h2>
              <p className="text-muted-foreground">
                Vous avez des questions ? Nous avons les réponses.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden p-6">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-white/10 last:border-0"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Vous avez d'autres questions ?
              </p>
              <a
                href="/contact"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Contactez notre équipe support →
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  )
}
