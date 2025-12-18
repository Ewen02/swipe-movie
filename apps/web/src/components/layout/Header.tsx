"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Skeleton,
} from "@swipe-movie/ui"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LanguageSelector } from "@/components/language-selector"
import { User, LogOut, Film, CreditCard, Menu, X, Settings, Globe, Link2, Library } from "lucide-react"

export function Header() {
  const { data: session, isPending } = useSession()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const t = useTranslations()

  // Hydration safety
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/rooms"
                className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                aria-label="Go to rooms"
              >
                <Image
                  src="/logo.png"
                  alt="Swipe Movie"
                  width={180}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-3">
              <LanguageSelector />
              <ThemeToggle />

              {/* Loading state */}
              {!mounted || isPending ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative"
                      aria-label="Open user menu"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/rooms" className="cursor-pointer">
                        <Film className="mr-2 h-4 w-4" />
                        {t('nav.rooms')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/subscription" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t('nav.subscription')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/connections" className="cursor-pointer">
                        <Link2 className="mr-2 h-4 w-4" />
                        {t('nav.connections')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/library" className="cursor-pointer">
                        <Library className="mr-2 h-4 w-4" />
                        {t('nav.library')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-500/10"
                      onClick={() => setShowSignOutDialog(true)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('auth.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center gap-2">
              {/* User icon on mobile - quick access */}
              {mounted && !isPending && session?.user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Open user menu"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/rooms" className="cursor-pointer">
                        <Film className="mr-2 h-4 w-4" />
                        {t('nav.rooms')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/subscription" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t('nav.subscription')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/connections" className="cursor-pointer">
                        <Link2 className="mr-2 h-4 w-4" />
                        {t('nav.connections')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/library" className="cursor-pointer">
                        <Library className="mr-2 h-4 w-4" />
                        {t('nav.library')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-500/10"
                      onClick={() => setShowSignOutDialog(true)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('auth.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-background border-l border-border shadow-2xl sm:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="font-semibold text-lg">{t('common.menu')}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Settings Section */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                      {t('nav.settings')}
                    </p>

                    {/* Language */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-foreground/5">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{t('common.language')}</span>
                      </div>
                      <LanguageSelector />
                    </div>

                    {/* Theme */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-foreground/5">
                      <div className="flex items-center gap-3">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{t('common.theme')}</span>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>

                  {/* Navigation Section */}
                  {session?.user && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                        {t('common.navigation')}
                      </p>

                      <Link
                        href="/rooms"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-foreground/5 transition-colors"
                      >
                        <Film className="h-5 w-5 text-primary" />
                        <span>{t('nav.rooms')}</span>
                      </Link>

                      <Link
                        href="/dashboard/subscription"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-foreground/5 transition-colors"
                      >
                        <CreditCard className="h-5 w-5 text-accent" />
                        <span>{t('nav.subscription')}</span>
                      </Link>

                      <Link
                        href="/connections"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-foreground/5 transition-colors"
                      >
                        <Link2 className="h-5 w-5 text-purple-500" />
                        <span>{t('nav.connections')}</span>
                      </Link>

                      <Link
                        href="/library"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-foreground/5 transition-colors"
                      >
                        <Library className="h-5 w-5 text-emerald-500" />
                        <span>{t('nav.library')}</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Menu Footer - Sign Out */}
                {session?.user && (
                  <div className="p-4 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setShowSignOutDialog(true)
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      {t('auth.signOut')}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('auth.signOutConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('auth.signOutDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {t('auth.signOut')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
