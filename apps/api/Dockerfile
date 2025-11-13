# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files (root and api workspace)
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install ALL dependencies
RUN npm ci

# Copy source code
COPY apps/api ./apps/api

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build the application (run from root with workspace flag)
WORKDIR /app
RUN npm run build --workspace=apps/api

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install production dependencies
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Change to api directory
WORKDIR /app/apps/api

# Generate Prisma Client in production stage
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Start the application (run migrations first, then start)
CMD sh -c "npx prisma migrate deploy && npm run start:prod"
