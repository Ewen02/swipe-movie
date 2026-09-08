'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@swipe-movie/ui';
import { useSession } from '@/lib/auth-client';
import { AUTH_DISABLED } from '@/lib/public-mode';

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
 *
 * On a vitrine deployment the CTA is dropped entirely. The guard sits in this
 * outer wrapper rather than as an early return inside the inner component, so
 * useSession() is never reached: the hook would otherwise fire a request to
 * /api/auth/get-session on every landing view, which the proxy refuses.
 */
export function AuthAwareCTA(props: AuthAwareCTAProps) {
  if (AUTH_DISABLED) return null;
  return <AuthAwareCTAButton {...props} />;
}

function AuthAwareCTAButton({ cta, ctaAuth, className = '' }: AuthAwareCTAProps) {
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
 *
 * In vitrine mode the supporting copy is kept and only the button goes: the
 * closing section still reads as a finished page, instead of a heading left
 * hanging over empty space.
 */
export function AuthAwareFinalCTA(props: AuthAwareFinalCTAProps) {
  if (AUTH_DISABLED) {
    return (
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{props.subtitle}</p>
    );
  }
  return <AuthAwareFinalCTAButton {...props} />;
}

function AuthAwareFinalCTAButton({
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
