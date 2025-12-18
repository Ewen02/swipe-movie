"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowLeft, Tv, BookOpen, Link2 } from "lucide-react"
import { Button } from "@swipe-movie/ui"
import { ConnectionCard } from "@/components/connections/ConnectionCard"
import { TextImport } from "@/components/import/TextImport"
import { useConnections } from "@/hooks/useConnections"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { ConnectionsPageSkeleton } from "./ConnectionsPageSkeleton"

export default function ConnectionsPage() {
  const t = useTranslations("connections")
  const { trakt, anilist, isLoading } = useConnections()

  if (isLoading && !trakt.status && !anilist.status) {
    return <ConnectionsPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background orbs */}
      <BackgroundOrbs />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <Link href="/rooms">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2 hover:bg-foreground/5">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToRooms")}
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{t("title")}</h1>
            </div>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </motion.div>

          {/* Connection Cards */}
          <motion.div className="space-y-4" variants={fadeInUp}>
            <ConnectionCard
              provider="trakt"
              status={trakt.status}
              isLoading={trakt.isLoading}
              icon={<Tv className="h-5 w-5 text-primary" />}
            />
            <ConnectionCard
              provider="anilist"
              status={anilist.status}
              isLoading={anilist.isLoading}
              icon={<BookOpen className="h-5 w-5 text-primary" />}
            />
          </motion.div>

          {/* Text Import Section */}
          <motion.div className="mt-6" variants={fadeInUp}>
            <TextImport />
          </motion.div>

          {/* Info Section */}
          <motion.div
            className="mt-8 rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-6"
            variants={fadeInUp}
          >
            <h3 className="font-semibold mb-3 text-foreground">Comment ca fonctionne ?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">1.</span>
                Connectez vos comptes de suivi de films/series
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">2.</span>
                Synchronisez votre bibliotheque
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">3.</span>
                Les films deja vus seront automatiquement exclus du swipe
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">4.</span>
                Les films dans vos watchlists communes seront prioritaires
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
