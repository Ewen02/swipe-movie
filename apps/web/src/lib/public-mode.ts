/**
 * Vitrine mode — the deployment serves only the public surface.
 *
 * When the VPS hosts Swipe Movie with authentication closed, Caddy is the hard
 * boundary: /login, /api/auth/* and the whole (protected) area never reach this
 * container (see ~/infra/caddy/Caddyfile). This flag exists for the OTHER half
 * of the problem — the landing would otherwise keep advertising "Commencer" and
 * "Se connecter" buttons pointing at routes the proxy now refuses, which reads
 * as a broken site rather than a closed one.
 *
 * Build-time only: NEXT_PUBLIC_* values are inlined by Next during `next build`,
 * so flipping this requires a rebuild, not a restart. It must also be listed in
 * turbo.json's build env allowlist, or Turbo strips it and the constant silently
 * resolves to false despite a correct value being passed.
 */
export const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true';
