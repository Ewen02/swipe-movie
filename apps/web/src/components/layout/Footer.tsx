import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="container mx-auto px-4 py-12 border-t">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Image
          src="/logo.png"
          alt="Swipe Movie"
          width={160}
          height={36}
          className="h-9 w-auto"
        />
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">
            {t('nav.about')}
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            {t('nav.contact')}
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            {t('nav.privacy')}
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            {t('nav.terms')}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2025 Swipe Movie. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
