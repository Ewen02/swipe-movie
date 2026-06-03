'use client'

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@swipe-movie/ui"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LanguageSelector } from "@/components/language-selector"
import { useSession } from "@/lib/auth-client"

interface PublicHeaderProps {
  /**
   * Type of header to display
   * - "landing": Landing page with conditional CTA (Get started or My Rooms)
   * - "back": Simple header with back button
   */
  variant?: "landing" | "back"
  /**
   * Override the resolved auth state (only used for landing variant). When
   * omitted, the header reads the client session itself so the page hosting it
   * can stay a Server Component.
   */
  isAuthenticated?: boolean
}

export function PublicHeader({ variant = "back", isAuthenticated }: PublicHeaderProps) {
  const t = useTranslations()
  const { data: session } = useSession()
  const authed = isAuthenticated ?? !!session

  return (
    <header className="lp-reveal relative z-50">
      <div className="container mx-auto px-4 py-6">
        <nav className="relative">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
                <Image
                  src="/logo.png"
                  alt="Swipe Movie"
                  width={180}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Language & Theme - hidden on mobile for cleaner look */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
                  <LanguageSelector />
                </div>
                <div className="transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
                  <ThemeToggle />
                </div>
              </div>

              {/* CTA Button */}
              {variant === "landing" ? (
                <Link href={authed ? "/rooms" : "/login"}>
                  <div className="transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
                    <Button
                      size="default"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">
                        {authed ? t('landing.hero.ctaAuth') : t('landing.hero.cta')}
                      </span>
                      <span className="sm:hidden">
                        {authed ? "Rooms" : "Démarrer"}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Link>
              ) : (
                <Link href="/">
                  <div className="transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
                    <Button
                      variant="outline"
                      size="default"
                      className="border-border hover:bg-foreground/5 hover:border-white/30"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('common.back')}
                    </Button>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
