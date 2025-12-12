"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { Film, Users, Heart, TrendingUp, Plus, Sparkles } from "lucide-react"
import { fadeInUp, staggerContainer } from "@/lib/animations"

interface RoomStatsHeaderProps {
  totalRooms: number
  totalMatches?: number
  totalSwipesToday?: number
  onCreateRoom: () => void
  onJoinRoom: () => void
}

export function RoomStatsHeader({
  totalRooms,
  totalMatches = 0,
  totalSwipesToday = 0,
  onCreateRoom,
  onJoinRoom,
}: RoomStatsHeaderProps) {
  const t = useTranslations('rooms')

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative group mb-12"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

      <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="p-8 md:p-12">
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {t('yourRooms')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t('emptyDescription')}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
            {/* Total Rooms */}
            <div className="relative group/stat">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-2xl opacity-0 group-hover/stat:opacity-10 blur transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border border-primary/20 rounded-2xl p-4 sm:p-3 md:p-6">
                <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-3 sm:order-2 md:order-1 sm:w-full">
                    <div className="sm:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg">
                      <Film className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-xs md:text-sm text-muted-foreground mb-0.5">{t('stats.total')}</p>
                      <p className="text-3xl sm:text-2xl md:text-3xl font-bold text-primary">{totalRooms}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:order-1 md:order-2 w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary to-blue-500 items-center justify-center shadow-lg">
                    <Film className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Matches */}
            <div className="relative group/stat">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-pink-500 rounded-2xl opacity-0 group-hover/stat:opacity-10 blur transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border border-accent/20 rounded-2xl p-4 sm:p-3 md:p-6">
                <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-3 sm:order-2 md:order-1 sm:w-full">
                    <div className="sm:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-xs md:text-sm text-muted-foreground mb-0.5">{t('stats.matches')}</p>
                      <p className="text-3xl sm:text-2xl md:text-3xl font-bold text-accent">{totalMatches}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:order-1 md:order-2 w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-accent to-pink-500 items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Swipes Today */}
            <div className="relative group/stat">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-0 group-hover/stat:opacity-10 blur transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border border-green-500/20 rounded-2xl p-4 sm:p-3 md:p-6">
                <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-3 sm:order-2 md:order-1 sm:w-full">
                    <div className="sm:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-xs md:text-sm text-muted-foreground mb-0.5">{t('stats.swipesToday')}</p>
                      <p className="text-3xl sm:text-2xl md:text-3xl font-bold text-green-500">{totalSwipesToday}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:order-1 md:order-2 w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <motion.div
              className="flex-1 sm:flex-initial"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6 shadow-lg"
                onClick={onCreateRoom}
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('create')}
              </Button>
            </motion.div>
            <motion.div
              className="flex-1 sm:flex-initial"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-white/20 hover:bg-white/5 hover:border-accent text-lg py-6"
                onClick={onJoinRoom}
              >
                <Users className="w-5 h-5 mr-2" />
                {t('join')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
