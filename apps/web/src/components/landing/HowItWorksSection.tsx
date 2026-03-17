import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import { ScrollReveal } from "@/components/animations/ScrollAnimations"
import { type LucideIcon } from "lucide-react"

interface StepItem {
  step: string
  icon: LucideIcon
  title: string
  desc: string
  color: string
  delay: number
}

interface HowItWorksSectionProps {
  badge: string
  title: string
  titleHighlight: string
  subtitle: string
  stepLabel: string
  steps: StepItem[]
}

export function HowItWorksSection({
  badge,
  title,
  titleHighlight,
  subtitle,
  stepLabel,
  steps,
}: HowItWorksSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4" />
              {badge}
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">{title}</span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{titleHighlight}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <ScrollReveal key={index} delay={item.delay}>
                <motion.div
                  className="relative group"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Decorative orb */}
                  <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${item.color} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />

                  <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden h-full">
                    <div className={`h-1 bg-gradient-to-r ${item.color}`} />
                    <div className="p-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mb-6 shadow-lg`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white`}>
                          {stepLabel} {item.step}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
