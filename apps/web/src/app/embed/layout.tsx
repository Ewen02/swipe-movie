import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Swipe Movie Widget",
  robots: { index: false, follow: false },
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, overflow: "hidden", background: "#0a0a0a" }}>
        {children}
      </body>
    </html>
  )
}
