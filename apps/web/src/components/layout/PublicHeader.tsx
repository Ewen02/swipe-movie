import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

interface PublicHeaderProps {
  /**
   * Type of header to display
   * - "landing": Landing page with conditional CTA (Commencer or Mes Rooms)
   * - "back": Simple header with back button
   */
  variant?: "landing" | "back"
  /**
   * Whether the user is authenticated (only used for landing variant)
   */
  isAuthenticated?: boolean
}

export function PublicHeader({ variant = "back", isAuthenticated = false }: PublicHeaderProps) {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Swipe Movie"
            width={220}
            height={48}
            className="h-12 w-auto"
          />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {variant === "landing" ? (
            <Link href={isAuthenticated ? "/rooms" : "/login"}>
              <Button size="lg">
                {isAuthenticated ? "Mes Rooms" : "Commencer"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
