"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@swipe-movie/ui"
import { ArrowLeft, Home, SearchX, Info } from "lucide-react"

export default function NotFoundPage() {
  const t = useTranslations("error")
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full">
        {/* Decorative orbs around card */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl hidden md:block" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl hidden md:block" />

        {/* Card */}
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="p-8 md:p-12 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Info className="w-4 h-4" />
              {t("404.badge")}
            </div>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
              <SearchX className="w-8 h-8 text-white" />
            </div>

            {/* Status code */}
            <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              404
            </div>

            {/* Title & description */}
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {t("404.title")}
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t("404.description")}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="default"
                size="lg"
                className="flex-1 shadow-xl shadow-primary/25"
                onClick={handleBack}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t("back")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-border hover:bg-foreground/5"
                asChild
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  {t("home")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
