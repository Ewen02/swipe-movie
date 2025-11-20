"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Film, Sparkles } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('title')}
        </h1>

        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                {t('mission.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('mission.p1')}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {t('mission.p2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                {t('howItWorks.title')}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('howItWorks.step1Title')}</h3>
                  <p className="text-muted-foreground">
                    {t('howItWorks.step1Desc')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('howItWorks.step2Title')}</h3>
                  <p className="text-muted-foreground">
                    {t('howItWorks.step2Desc')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('howItWorks.step3Title')}</h3>
                  <p className="text-muted-foreground">
                    {t('howItWorks.step3Desc')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Film className="w-6 h-6 text-primary" />
                {t('catalog.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('catalog.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                {t('free.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('free.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                {t('cta.title')}
              </h2>
              <Link href="/login">
                <Button size="lg" className="text-lg px-12 py-6">
                  {t('cta.button')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
