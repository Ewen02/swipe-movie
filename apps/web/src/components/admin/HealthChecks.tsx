import { motion } from "framer-motion"
import { Server, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { fadeInUp } from "@/lib/animations"
import type { HealthCheckData } from "@/lib/api/admin"

interface HealthChecksProps {
  health: HealthCheckData | undefined
  isLoading: boolean
}

export function HealthChecks({ health, isLoading }: HealthChecksProps) {
  return (
    <motion.div variants={fadeInUp} className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-sm">
        <Server className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Services:</span>
      </div>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : health ? (
        <>
          {Object.entries(health.services).map(([name, status]) => (
            <div
              key={name}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                status === "ok"
                  ? "bg-green-500/15 text-green-400"
                  : status === "not_configured"
                    ? "bg-muted/30 text-muted-foreground"
                    : "bg-red-500/15 text-red-400"
              }`}
            >
              {status === "ok" ? (
                <CheckCircle className="w-3 h-3" />
              ) : status === "not_configured" ? (
                <Clock className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              {name}
            </div>
          ))}
          <span className="text-xs text-muted-foreground ml-auto">
            Uptime: {Math.floor((health.uptime || 0) / 3600)}h{" "}
            {Math.floor(((health.uptime || 0) % 3600) / 60)}m
          </span>
        </>
      ) : null}
    </motion.div>
  )
}
