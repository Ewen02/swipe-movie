import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Découvrez nos offres gratuites et premium pour profiter au maximum de Swipe Movie. Commencez gratuitement, passez au niveau supérieur quand vous voulez.",
  openGraph: {
    title: "Tarifs | Swipe Movie",
    description: "Découvrez nos offres gratuites et premium pour Swipe Movie.",
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
