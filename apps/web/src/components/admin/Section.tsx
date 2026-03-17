import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { fadeInUp } from "@/lib/animations"

interface SectionProps {
  title: string
  children: React.ReactNode
  loading?: boolean
  action?: React.ReactNode
}

export function Section({ title, children, loading, action }: SectionProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        children
      )}
    </motion.div>
  )
}
