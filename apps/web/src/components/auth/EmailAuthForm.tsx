'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@swipe-movie/ui';
import { authClient } from '@/lib/auth-client';
import { captureEvent } from '@/components/providers/PostHogProvider';

/**
 * Self-contained email auth flow offering both a 6-digit OTP code (default,
 * lowest friction on mobile — no app switch) and a magic link fallback.
 *
 * Both methods are gated server-side on RESEND_API_KEY: the emailOTP /
 * magicLink plugins are only registered when Resend is configured, so the
 * client calls return an error response we surface as a generic failure.
 *
 * On successful verification the user is signed in (sign-in OTP auto-creates
 * the account for unknown emails, matching magic-link behaviour) and we either
 * redirect (callbackUrl) or invoke onSuccess.
 *
 * The i18n namespace is passed in so this component can live under both the
 * `login` and `trial.loginWall` message trees — both expose the same keys.
 */

type Step = 'email' | 'code' | 'link_sent';

interface EmailAuthFormProps {
  /** Where to go after a successful OTP sign-in / magic-link click. */
  callbackUrl: string;
  /** next-intl namespace exposing the email auth keys (e.g. 'login.email'). */
  namespace: string;
  /** Optional analytics context, attached to every event. */
  analyticsContext?: Record<string, string | number | boolean>;
  /** Called after a successful OTP sign-in instead of router.push, if provided. */
  onSuccess?: () => void;
  /** Compact styling for use inside the login wall modal. */
  compact?: boolean;
}

export function EmailAuthForm({
  callbackUrl,
  namespace,
  analyticsContext = {},
  onSuccess,
  compact = false,
}: EmailAuthFormProps) {
  const t = useTranslations(namespace);
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = email.includes('@') && email.includes('.');

  const track = (event: string, extra: Record<string, string | number | boolean> = {}) => {
    captureEvent(event, { ...analyticsContext, ...extra });
  };

  // Step 1a — send a 6-digit code (default path).
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail || busy) return;
    track('email_auth_code_requested', { method: 'otp' });
    setBusy(true);
    setError(null);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
      });
      if (result?.error) throw new Error(result.error.message || 'otp_send_failed');
      setStep('code');
    } catch (err) {
      console.error('OTP send error:', err);
      setError(t('error'));
    } finally {
      setBusy(false);
    }
  };

  // Step 2 — verify the entered code and sign in.
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.replace(/\D/g, '');
    if (clean.length !== 6 || busy) return;
    track('email_auth_code_submitted');
    setBusy(true);
    setError(null);
    try {
      const result = await authClient.signIn.emailOtp({ email, otp: clean });
      if (result?.error) throw new Error(result.error.message || 'otp_verify_failed');
      track('email_auth_signed_in', { method: 'otp' });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      setError(t('codeError'));
    } finally {
      setBusy(false);
    }
  };

  // Step 1b — magic link fallback.
  const handleSendMagicLink = async () => {
    if (!isValidEmail || busy) return;
    track('email_auth_code_requested', { method: 'magic_link' });
    setBusy(true);
    setError(null);
    try {
      const result = await authClient.signIn.magicLink({ email, callbackURL: callbackUrl });
      if (result?.error) throw new Error(result.error.message || 'magic_link_failed');
      setStep('link_sent');
    } catch (err) {
      console.error('Magic link error:', err);
      setError(t('error'));
    } finally {
      setBusy(false);
    }
  };

  const inputBase =
    'w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50';

  // --- Link-sent confirmation -------------------------------------------------
  if (step === 'link_sent') {
    return (
      <div className={compact ? 'text-center py-2' : 'text-center py-4'}>
        <p className="text-sm font-medium text-foreground">{t('emailSentTitle')}</p>
        <p className="text-xs text-muted-foreground mt-1">{t('emailSentDescription')}</p>
      </div>
    );
  }

  // --- Code entry -------------------------------------------------------------
  if (step === 'code') {
    return (
      <form onSubmit={handleVerifyCode} className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">{t('codeSentTo', { email })}</p>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          autoFocus
          placeholder={t('codePlaceholder')}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          disabled={busy}
          className={`${inputBase} text-center tracking-[0.5em] text-lg font-semibold`}
        />
        <Button
          type="submit"
          disabled={busy || code.replace(/\D/g, '').length !== 6}
          size={compact ? 'sm' : 'lg'}
          className="w-full"
        >
          {busy ? t('codeVerifying') : t('codeSubmit')}
        </Button>
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <button
          type="button"
          onClick={() => {
            setStep('email');
            setCode('');
            setError(null);
          }}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
        >
          {t('codeBack')}
        </button>
      </form>
    );
  }

  // --- Email entry ------------------------------------------------------------
  return (
    <form onSubmit={handleSendCode} className="space-y-2">
      <input
        type="email"
        required
        autoFocus={compact}
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={busy}
        className={inputBase}
      />
      <Button
        type="submit"
        disabled={busy || !isValidEmail}
        size={compact ? 'sm' : 'lg'}
        variant={compact ? 'outline' : 'default'}
        className="w-full"
      >
        {busy ? t('emailSending') : t('codeRequest')}
      </Button>
      <button
        type="button"
        onClick={handleSendMagicLink}
        disabled={busy || !isValidEmail}
        className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1 transition-colors disabled:opacity-50"
      >
        {t('useMagicLink')}
      </button>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </form>
  );
}
