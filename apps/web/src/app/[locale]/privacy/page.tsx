"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, Trash2, Database } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function PrivacyPage() {
  const t = useTranslations('privacy')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('title')}
        </h1>

        <p className="text-muted-foreground mb-8">
          {t('lastUpdate')}
        </p>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                {t('commitment.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('commitment.p1')}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>{t('commitment.p2')}</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" />
                {t('dataCollected.title')}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('dataCollected.account.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('dataCollected.account.intro')}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                    {t.raw('dataCollected.account.items').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('dataCollected.usage.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('dataCollected.usage.intro')}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                    {t.raw('dataCollected.usage.items').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('dataCollected.technical.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('dataCollected.technical.intro')}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                    {t.raw('dataCollected.technical.items').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-primary" />
                {t('dataUsage.title')}
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>{t('dataUsage.service.title')}</strong> {t('dataUsage.service.description')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>{t('dataUsage.improve.title')}</strong> {t('dataUsage.improve.description')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>{t('dataUsage.communication.title')}</strong> {t('dataUsage.communication.description')}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                {t('security.title')}
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  {t('security.intro')}
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  {t.raw('security.items').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-primary" />
                {t('rights.title')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('rights.intro')}
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>{t('rights.access.title')}</strong> {t('rights.access.description')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>{t('rights.rectification.title')}</strong> {t('rights.rectification.description')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>{t('rights.erasure.title')}</strong> {t('rights.erasure.description')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>{t('rights.portability.title')}</strong> {t('rights.portability.description')}
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                {t('rights.contact')}{" "}
                <a href="mailto:privacy@swipe-movie.com" className="text-primary hover:underline">
                  privacy@swipe-movie.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('sharing.title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('sharing.intro')}
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                <li>
                  <strong>Google:</strong> {t('sharing.google')}
                </li>
                <li>
                  <strong>Vercel:</strong> {t('sharing.vercel')}
                </li>
                <li>
                  <strong>Railway:</strong> {t('sharing.railway')}
                </li>
                <li>
                  <strong>Neon:</strong> {t('sharing.neon')}
                </li>
                <li>
                  <strong>The Movie Database (TMDb):</strong> {t('sharing.tmdb')}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('cookies.title')}</h2>
              <p className="text-muted-foreground">
                {t('cookies.intro')}
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4 mt-3">
                {t.raw('cookies.items').map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3">
                {t('cookies.noTracking')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('changes.title')}</h2>
              <p className="text-muted-foreground">
                {t('changes.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('contactSection.title')}</h2>
              <p className="text-muted-foreground">
                {t('contactSection.description')}{" "}
                <a href="mailto:privacy@swipe-movie.com" className="text-primary hover:underline">
                  privacy@swipe-movie.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
