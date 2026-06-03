import { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { OnboardingCheck } from "@/components/providers/OnboardingCheck"

// Protected pages depend on the authenticated session (cookies). They must NOT
// be statically pre-rendered at build time: doing so makes Next try to SSG
// /admin, /connections, etc., which hang on the API call and fail the build with
// "took more than 60 seconds". force-dynamic renders them per-request.
export const dynamic = "force-dynamic"

// NOTE: this layout intentionally does NO server-side data prefetch. It used to
// fire 3 API calls per navigation (rooms + genres + preferences) just to seed
// the SWR cache — but SWR fetches the same data client-side anyway, so we were
// paying twice and driving Vercel Fast Origin Transfer over the Hobby quota for
// almost no traffic. Each page now fetches its own data via its SWR hook; the
// brief skeleton on first load is an acceptable trade for the cost saving.
export default function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <OnboardingCheck>
      <div className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </OnboardingCheck>
  )
}
  