"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Github } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { PublicHeader } from "@/components/layout/PublicHeader"

export default function ContactPage() {
  const t = useTranslations('contact')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('title')}
        </h1>

        <p className="text-xl text-muted-foreground mb-12">
          {t('description')}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">{t('email.title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('email.description')}
              </p>
              <a
                href="mailto:contact@swipe-movie.com"
                className="text-primary hover:underline font-medium"
              >
                contact@swipe-movie.com
              </a>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">{t('github.title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('github.description')}
              </p>
              <a
                href="https://github.com/Ewen02/swipe-movie/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {t('github.link')}
              </a>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              {t('faq.title')}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('faq.q1')}
                </h3>
                <p className="text-muted-foreground">
                  {t('faq.a1')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('faq.q2')}
                </h3>
                <p className="text-muted-foreground">
                  {t('faq.a2')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('faq.q3')}
                </h3>
                <p className="text-muted-foreground">
                  {t('faq.a3')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('faq.q4')}
                </h3>
                <p className="text-muted-foreground">
                  {t('faq.a4')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('faq.q5')}
                </h3>
                <p className="text-muted-foreground">
                  {t('faq.a5')} <Link href="/privacy" className="text-primary hover:underline">{t('faq.privacyLink')}</Link> {t('faq.a5End')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('cta.description')}
            </p>
            <a href="mailto:contact@swipe-movie.com">
              <Button size="lg" className="text-lg px-12 py-6">
                <Mail className="mr-2 h-5 w-5" />
                {t('cta.button')}
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
