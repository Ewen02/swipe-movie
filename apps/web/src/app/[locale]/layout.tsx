import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers"
import { Analytics } from "@vercel/analytics/react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { PWAInstallBanner } from "@/components/pwa/PWAInstallBanner"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://swipe-movie.com'),
  title: {
    default: 'Swipe Movie - Trouvez votre prochain film entre amis',
    template: '%s | Swipe Movie'
  },
  description: 'Découvrez votre prochain film à regarder en swipant avec vos amis. Créez une room, invitez vos proches et trouvez le film parfait qui plaira à tout le monde grâce à notre système de match intelligent.',
  keywords: ['film', 'movie', 'swipe', 'amis', 'match', 'cinéma', 'streaming', 'netflix', 'recommendation', 'tinder for movies'],
  authors: [{ name: 'Swipe Movie Team' }],
  creator: 'Swipe Movie',
  publisher: 'Swipe Movie',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://swipe-movie.com',
    siteName: 'Swipe Movie',
    title: 'Swipe Movie - Trouvez votre prochain film entre amis',
    description: 'Découvrez votre prochain film à regarder en swipant avec vos amis. Système de match intelligent pour trouver le film parfait.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Swipe Movie - Trouvez votre film parfait',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swipe Movie - Trouvez votre prochain film entre amis',
    description: 'Swipez, matchez, regardez ! Trouvez le film parfait avec vos amis.',
    images: ['/og-image.png'],
    creator: '@swipemovie',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <PWAInstallBanner />
          </Providers>
        </NextIntlClientProvider>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
