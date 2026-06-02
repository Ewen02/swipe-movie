"use client"

import { useState, useCallback } from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@swipe-movie/ui"
import { Share2, Copy, CheckCircle2, QrCode, Link2, Hash, Sparkles } from "lucide-react"
import QRCode from "react-qr-code"
import { cn } from "@/lib/utils"
import { captureEvent } from "@/components/providers/PostHogProvider"

interface ShareRoomButtonProps {
  roomCode: string
  roomName: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  defaultOpen?: boolean
  /** Render only the share icon (no "Inviter" label) — used on dense room cards. */
  iconOnly?: boolean
}

export function ShareRoomButton({
  roomCode,
  roomName,
  variant = "outline",
  size = "default",
  className,
  defaultOpen = false,
  iconOnly = false,
}: ShareRoomButtonProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // Always share the guest-friendly /try/join link. The /rooms/<code> form is
  // auth-walled (proxy.ts), so a logged-out friend who clicks it gets bounced to
  // /login before they can join — the main friction killing real joins. The
  // /try/join page auto-joins logged-in users and starts a guest session for
  // everyone else, so the same link works for both.
  const roomUrl = typeof window !== "undefined"
    ? `${window.location.origin}/try/join/${roomCode}`
    : ""

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomUrl)
      setCopiedLink(true)
      captureEvent("room_invite_shared", { method: "copy_link", roomCode })
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }, [roomUrl, roomCode])

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopiedCode(true)
      captureEvent("room_invite_shared", { method: "copy_code", roomCode })
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }, [roomCode])

  const handleNativeShare = useCallback(async () => {
    // Check if native share is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rejoins ma room ${roomName}`,
          text: `Hey! Rejoins ma room "${roomName}" sur Swipe Movie pour choisir un film ensemble!`,
          url: roomUrl,
        })
        captureEvent("room_invite_shared", { method: "native_share", roomCode })
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to share:", err)
        }
      }
    }
  }, [roomUrl, roomName, roomCode])

  // Check if native share is available
  const canShare = typeof navigator !== "undefined" && !!navigator.share

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className} aria-label="Inviter des amis à rejoindre la room">
          <Share2 className={iconOnly ? "w-4 h-4" : "w-4 h-4 mr-2"} />
          {!iconOnly && "Inviter"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Inviter des amis</DialogTitle>
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-3xl blur-xl" />

          {/* Main content */}
          <div className="relative bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
            {/* Gradient accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-2">
                  <Sparkles className="w-7 h-7 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold">Inviter des amis</h2>
                <p className="text-sm text-muted-foreground">
                  Partage cette room pour swiper ensemble !
                </p>
              </div>

              {/* Native Share Button (mobile only) */}
              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl">
                    <Share2 className="w-5 h-5" />
                    Partager
                  </div>
                </button>
              )}

              {/* Room Link */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Link2 className="w-4 h-4" />
                  Lien de la room
                </div>
                <div className="flex gap-2">
                  <div
                    className="flex-1 px-4 py-3 bg-foreground/5 border border-border rounded-xl font-mono text-sm truncate cursor-pointer hover:bg-foreground/10 transition-colors"
                    onClick={handleCopyLink}
                  >
                    {roomUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      "shrink-0 w-12 h-12 flex items-center justify-center rounded-xl border transition-all",
                      copiedLink
                        ? "bg-green-500/20 border-green-500/50 text-green-400"
                        : "bg-foreground/5 border-border hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
                    )}
                    aria-label={copiedLink ? "Lien copié" : "Copier le lien de la room"}
                  >
                    {copiedLink ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Room Code */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Hash className="w-4 h-4" />
                  Code de la room
                </div>
                <div className="flex gap-2">
                  <div
                    className="flex-1 px-4 py-3 bg-foreground/5 border border-border rounded-xl font-mono text-lg font-bold text-center uppercase tracking-[0.3em] cursor-pointer hover:bg-foreground/10 transition-colors"
                    onClick={handleCopyCode}
                  >
                    {roomCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className={cn(
                      "shrink-0 w-12 h-12 flex items-center justify-center rounded-xl border transition-all",
                      copiedCode
                        ? "bg-green-500/20 border-green-500/50 text-green-400"
                        : "bg-foreground/5 border-border hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
                    )}
                    aria-label={copiedCode ? "Code copié" : "Copier le code de la room"}
                  >
                    {copiedCode ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Partage le lien ou le code pour swiper ensemble — pas besoin de compte
                </p>
              </div>

              {/* QR Code Toggle */}
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground/5 hover:bg-foreground/10 border border-border rounded-xl text-sm font-medium transition-colors"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? "Masquer" : "Afficher"} le QR Code
              </button>

              {/* QR Code Display */}
              {showQR && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-md" />
                  <div className="relative flex justify-center p-6 bg-white rounded-2xl">
                    <QRCode
                      value={roomUrl}
                      size={180}
                      level="M"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
