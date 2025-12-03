'use client'

import { motion } from 'framer-motion'
import { CheckCircle, PartyPopper, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
  return (
    <>
      <PublicHeader />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden flex items-center justify-center">
        {/* Background orbs */}
        <div className="fixed top-20 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-8"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            {/* Party icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <PartyPopper className="w-6 h-6 text-primary" />
              <span className="text-primary font-medium">Bienvenue dans PRO !</span>
              <PartyPopper className="w-6 h-6 text-primary transform scale-x-[-1]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Paiement réussi !
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground mb-8"
            >
              Merci pour votre abonnement PRO. Vous avez maintenant accès à toutes les
              fonctionnalités premium de Swipe Movie.
            </motion.p>

            {/* Features unlocked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
            >
              <h2 className="font-semibold mb-4">Fonctionnalités débloquées</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Rooms illimitées
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Swipes illimités
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Filtres avancés
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Support prioritaire
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/rooms">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                >
                  Commencer à swiper
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  )
}
