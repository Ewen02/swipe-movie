import { ScrollReveal } from "@/components/animations/ScrollAnimations"
import { CountUp } from "@/components/animations/TextReveal"

interface StatItem {
  value: number
  suffix: string
  label: string
  color: string
}

interface StatsSectionProps {
  stats: StatItem[]
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="py-20 relative overflow-hidden -mt-10">
      {/* Gradient that blends with hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="text-center">
                      <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                        <CountUp end={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-muted-foreground">{stat.label}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
