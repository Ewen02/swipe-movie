"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { Download, X, Share, Plus } from "lucide-react"
import { usePWAInstall } from "@/hooks/usePWAInstall"

export function PWAInstallBanner() {
  const { isInstallable, isIOS, install, dismiss, shouldShow, isInstalled } = usePWAInstall()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Delay showing the banner for better UX
    const timer = setTimeout(() => {
      setVisible(shouldShow)
    }, 3000)

    return () => clearTimeout(timer)
  }, [shouldShow])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setVisible(false)
    }
  }

  const handleDismiss = () => {
    dismiss()
    setVisible(false)
  }

  if (isInstalled || !visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-4 shadow-2xl">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-foreground/20 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-foreground/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg">
                  Installer Swipe Movie
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  {isIOS
                    ? "Ajoutez l'app à votre écran d'accueil pour une meilleure expérience"
                    : "Installez l'app pour un accès rapide et des notifications"}
                </p>

                {isIOS ? (
                  <div className="mt-3 flex items-center gap-2 text-white/80 text-xs">
                    <span>Appuyez sur</span>
                    <Share className="w-4 h-4" />
                    <span>puis</span>
                    <Plus className="w-4 h-4" />
                    <span>"Sur l'écran d'accueil"</span>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={handleInstall}
                      size="sm"
                      className="bg-white text-pink-600 hover:bg-white/90"
                      disabled={!isInstallable}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Installer
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-foreground/20"
                    >
                      Plus tard
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
