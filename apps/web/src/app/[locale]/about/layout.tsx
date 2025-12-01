import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez l'histoire de Swipe Movie, notre mission et notre équipe passionnée qui révolutionne la façon de choisir des films entre amis.",
  openGraph: {
    title: "À propos | Swipe Movie",
    description: "Découvrez l'histoire de Swipe Movie, notre mission et notre équipe passionnée.",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
