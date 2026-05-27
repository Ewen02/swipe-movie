import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { ArrowRight, Sparkles, Heart, Shield, CheckCircle2 } from "lucide-react"
import { ShimmerEffect } from "@/components/animations/AnimatedGradient"
import { ScrollReveal } from "@/components/animations/ScrollAnimations"

interface FinalCTAProps {
  isAuthenticated: boolean
  badge: string
  title: string
  titleHighlight: string
  titleEnd: string
  subtitle: string
  subtitleAuth: string
  button: string
  buttonAuth: string
  trustFree: string
  trustNoCard: string
  matchFound: string
  matchSubtitle: string
  itsAMatch: string
}

export function FinalCTA({
  isAuthenticated,
  badge,
  title,
  titleHighlight,
  titleEnd,
  subtitle,
  subtitleAuth,
  button,
  buttonAuth,
  trustFree,
  trustNoCard,
  matchFound,
  matchSubtitle,
  itsAMatch,
}: FinalCTAProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="p-8 md:p-16">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="text-center md:text-left">
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Sparkles className="w-4 h-4" />
                        {badge}
                      </motion.div>

                      <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-foreground">{title}</span>
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{titleHighlight}</span>
                        <span className="text-foreground">{titleEnd}</span>
                      </h2>

                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {isAuthenticated ? subtitleAuth : subtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link href={isAuthenticated ? "/rooms" : "/try"}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <ShimmerEffect delay={3}>
                              <Button size="lg" className="text-lg px-8 py-7 shadow-xl shadow-primary/25 w-full sm:w-auto">
                                {isAuthenticated ? buttonAuth : button}
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </Button>
                            </ShimmerEffect>
                          </motion.div>
                        </Link>
                      </div>

                      {/* Trust indicators */}
                      <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                        <motion.span
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Shield className="w-4 h-4 text-green-500" />
                          {trustFree}
                        </motion.span>
                        <motion.span
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {trustNoCard}
                        </motion.span>
                      </div>
                    </div>

                    {/* Right content - Visual element */}
                    <div className="hidden md:block relative">
                      <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                      >
                        {/* Stacked cards visual */}
                        <div className="relative w-64 h-80 mx-auto">
                          {/* Background card */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl border border-border"
                            style={{ transform: "rotate(6deg) translateX(20px)" }}
                            animate={{ rotate: [6, 8, 6] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          />
                          {/* Middle card */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl border border-border"
                            style={{ transform: "rotate(-3deg) translateX(-10px)" }}
                            animate={{ rotate: [-3, -5, -3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                          />
                          {/* Front card */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-background to-muted rounded-2xl border border-border shadow-2xl flex flex-col items-center justify-center p-6"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="text-6xl mb-4">🎬</div>
                            <div className="text-center">
                              <p className="font-bold text-lg">{matchFound}</p>
                              <p className="text-sm text-muted-foreground">{matchSubtitle}</p>
                            </div>
                            <motion.div
                              className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Heart className="w-4 h-4 text-green-500 fill-green-500" />
                              <span className="text-green-500 text-sm font-medium">{itsAMatch}</span>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
