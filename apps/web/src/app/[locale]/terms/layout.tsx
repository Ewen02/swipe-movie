import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Consultez les conditions générales d'utilisation de Swipe Movie, l'application qui facilite le choix de films entre amis.",
  openGraph: {
    title: "Conditions d'utilisation | Swipe Movie",
    description: "Conditions générales d'utilisation de Swipe Movie.",
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
