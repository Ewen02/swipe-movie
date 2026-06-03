import { Zap } from "lucide-react"
import { Reveal } from "@/components/landing/Reveal"
import { type LucideIcon } from "lucide-react"

interface FeatureItem {
  icon: LucideIcon
  title: string
  desc: string
  color: string
  delay: number
}

interface FeaturesSectionProps {
  badge: string
  title: string
  titleHighlight: string
  subtitle: string
  features: FeatureItem[]
}

export function FeaturesSection({
  badge,
  title,
  titleHighlight,
  subtitle,
  features,
}: FeaturesSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              {badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">{title}</span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{titleHighlight}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Reveal key={index} delay={feature.delay}>
                <div className="relative group transition-transform duration-300 ease-out hover:translate-x-2">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${feature.color}`} />
                    <div className="p-8">
                      <div className="flex gap-5">
                        <div className={`flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg`}>
                          <feature.icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
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
