'use client'

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Heart, Film, Github, Twitter, Cookie } from "lucide-react"

export function Footer() {
  const t = useTranslations()

  const footerLinks = [
    { href: "/about", label: t('nav.about') },
    { href: "/contact", label: t('nav.contact') },
    { href: "/privacy", label: t('nav.privacy') },
    { href: "/terms", label: t('nav.terms') },
  ]

  return (
    <footer className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />

      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="relative bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
            {/* Top gradient bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-12 items-center">
                {/* Logo & tagline */}
                <motion.div
                  className="text-center md:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href="/" className="inline-block mb-4">
                    <Image
                      src="/logo.png"
                      alt="Swipe Movie"
                      width={180}
                      height={40}
                      className="h-10 w-auto"
                    />
                  </Link>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                    <span>Fait avec</span>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>pour les cinéphiles</span>
                  </p>
                </motion.div>

                {/* Navigation links */}
                <motion.div
                  className="flex flex-wrap justify-center gap-x-6 gap-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {footerLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>{link.label}</span>
                      <motion.span
                        className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"
                        initial={false}
                      />
                    </Link>
                  ))}
                  {/* Cookie consent link */}
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-consent"))}
                    className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <Cookie className="w-3.5 h-3.5" />
                    <span>{t('nav.cookies')}</span>
                    <motion.span
                      className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"
                      initial={false}
                    />
                  </button>
                </motion.div>

                {/* Social & copyright */}
                <motion.div
                  className="text-center md:text-right"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* Social icons */}
                  <div className="flex items-center justify-center md:justify-end gap-3 mb-4">
                    <motion.a
                      href="#"
                      className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 hover:border-border transition-colors"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Twitter className="w-4 h-4" />
                    </motion.a>
                    <motion.a
                      href="#"
                      className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 hover:border-border transition-colors"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-4 h-4" />
                    </motion.a>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    © 2025 Swipe Movie. {t('footer.rights')}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom decorative element */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Film className="w-4 h-4 text-primary" />
            <span>Trouvez le film parfait, ensemble</span>
            <Film className="w-4 h-4 text-accent" />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient orbs */}
      <div className="absolute bottom-0 left-1/4 w-64 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-32 bg-accent/10 rounded-full blur-3xl" />
    </footer>
  )
}
