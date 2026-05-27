"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Shield, RefreshCw, ArrowLeft, Loader2,
  LayoutDashboard, TrendingUp, Users, UserSearch,
} from "lucide-react"
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@swipe-movie/ui"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import {
  useAdminStats,
  useAdminRetention,
  useAdminUsers,
  useAdminActivity,
  useAdminConversions,
  useAdminSubscriptions,
  useAdminTopMatches,
  useHealthCheck,
} from "@/hooks/useAdminData"

import dynamic from "next/dynamic"
import { KPICards } from "@/components/admin/KPICards"
import { HealthChecks } from "@/components/admin/HealthChecks"
import { ConversionFunnel } from "@/components/admin/ConversionFunnel"
import { SubscriptionStats } from "@/components/admin/SubscriptionStats"
import { TopMatchedMovies } from "@/components/admin/TopMatchedMovies"

// Lazy-load tab content components that are not visible by default
// ActivityChart is especially heavy due to recharts dependency
const ActivityChart = dynamic(() => import("@/components/admin/ActivityChart").then(m => ({ default: m.ActivityChart })), { ssr: false })
const RetentionTable = dynamic(() => import("@/components/admin/RetentionTable").then(m => ({ default: m.RetentionTable })), { ssr: false })
const UsersTable = dynamic(() => import("@/components/admin/UsersTable").then(m => ({ default: m.UsersTable })), { ssr: false })

const TAB_CONFIG = [
  { value: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { value: "activity", label: "Activité", icon: TrendingUp },
  { value: "retention", label: "Rétention", icon: Users },
  { value: "users", label: "Utilisateurs", icon: UserSearch },
] as const

export default function AdminPage() {
  const router = useRouter()
  const [usersPage, setUsersPage] = useState(1)
  const [activityDays, setActivityDays] = useState(30)

  const { stats, isLoading: statsLoading, error: statsError, refresh: refreshStats } = useAdminStats()
  const { retention, isLoading: retentionLoading, refresh: refreshRetention } = useAdminRetention()
  const { users, isLoading: usersLoading, refresh: refreshUsers } = useAdminUsers(usersPage)
  const { activity, isLoading: activityLoading, refresh: refreshActivity } = useAdminActivity(activityDays)
  const { conversions, isLoading: conversionsLoading, refresh: refreshConversions } = useAdminConversions()
  const { subscriptions, isLoading: subsLoading, refresh: refreshSubs } = useAdminSubscriptions()
  const { topMatches, isLoading: matchesLoading, refresh: refreshMatches } = useAdminTopMatches()
  const { health, isLoading: healthLoading, refresh: refreshHealth } = useHealthCheck()

  useEffect(() => {
    if (statsError && !statsLoading) router.push("/rooms")
  }, [statsError, statsLoading, router])

  const refreshAll = () => {
    refreshStats(); refreshRetention(); refreshUsers()
    refreshActivity(); refreshConversions(); refreshSubs(); refreshMatches()
    refreshHealth()
  }

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (statsError || !stats) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BackgroundOrbs />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Monitoring & Analytics</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refreshAll} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/rooms")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Rooms
              </Button>
            </div>
          </div>

          <HealthChecks health={health} isLoading={healthLoading} />
          <KPICards stats={stats} activity={activity} />

          {/* Tabs */}
          <div>
            <Tabs defaultValue="overview">
              <TabsList className="w-full h-auto justify-start bg-transparent p-0 mb-6 border-b border-border gap-1">
                {TAB_CONFIG.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative gap-2 px-4 py-2.5 rounded-none border-b-2 border-transparent bg-transparent shadow-none data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ConversionFunnel conversions={conversions} isLoading={conversionsLoading} />
                  <SubscriptionStats subscriptions={subscriptions} isLoading={subsLoading} />
                </div>
                <TopMatchedMovies topMatches={topMatches} isLoading={matchesLoading} />
              </TabsContent>

              <TabsContent value="activity" className="space-y-6 mt-0">
                <ActivityChart
                  activity={activity}
                  isLoading={activityLoading}
                  activityDays={activityDays}
                  onChangeDays={setActivityDays}
                />
              </TabsContent>

              <TabsContent value="retention" className="space-y-6 mt-0">
                <RetentionTable retention={retention} isLoading={retentionLoading} />
              </TabsContent>

              <TabsContent value="users" className="space-y-6 mt-0">
                <UsersTable
                  users={users}
                  isLoading={usersLoading}
                  page={usersPage}
                  onPageChange={setUsersPage}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
