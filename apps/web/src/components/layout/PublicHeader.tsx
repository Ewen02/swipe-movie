'use client'

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LanguageSelector } from "@/components/language-selector"

interface PublicHeaderProps {
  /**
   * Type of header to display
   * - "landing": Landing page with conditional CTA (Get started or My Rooms)
   * - "back": Simple header with back button
   */
  variant?: "landing" | "back"
  /**
   * Whether the user is authenticated (only used for landing variant)
   */
  isAuthenticated?: boolean
}

export function PublicHeader({ variant = "back", isAuthenticated = false }: PublicHeaderProps) {
  const t = useTranslations()

  return (
    <motion.header
      className="relative z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-6">
        <nav className="relative">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Image
                  src="/logo.png"
                  alt="Swipe Movie"
                  width={180}
                  height={40}
                  className="h-10 w-auto"
                />
              </motion.div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Language & Theme - hidden on mobile for cleaner look */}
              <div className="hidden sm:flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LanguageSelector />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThemeToggle />
                </motion.div>
              </div>

              {/* CTA Button */}
              {variant === "landing" ? (
                <Link href={isAuthenticated ? "/rooms" : "/login"}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="default"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">
                        {isAuthenticated ? t('landing.hero.ctaAuth') : t('landing.hero.cta')}
                      </span>
                      <span className="sm:hidden">
                        {isAuthenticated ? "Rooms" : "Démarrer"}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="default"
                      className="border-white/20 hover:bg-white/5 hover:border-white/30"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('common.back')}
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
