import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { ScrollReveal } from "@/components/animations/ScrollAnimations"

interface TestimonialItem {
  name: string
  role: string
  content: string
  avatar: string
  delay: number
}

interface TestimonialsSectionProps {
  badge: string
  title: string
  titleHighlight: string
  subtitle: string
  testimonials: TestimonialItem[]
}

export function TestimonialsSection({
  badge,
  title,
  titleHighlight,
  subtitle,
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full text-yellow-500 text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 fill-yellow-500" />
              {badge}
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">{title}</span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{titleHighlight}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={testimonial.delay}>
                <motion.div
                  className="relative group h-full"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                  <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden h-full">
                    <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
                    <div className="p-8">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-primary/20 mb-3" />
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        &quot;{testimonial.content}&quot;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl border border-border">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
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
