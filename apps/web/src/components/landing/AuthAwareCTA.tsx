'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@swipe-movie/ui';
import { useSession } from '@/lib/auth-client';

interface AuthAwareCTAProps {
  cta: string;
  ctaAuth: string;
  /** Extra classes applied to the wrapping shimmer container. */
  className?: string;
}

/**
 * AuthAwareCTA — the only client island on the landing page. It swaps the CTA
 * label/href once the client session resolves. SSR renders the unauthenticated
 * variant (matching the prior behaviour where `session` was null during SSR),
 * so the page stays a Server Component and ships almost no JS.
 */
export function AuthAwareCTA({ cta, ctaAuth, className = '' }: AuthAwareCTAProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <Link href={isAuthenticated ? '/rooms' : '/try'}>
      <div className={`lp-shimmer relative overflow-hidden rounded-lg ${className}`.trim()}>
        <Button size="lg" className="text-lg px-8 py-7 shadow-xl shadow-primary/25 w-full sm:w-auto">
          {isAuthenticated ? ctaAuth : cta}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </Link>
  );
}

interface AuthAwareFinalCTAProps {
  subtitle: string;
  subtitleAuth: string;
  button: string;
  buttonAuth: string;
}

/**
 * AuthAwareFinalCTA — bottom-of-page variant that also swaps the supporting
 * subtitle copy for authenticated users. SSR renders the unauthenticated
 * variant; the authed copy appears after hydration.
 */
export function AuthAwareFinalCTA({
  subtitle,
  subtitleAuth,
  button,
  buttonAuth,
}: AuthAwareFinalCTAProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        {isAuthenticated ? subtitleAuth : subtitle}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <Link href={isAuthenticated ? '/rooms' : '/try'}>
          <div className="transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
            <div className="lp-shimmer relative overflow-hidden rounded-lg">
              <Button size="lg" className="text-lg px-8 py-7 shadow-xl shadow-primary/25 w-full sm:w-auto">
                {isAuthenticated ? buttonAuth : button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
