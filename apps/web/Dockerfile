# syntax=docker/dockerfile:1
# Monorepo web (Next.js) image for Railway. Build context is the REPO ROOT
# (railway.json on the web service sets dockerfilePath to apps/web/Dockerfile
# but the build context stays the repo root), so all workspace packages are
# available to pnpm install / build.
#
# We rely on Next's `output: 'standalone'` (see next.config.ts): the build emits
# a self-contained server bundle with only the traced runtime deps, which we copy
# into a tiny runner stage. This keeps the container RAM (~130MB idle, measured)
# and image small — the lever that keeps the front inside the 5$ Railway plan.

# ---- Build stage ----
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy the whole monorepo. Simpler and more robust than cherry-picking
# package.json files; the build is not hot-path so the extra copy is fine.
COPY . .

# Install all deps for all workspaces. Rebuilds native bindings (prisma, sharp)
# for linux/musl — the host's darwin binaries are excluded via .dockerignore.
RUN pnpm install --frozen-lockfile

# Prisma client (the web app imports @prisma/client via @swipe-movie/database).
RUN pnpm --filter @swipe-movie/database db:generate

# NEXT_PUBLIC_* are inlined into the client bundle AT BUILD TIME, so they must be
# present during `next build` (here, inside docker build) — Railway's runtime env
# injection is too late and would leave them undefined in the browser bundle
# (silently breaking the API URL, PostHog, GA). Pass them as build args; on Railway
# set them under the service's "Build" variables (or use a build-time secret).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

# Build the workspace deps the web app imports, then the web app itself.
RUN pnpm --filter @swipe-movie/types build \
  && pnpm --filter @swipe-movie/database build \
  && pnpm --filter @swipe-movie/email build \
  && pnpm --filter @swipe-movie/subscription build \
  && pnpm --filter @swipe-movie/ui build \
  && pnpm --filter swipe-movie-web build

# ---- Production stage ----
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

ENV NODE_ENV=production
# Bind to all interfaces so Railway's proxy can reach the server.
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Standalone server bundle. With outputFileTracingRoot set to the workspace root,
# Next preserves the monorepo layout inside standalone/, so server.js lives under
# apps/web/ and the traced node_modules sit at the standalone root.
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./

# standalone does NOT include static assets or the public dir — copy them into the
# exact paths the server expects (relative to apps/web/).
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

# Railway injects PORT at runtime; Next's standalone server reads process.env.PORT.
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
