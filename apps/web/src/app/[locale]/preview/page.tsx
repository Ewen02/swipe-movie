"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, Button, Badge } from "@swipe-movie/ui"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export default function ThemePreviewPage() {
  const t = useTranslations('preview')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold">{t('title')}</h1>

      <Card className="w-[300px]">
        <CardContent className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{t('card.title')}</h2>
          <p className="text-muted-foreground">{t('card.description')}</p>

          <div className="flex gap-2">
            <Badge>{t('badges.accent')}</Badge>
            <Badge className="bg-primary text-primary-foreground">{t('badges.primary')}</Badge>
            <Badge className="bg-secondary text-secondary-foreground">{t('badges.secondary')}</Badge>
          </div>

          <div className="flex gap-4">
            <Button variant="default">{t('buttons.primary')}</Button>
            <Button variant="destructive">{t('buttons.destructive')}</Button>
          </div>
        </CardContent>
      </Card>
      <ThemeToggle />
    </div>
  )
}
