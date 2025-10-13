"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export default function ThemePreviewPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold">🎬 Cinéma Theme Preview</h1>

      <Card className="w-[300px]">
        <CardContent className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Carte Film</h2>
          <p className="text-muted-foreground">Découvrez votre nouvelle palette “cinéma”</p>

          <div className="flex gap-2">
            <Badge>Accent</Badge>
            <Badge className="bg-primary text-primary-foreground">Primary</Badge>
            <Badge className="bg-secondary text-secondary-foreground">Secondary</Badge>
          </div>

          <div className="flex gap-4">
            <Button variant="default">Primary</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </CardContent>
      </Card>
      <ThemeToggle />
    </div>
  )
}