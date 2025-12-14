"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Loader2, Check, X } from "lucide-react"
import { Button } from "@swipe-movie/ui"
import { connectProvider, ExternalProvider } from "@/lib/api/external-services"

interface OAuthCallbackPageProps {
  params: Promise<{ provider: string }>
}

export default function OAuthCallbackPage({ params }: OAuthCallbackPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("connections")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const resolvedParams = await params
      const provider = resolvedParams.provider as ExternalProvider
      const code = searchParams.get("code")
      const error = searchParams.get("error")

      if (error) {
        setStatus("error")
        setErrorMessage(error)
        return
      }

      if (!code) {
        setStatus("error")
        setErrorMessage("No authorization code received")
        return
      }

      try {
        await connectProvider(provider, code)
        setStatus("success")
        // Redirect to connections page after a short delay
        setTimeout(() => {
          router.push("/connections")
        }, 1500)
      } catch (err) {
        setStatus("error")
        setErrorMessage(err instanceof Error ? err.message : "Connection failed")
      }
    }

    handleCallback()
  }, [params, searchParams, router])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Connexion en cours...</p>
            <p className="text-sm text-muted-foreground">
              Veuillez patienter pendant que nous connectons votre compte
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-lg font-medium text-green-500">
              {t("connectSuccess")}
            </p>
            <p className="text-sm text-muted-foreground">
              Redirection vers les connexions...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <X className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-lg font-medium text-red-500">
              {t("connectError")}
            </p>
            {errorMessage && (
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            )}
            <Button
              variant="outline"
              onClick={() => router.push("/connections")}
            >
              Retour aux connexions
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
