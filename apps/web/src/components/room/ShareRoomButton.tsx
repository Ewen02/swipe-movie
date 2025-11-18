"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share2, Copy, CheckCircle2, QrCode } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import QRCode from "react-qr-code"

interface ShareRoomButtonProps {
  roomCode: string
  roomName: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ShareRoomButton({
  roomCode,
  roomName,
  variant = "outline",
  size = "default",
  className,
}: ShareRoomButtonProps) {
  const [open, setOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const roomUrl = typeof window !== "undefined"
    ? `${window.location.origin}/rooms/${roomCode}`
    : ""

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }, [roomUrl])

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopiedCode(true)
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
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to share:", err)
        }
      }
    }
  }, [roomUrl, roomName])

  // Check if native share is available
  const canShare = typeof navigator !== "undefined" && !!navigator.share

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className} aria-label="Inviter des amis à rejoindre la room">
          <Share2 className="w-4 h-4 mr-2" />
          Inviter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter des amis</DialogTitle>
          <DialogDescription>
            Partage cette room pour que tes amis puissent swiper avec toi!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Native Share Button (mobile only) */}
          {canShare && (
            <Button
              onClick={handleNativeShare}
              className="w-full"
              size="lg"
              variant="default"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          )}

          {/* Room Link */}
          <div className="space-y-2">
            <Label htmlFor="room-link" className="text-sm font-medium">
              Lien de la room
            </Label>
            <div className="flex gap-2">
              <Input
                id="room-link"
                value={roomUrl}
                readOnly
                className="flex-1 font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label={copiedLink ? "Lien copié" : "Copier le lien de la room"}
              >
                {copiedLink ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Room Code */}
          <div className="space-y-2">
            <Label htmlFor="room-code" className="text-sm font-medium">
              Code de la room
            </Label>
            <div className="flex gap-2">
              <Input
                id="room-code"
                value={roomCode}
                readOnly
                className="flex-1 font-mono text-lg font-bold text-center uppercase tracking-wider"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label={copiedCode ? "Code copié" : "Copier le code de la room"}
              >
                {copiedCode ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Les amis peuvent aussi rejoindre avec ce code depuis la page d'accueil
            </p>
          </div>

          {/* QR Code Toggle */}
          <Button
            onClick={() => setShowQR(!showQR)}
            variant="ghost"
            className="w-full"
            size="sm"
          >
            <QrCode className="w-4 h-4 mr-2" />
            {showQR ? "Masquer" : "Afficher"} le QR Code
          </Button>

          {/* QR Code Display */}
          {showQR && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCode
                value={roomUrl}
                size={200}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
