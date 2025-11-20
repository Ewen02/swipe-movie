"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function TermsPage() {
  const t = useTranslations('terms')

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
                <FileText className="w-6 h-6 text-primary" />
                {t('acceptance.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('acceptance.p1')}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {t('acceptance.p2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('description.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('description.intro')}
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                {t.raw('description.items').map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {t('description.outro')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                {t('allowedUse.title')}
              </h2>
              <p className="text-muted-foreground mb-4">{t('allowedUse.intro')}</p>
              <ul className="space-y-2 text-muted-foreground">
                {t.raw('allowedUse.items').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-destructive" />
                {t('prohibitedUse.title')}
              </h2>
              <p className="text-muted-foreground mb-4">{t('prohibitedUse.intro')}</p>
              <ul className="space-y-2 text-muted-foreground">
                {t.raw('prohibitedUse.items').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('accounts.title')}</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  {t('accounts.intro')}
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  {t.raw('accounts.items').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4">
                  {t('accounts.outro')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('intellectualProperty.title')}</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  {t('intellectualProperty.p1')}
                </p>
                <p>
                  {t('intellectualProperty.p2')}
                </p>
                <p>
                  {t('intellectualProperty.p3')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                {t('liability.title')}
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  {t('liability.intro')}
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  {t.raw('liability.items').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4">
                  {t('liability.outro')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('termination.title')}</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  {t('termination.p1')} <a href="mailto:contact@swipe-movie.com" className="text-primary hover:underline">contact@swipe-movie.com</a>.
                </p>
                <p>
                  {t('termination.p2')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('law.title')}</h2>
              <p className="text-muted-foreground">
                {t('law.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('contactSection.title')}</h2>
              <p className="text-muted-foreground">
                {t('contactSection.description')}{" "}
                <a href="mailto:legal@swipe-movie.com" className="text-primary hover:underline">
                  legal@swipe-movie.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('entireAgreement.title')}</h2>
              <p className="text-muted-foreground">
                {t('entireAgreement.description')} <Link href="/privacy" className="text-primary hover:underline">{t('entireAgreement.privacyLink')}</Link>, {t('entireAgreement.descriptionEnd')}
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
