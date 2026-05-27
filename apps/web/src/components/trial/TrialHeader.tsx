"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@swipe-movie/ui"
import { Badge } from "@swipe-movie/ui"
import { Sparkles } from "lucide-react"

interface TrialHeaderProps {
  locale: string
  roomCode: string
}

export function TrialHeader({ locale, roomCode }: TrialHeaderProps) {
  const callbackUrl = `/${locale}/rooms/${roomCode}`

  return (
    <header className="sticky top-0 z-50 w-full h-14 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Swipe Movie"
            width={140}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Badge center */}
        <Badge className="bg-primary/10 text-primary border-primary/30 gap-1.5 hidden sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Mode essai
        </Badge>

        {/* Sign up CTA */}
        <Link href={`/${locale}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
          <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-white shadow-md hover:opacity-90">
            S&apos;inscrire
          </Button>
        </Link>
      </div>
    </header>
  )
}
