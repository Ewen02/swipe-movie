"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useSWRConfig } from "swr"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@swipe-movie/ui"
import { RefreshCw, Check, X, Loader2 } from "lucide-react"
import { ExternalConnection, SyncResult } from "@swipe-movie/types"
import {
  getAuthUrl,
  syncProvider,
  disconnectProvider,
  ExternalProvider,
} from "@/lib/api/external-services"
import { getConnectionKey } from "@/hooks/useConnections"

interface ConnectionCardProps {
  provider: ExternalProvider
  status: ExternalConnection | undefined
  isLoading: boolean
  icon: React.ReactNode
}

export function ConnectionCard({
  provider,
  status,
  isLoading,
  icon,
}: ConnectionCardProps) {
  const t = useTranslations("connections")
  const { mutate } = useSWRConfig()
  const [isSyncing, setIsSyncing] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)

  const handleConnect = async () => {
    try {
      const { url } = await getAuthUrl(provider)
      window.location.href = url
    } catch (error) {
      console.error(`Failed to get ${provider} auth URL:`, error)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncResult(null)
    try {
      const result = await syncProvider(provider)
      setSyncResult(result)
      mutate(getConnectionKey(provider))
    } catch (error) {
      console.error(`Failed to sync ${provider}:`, error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await disconnectProvider(provider)
      mutate(getConnectionKey(provider))
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  const isConnected = status?.connected ?? false

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">
                {t(`${provider}.name`)}
              </CardTitle>
              <CardDescription className="text-sm">
                {t(`${provider}.description`)}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className={isConnected ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}
          >
            {isConnected ? (
              <>
                <Check className="mr-1 h-3 w-3" />
                {t("connected")}
              </>
            ) : (
              <>
                <X className="mr-1 h-3 w-3" />
                {t("disconnected")}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : isConnected ? (
          <div className="space-y-4">
            {status?.username && (
              <p className="text-sm text-muted-foreground">
                @{status.username}
              </p>
            )}

            {syncResult && (
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <p className="font-medium text-green-500">{t("syncSuccess")}</p>
                <p className="text-muted-foreground">
                  {t("imported", { count: syncResult.imported })}
                  {syncResult.skipped > 0 && ` (${syncResult.skipped} skipped)`}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("syncing")}
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("sync")}
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                {isDisconnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("disconnect")
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleConnect} className="w-full sm:w-auto">
            {t("connect")} {t(`${provider}.name`)}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
