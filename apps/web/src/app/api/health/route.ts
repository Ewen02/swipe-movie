/**
 * Liveness probe for the container healthcheck (~/infra/CLAUDE.md § 3.7).
 *
 * Deliberately shallow: it answers "is this Next server accepting requests?",
 * nothing more. It must NOT touch the database or the API — a healthcheck that
 * fails on a transient Neon hiccup would make Docker restart a perfectly good
 * web container, and deploy.sh would roll back a good release. Dependency
 * health belongs to the API's own /health and to external monitoring.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ status: 'ok' });
}
