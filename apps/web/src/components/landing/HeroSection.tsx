import { Sparkles, Heart, X, Star, CheckCircle2, Clock, Shield } from "lucide-react"
import { Reveal } from "@/components/landing/Reveal"
import { AuthAwareCTA } from "@/components/landing/AuthAwareCTA"

interface HeroSectionProps {
  badge: string
  title: string
  titleHighlight: string
  subtitle: string
  cta: string
  ctaAuth: string
  trustFree: string
  trustReady: string
  trustNoCard: string
}

export function HeroSection({
  badge,
  title,
  titleHighlight,
  subtitle,
  cta,
  ctaAuth,
  trustFree,
  trustReady,
  trustNoCard,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center -mt-20 pt-20">
      {/* Background effects - starts transparent to blend with header */}
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main hero card */}
          <Reveal className="relative">
            {/* Decorative orbs */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl hidden md:block" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl hidden md:block" />

            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
              {/* Top gradient bar */}
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

              <div className="p-8 md:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left content */}
                  <div className="text-center lg:text-left">
                    <Reveal
                      delay={0.2}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
                    >
                      <Sparkles className="w-4 h-4" />
                      {badge}
                    </Reveal>

                    <Reveal as="div" delay={0.3}>
                      <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="text-foreground">{title}</span>
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{titleHighlight}</span>
                      </h1>
                    </Reveal>

                    <Reveal as="div" delay={0.4}>
                      <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                        {subtitle}
                      </p>
                    </Reveal>

                    <Reveal
                      delay={0.5}
                      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                      <AuthAwareCTA cta={cta} ctaAuth={ctaAuth} />
                    </Reveal>

                    {/* Trust indicators */}
                    <Reveal
                      delay={0.6}
                      className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-muted-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {trustFree}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        {trustReady}
                      </span>
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        {trustNoCard}
                      </span>
                    </Reveal>
                  </div>

                  {/* Right content - Demo cards */}
                  <Reveal delay={0.4} className="hidden lg:block relative">
                    <div className="relative w-72 h-96 mx-auto">
                      {/* Background cards */}
                      <div
                        className="lp-card-wobble absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-2xl border border-border"
                        style={{ ["--lp-base-transform" as string]: "rotate(8deg) translateX(30px)", transform: "rotate(8deg) translateX(30px)" }}
                      >
                        <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/20 rounded-full">
                          <X className="w-5 h-5 text-red-500" />
                        </div>
                      </div>
                      <div
                        className="lp-card-wobble absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl border border-border"
                        style={{ ["--lp-base-transform" as string]: "rotate(-5deg) translateX(-20px)", transform: "rotate(-5deg) translateX(-20px)", animationDelay: "0.5s" }}
                      >
                        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 rounded-full">
                          <Heart className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                      {/* Front card */}
                      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted rounded-2xl border border-border shadow-2xl overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.02]">
                        <div className="h-2/3 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-8xl">🎬</span>
                        </div>
                        <div className="p-4 text-center">
                          <p className="font-bold text-lg">Inception</p>
                          <p className="text-sm text-muted-foreground">2010 • Sci-Fi • 2h28</p>
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-medium">8.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
