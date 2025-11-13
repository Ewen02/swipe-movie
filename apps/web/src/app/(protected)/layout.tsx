import { ReactNode } from "react"
import { Header } from "@/components/layout/Header"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
  