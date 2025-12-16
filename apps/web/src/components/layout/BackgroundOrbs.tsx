"use client"

interface BackgroundOrbsProps {
  className?: string
}

export function BackgroundOrbs({ className }: BackgroundOrbsProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${className ?? ""}`}>
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
    </div>
  )
}
