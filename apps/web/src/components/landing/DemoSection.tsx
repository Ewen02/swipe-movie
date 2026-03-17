import { motion } from "framer-motion"
import { Heart, X, Sparkles, Play } from "lucide-react"
import { ScrollReveal } from "@/components/animations/ScrollAnimations"
import { InteractiveSwipeDemo } from "@/components/demo/InteractiveSwipeDemo"
import { type LucideIcon } from "lucide-react"

interface DemoInstruction {
  icon: LucideIcon
  text: string
  color: string
}

interface DemoSectionProps {
  badge: string
  title: string
  titleHighlight: string
  subtitle: string
  instructions: DemoInstruction[]
}

export function DemoSection({
  badge,
  title,
  titleHighlight,
  subtitle,
  instructions,
}: DemoSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Decorative orbs */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl hidden md:block" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl hidden md:block" />

            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-green-500 to-accent" />

              <div className="p-8 md:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Text content */}
                  <ScrollReveal direction="left">
                    <div className="text-center lg:text-left">
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-green-500 text-sm font-medium mb-6"
                      >
                        <Play className="w-4 h-4" />
                        {badge}
                      </motion.div>

                      <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-foreground">{title}</span>
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{titleHighlight}</span>
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {subtitle}
                      </p>

                      <div className="space-y-4">
                        {instructions.map((item, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center gap-3 justify-center lg:justify-start"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                          >
                            <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-muted-foreground">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Interactive demo */}
                  <ScrollReveal direction="right" delay={0.2}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-green-500/20 rounded-3xl blur-2xl" />
                      <div className="relative bg-background/50 backdrop-blur-sm rounded-3xl p-4 border border-border">
                        <InteractiveSwipeDemo />
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
