import { CreditCard } from "lucide-react"
import { Section } from "./Section"
import type { SubscriptionStats as SubscriptionStatsType } from "@/lib/api/admin"

interface SubscriptionStatsProps {
  subscriptions: SubscriptionStatsType | undefined
  isLoading: boolean
}

const PLAN_STYLES: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  starter: "bg-blue-500/20 text-blue-400",
  pro: "bg-primary/20 text-primary",
}

const DEFAULT_PLAN_STYLE = "bg-purple-500/20 text-purple-400"

export function SubscriptionStats({ subscriptions, isLoading }: SubscriptionStatsProps) {
  return (
    <Section
      title="Abonnements"
      loading={isLoading}
      action={
        subscriptions && (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{subscriptions.paidRate}% payants</span>
          </div>
        )
      }
    >
      {subscriptions && (
        <div className="space-y-3">
          {Object.entries(subscriptions.plans).map(([plan, data]) => (
            <div key={plan} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    PLAN_STYLES[plan] || DEFAULT_PLAN_STYLE
                  }`}
                >
                  {plan.toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{data.active}</span>
                <span className="text-muted-foreground"> actifs / {data.total} total</span>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-border/50 flex justify-between text-sm">
            <span className="text-muted-foreground">Total payants</span>
            <span className="font-bold text-green-400">{subscriptions.totalPaid}</span>
          </div>
        </div>
      )}
    </Section>
  )
}
