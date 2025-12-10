"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "@swipe-movie/ui"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LanguageSelector } from "@/components/language-selector"
import { User, LogOut, Film, CreditCard } from "lucide-react"

export function Header() {
  const { data: session } = useSession()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const t = useTranslations()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/rooms" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Swipe Movie"
              width={220}
              height={48}
              className="h-12 w-auto"
            />
          </Link>

          {/* Right side - User menu and theme toggle */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />

            {session?.user && (
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link href="/dashboard/subscription">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav.subscription')}</span>
                </Link>
              </Button>
            )}

            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    onClick={() => setShowSignOutDialog(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </div>

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
    </header>
  )
}
