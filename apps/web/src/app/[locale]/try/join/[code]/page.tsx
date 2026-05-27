'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Film } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { startTrial, trialApiFetch } from '@/lib/trial'

export default function TrialJoinPage() {
  const t = useTranslations('trial')
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || 'fr'
  const code = params?.code as string

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return

    async function joinRoom() {
      try {
        // Create a ghost user
        await startTrial()

        // Join the room
        const joinRes = await trialApiFetch('/rooms/join', {
          method: 'POST',
          body: JSON.stringify({ code }),
        })

        if (!joinRes.ok) {
          const err = await joinRes.json().catch(() => ({}))
          console.error('[TrialJoin] Failed to join room:', err)
          setError('Unable to join the room. The code may be invalid or expired.')
          return
        }

        // Redirect to the trial swiping page
        router.replace(`/${locale}/try?room=${code}`)
      } catch (err) {
        console.error('[TrialJoin] Error:', err)
        setError('An error occurred. Please try again.')
      }
    }

    joinRoom()
  }, [code, locale, router])

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-sm mx-4">
          <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground font-medium mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    </div>
  )
}
