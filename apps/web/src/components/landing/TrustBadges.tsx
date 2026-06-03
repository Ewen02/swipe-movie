import { Reveal } from "@/components/landing/Reveal"
import { type LucideIcon } from "lucide-react"

interface BadgeItem {
  icon: LucideIcon
  text: string
  subtext: string
  color: string
}

interface TrustBadgesProps {
  badges: BadgeItem[]
}

export function TrustBadges({ badges }: TrustBadgesProps) {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((badge, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <div className="relative group transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${badge.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${badge.color}`} />
                    <div className="p-6 text-center">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${badge.color} mb-4 shadow-lg`}>
                        <badge.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="font-bold text-lg mb-1">{badge.text}</p>
                      <p className="text-sm text-muted-foreground">{badge.subtext}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
