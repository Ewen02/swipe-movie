"use client"

import { Button } from "@swipe-movie/ui"
import { Users, Compass, FileText, Sparkles, Check } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface StepCompleteProps {
  onCreateRoom: () => void
  onDiscover: () => void
  onImport: () => void
}

export function StepComplete({
  onCreateRoom,
  onDiscover,
  onImport,
}: StepCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
          <Check className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold mb-3">
          Vous etes pret !
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Vos preferences ont ete enregistrees. Que souhaitez-vous faire maintenant ?
        </p>
      </motion.div>

      <motion.div
        className="grid gap-4 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <button
            onClick={onCreateRoom}
            className="w-full p-5 rounded-xl border-2 border-primary bg-primary/10 hover:bg-primary/20 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  Creer une room
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Invitez vos amis et trouvez un film ensemble
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <button
            onClick={onDiscover}
            className="w-full p-5 rounded-xl border-2 border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                  Decouvrir seul
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Explorez des films personnalises pour vous
                </p>
              </div>
            </div>
          </button>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <button
            onClick={onImport}
            className="w-full p-5 rounded-xl border-2 border-border hover:border-muted-foreground/50 hover:bg-muted/5 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Importer mon historique
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connectez Trakt, AniList ou importez une liste
                </p>
              </div>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
