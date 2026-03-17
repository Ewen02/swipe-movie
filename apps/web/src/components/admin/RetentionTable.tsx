import { Section } from "./Section"
import type { RetentionData } from "@/lib/api/admin"

interface RetentionTableProps {
  retention: RetentionData | undefined
  isLoading: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  })
}

function RetentionCell({ value }: { value: number }) {
  const bg =
    value >= 30
      ? "bg-green-500/20 text-green-400"
      : value >= 10
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400"

  return (
    <td className={`px-3 py-2 text-center rounded ${bg} font-medium`}>
      {value}%
    </td>
  )
}

export function RetentionTable({ retention, isLoading }: RetentionTableProps) {
  return (
    <Section title="Retention par Cohorte" loading={isLoading}>
      {retention && retention.cohorts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left text-muted-foreground font-medium">Semaine</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">Users</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">J1</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">J7</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">J30</th>
              </tr>
            </thead>
            <tbody>
              {retention.cohorts.map((cohort) => (
                <tr key={cohort.week} className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">{formatDate(cohort.week)}</td>
                  <td className="px-3 py-2 text-center">{cohort.users}</td>
                  <RetentionCell value={cohort.j1} />
                  <RetentionCell value={cohort.j7} />
                  <RetentionCell value={cohort.j30} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">Pas encore de donnees</p>
      )}
    </Section>
  )
}
