# syntax=docker/dockerfile:1
# Monorepo API image (pnpm workspaces). Build context is the REPO ROOT
# (railway.json sets dockerfilePath to apps/api/Dockerfile but the build
# context stays the repo root), so all workspace packages are available.

# ---- Build stage ----
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
# pnpm via corepack, pinned to the repo's packageManager version.
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy the whole monorepo. Simpler and more robust than cherry-picking
# package.json files; the build is not hot-path so the extra copy is fine.
COPY . .

# Install all deps for all workspaces (needed: api depends on @swipe-movie/*).
RUN pnpm install --frozen-lockfile

# Generate Prisma client (schema lives in packages/database).
RUN pnpm --filter @swipe-movie/database db:generate

# Build workspace deps the API imports, then the API itself.
RUN pnpm --filter @swipe-movie/types build \
  && pnpm --filter @swipe-movie/database build \
  && pnpm --filter @swipe-movie/email build \
  && pnpm --filter @swipe-movie/subscription build \
  && pnpm --filter api build

# ---- Production stage ----
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /app

# Bring the built monorepo over. Keeping node_modules from the builder avoids a
# second resolution pass and guarantees the same tree that was built/tested.
COPY --from=builder /app ./

RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3001

# Apply pending migrations (schema in packages/database) before starting.
# migrate deploy is a no-op when the DB is already up to date.
CMD sh -c "pnpm --filter @swipe-movie/database exec prisma migrate deploy && pnpm --filter api start:prod"
