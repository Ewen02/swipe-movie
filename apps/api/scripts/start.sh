#!/bin/sh
# Production startup for the API container (Railway).
# 1) Apply pending Prisma migrations through a DIRECT (non-pooled) connection.
# 2) Only then start the NestJS server.
#
# Why a script (not an inline CMD): the migration step has real failure modes
# (pooled URL, channel_binding) that must HARD-FAIL the boot — a desynced DB
# silently starting is how "column expiryReminderSentAt does not exist" reached
# production. Here, a failed migrate exits non-zero so Railway shows it + retries
# instead of serving a broken schema.
set -e

# Migrations need the direct endpoint. Fall back to DATABASE_URL if DIRECT_URL
# is unset (single-URL setups), but prefer an explicit DIRECT_URL in prod.
MIGRATE_URL="${DIRECT_URL:-$DATABASE_URL}"

# Strip channel_binding=require: Prisma's migration engine fails SCRAM auth
# against Neon when it's present, which made migrate deploy error out (and, with
# the old CMD, the server started anyway). sslmode=require already secures it.
MIGRATE_URL=$(printf '%s' "$MIGRATE_URL" | sed -E 's/([?&])channel_binding=[^&]*(&)?/\1/; s/[?&]$//')

echo "[startup] applying database migrations…"
DIRECT_URL="$MIGRATE_URL" DATABASE_URL="$MIGRATE_URL" \
  pnpm --filter @swipe-movie/database exec prisma migrate deploy

echo "[startup] migration status:"
DIRECT_URL="$MIGRATE_URL" DATABASE_URL="$MIGRATE_URL" \
  pnpm --filter @swipe-movie/database exec prisma migrate status || true

echo "[startup] starting API…"
exec pnpm --filter api start:prod
