import { Sparkles, Heart, Shield, CheckCircle2 } from "lucide-react"
import { Reveal } from "@/components/landing/Reveal"
import { AuthAwareFinalCTA } from "@/components/landing/AuthAwareCTA"

interface FinalCTAProps {
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
          <Reveal>
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
                      <Reveal
                        delay={0.1}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
                      >
                        <Sparkles className="w-4 h-4" />
                        {badge}
                      </Reveal>

                      <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-foreground">{title}</span>
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{titleHighlight}</span>
                        <span className="text-foreground">{titleEnd}</span>
                      </h2>

                      <AuthAwareFinalCTA
                        subtitle={subtitle}
                        subtitleAuth={subtitleAuth}
                        button={button}
                        buttonAuth={buttonAuth}
                      />

                      {/* Trust indicators */}
                      <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                        <Reveal as="span" delay={0.3} className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          {trustFree}
                        </Reveal>
                        <Reveal as="span" delay={0.4} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {trustNoCard}
                        </Reveal>
                      </div>
                    </div>

                    {/* Right content - Visual element */}
                    <div className="hidden md:block relative">
                      <Reveal delay={0.2} className="relative">
                        {/* Stacked cards visual */}
                        <div className="relative w-64 h-80 mx-auto">
                          {/* Background card */}
                          <div
                            className="lp-card-wobble absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl border border-border"
                            style={{ ["--lp-base-transform" as string]: "rotate(6deg) translateX(20px)", transform: "rotate(6deg) translateX(20px)" }}
                          />
                          {/* Middle card */}
                          <div
                            className="lp-card-wobble absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl border border-border"
                            style={{ ["--lp-base-transform" as string]: "rotate(-3deg) translateX(-10px)", transform: "rotate(-3deg) translateX(-10px)", animationDelay: "0.5s" }}
                          />
                          {/* Front card */}
                          <div className="absolute inset-0 bg-gradient-to-br from-background to-muted rounded-2xl border border-border shadow-2xl flex flex-col items-center justify-center p-6 transition-transform duration-300 ease-out hover:scale-[1.02]">
                            <div className="text-6xl mb-4">🎬</div>
                            <div className="text-center">
                              <p className="font-bold text-lg">{matchFound}</p>
                              <p className="text-sm text-muted-foreground">{matchSubtitle}</p>
                            </div>
                            <div className="lp-pulse mt-4 flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
                              <Heart className="w-4 h-4 text-green-500 fill-green-500" />
                              <span className="text-green-500 text-sm font-medium">{itsAMatch}</span>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
