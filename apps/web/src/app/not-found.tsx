import Link from "next/link"
import { Film, Home, Sparkles } from "lucide-react"

export default function RootNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 max-w-lg w-full">
        {/* Decorative orbs around card */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl hidden md:block" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl hidden md:block" />

        {/* Card */}
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="p-8 md:p-12 text-center">
            {/* Movie icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Film className="w-8 h-8 text-white" />
            </div>

            {/* Status code */}
            <div className="text-7xl md:text-9xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 leading-none">
              404
            </div>

            {/* Title & description */}
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Page introuvable
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              La page que vous recherchez n&apos;existe pas ou a
              &#233;t&#233; d&#233;plac&#233;e.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-primary/25 hover:opacity-90 transition"
              >
                <Home className="w-5 h-5" />
                Retour &#224; l&apos;accueil
              </Link>
              <Link
                href="/try"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/5 transition"
              >
                <Sparkles className="w-5 h-5" />
                Essayer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
