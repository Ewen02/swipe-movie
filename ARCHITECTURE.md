# Architecture Swipe Movie

## Vue d'ensemble

Swipe Movie est une application full-stack permettant aux utilisateurs de découvrir et sélectionner des films/séries en groupe via un système de swipe similaire à Tinder.

## Stack Technique

### Frontend (Web)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + Context API
- **Authentication**: NextAuth.js avec Google OAuth
- **Real-time**: Socket.IO client
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Fetch API
- **Monitoring**: Sentry
- **Analytics**: Vercel Analytics

### Backend (API)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.IO (WebSocket)
- **Cache**: Redis (optionnel, fallback in-memory)
- **Authentication**: JWT
- **Validation**: class-validator + class-transformer
- **Security**: Helmet, rate limiting, CORS
- **Documentation**: Swagger/OpenAPI
- **Monitoring**: Sentry

### Infrastructure
- **Web Hosting**: Vercel
- **API Hosting**: Configurable (Railway/Render/AWS)
- **Database**: PostgreSQL (Supabase/Railway/etc.)
- **Cache**: Redis (Upstash/Railway/etc.)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry

## Architecture Applicative

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js Application                       │  │
│  │  • Pages (App Router)                                 │  │
│  │  • Components (React)                                 │  │
│  │  • State Management (Hooks)                           │  │
│  │  • Real-time (Socket.IO)                              │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/WSS
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                    NestJS API Server                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Controllers → Services → Repositories                │  │
│  │  • Authentication (JWT)                               │  │
│  │  • Business Logic                                     │  │
│  │  • WebSocket Gateway                                  │  │
│  │  • Cache Layer (Redis)                                │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────┬───────────────────┬──────────────────────────┘
               │                   │
               │                   │
      ┌────────┴────────┐   ┌─────┴──────┐
      │   PostgreSQL    │   │   Redis    │
      │   Database      │   │   Cache    │
      └─────────────────┘   └────────────┘
               │
      ┌────────┴────────┐
      │   TMDb API      │
      │  (External)     │
      └─────────────────┘
```

## Flux de Données

### 1. Authentification
```
User → Google OAuth → NextAuth.js → JWT Token → API Authorization
```

### 2. Création de Room
```
User → Form Input → API /rooms (POST)
     → Prisma → PostgreSQL → Room Created
     → Response → Redirect to Room Page
```

### 3. Swipe de Films
```
User → Swipe Action → API /swipes (POST)
     → Check existing swipes → Redis Cache
     → Save swipe → PostgreSQL
     → Check for match (all users swiped right)
     → If match: WebSocket broadcast → All users in room
```

### 4. Découverte de Films
```
Room Configuration → API /movies/discover
     → Check Redis cache (1h TTL)
     → If miss: TMDb API → Cache → Response
     → Filter by user swipes → Return movies
```

## Modèle de Données

### User
```typescript
{
  id: string (CUID)
  email: string (unique)
  name?: string
  roles: string[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Room
```typescript
{
  id: string (CUID)
  code: string (unique, 6 chars)
  name: string
  type: 'MOVIE' | 'TV'
  genreId: number
  capacity: number
  // Advanced filters
  minRating?: number
  releaseYearMin?: number
  releaseYearMax?: number
  runtimeMin?: number
  runtimeMax?: number
  watchProviders: number[]
  watchRegion: string
  originalLanguage?: string
  // Relations
  members: RoomMember[]
  matches: Match[]
  createdBy: string
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt?: DateTime
}
```

### Swipe
```typescript
{
  id: string (CUID)
  roomId: string
  userId: string
  movieId: string
  value: boolean (true = like, false = dislike)
  createdAt: DateTime
  // Unique constraint: [roomId, userId, movieId]
}
```

### Match
```typescript
{
  id: string (CUID)
  roomId: string
  movieId: string
  createdAt: DateTime
  // Unique constraint: [roomId, movieId]
}
```

## Sécurité

### Authentification & Autorisation
- **NextAuth.js** pour l'authentification utilisateur
- **JWT tokens** pour l'API
- **Google OAuth** comme provider
- **Session timeout**: 30 jours max, 7 jours inactivity

### Protection des API
- **Rate limiting**: 100 req/15min par IP (général), 10 req/15min (création)
- **CORS**: Origine autorisée uniquement
- **Helmet**: Headers de sécurité (HSTS, XSS, CSP)
- **Input validation**: class-validator + Zod
- **SQL Injection**: Prévention via Prisma ORM
- **XSS**: Sanitization automatique React

### Données sensibles
- **Passwords**: N/A (OAuth uniquement)
- **JWT Secret**: Variable d'environnement
- **API Keys**: Variables d'environnement
- **Logs**: Pas de données sensibles loggées
- **Sentry**: Filtrage des données sensibles

## Performance

### Caching Strategy
- **TMDb API responses**: Redis (1h-7 jours selon type)
- **In-memory fallback**: Si Redis indisponible
- **Client-side**: React Query (future)
- **CDN**: Assets statiques via Vercel Edge

### Database Optimization
- **Connection Pooling**: 10-20 connections en production
- **Indexes**: Sur roomId, userId, movieId, createdAt
- **Soft delete**: Index sur deletedAt
- **Queries**: Optimisées via Prisma (N+1 prevention)

### Images
- **Next.js Image**: Automatic optimization, WebP/AVIF
- **TMDb CDN**: Utilisation directe des URLs TMDb
- **Responsive**: Tailles adaptatives selon viewport
- **Lazy loading**: Hors viewport

### Real-time
- **WebSocket**: Auto-reconnect avec exponential backoff
- **Room isolation**: Événements scopés par room
- **Ping/Pong**: Heartbeat toutes les 25s
- **Metrics**: Logging toutes les 5min

## Monitoring & Observabilité

### Error Tracking
- **Sentry**: Frontend + Backend
- **Error Boundaries**: React error capture
- **Context enrichment**: User, room, component stack
- **Source maps**: Uploaded pour stack traces lisibles

### Logging
- **Development**: Verbose (queries, info, warn, error)
- **Production**: Minimal (warn, error uniquement)
- **Structured**: JSON format
- **No PII**: Données sensibles filtrées

### Metrics
- **WebSocket**: Clients connectés, rooms actives
- **Database**: Slow queries (>1s) en dev
- **API**: Request/response times
- **Vercel Analytics**: Page views, Web Vitals

## Déploiement

### Environnements
1. **Development**: Local (localhost:3000/3001)
2. **Staging**: Branch `develop` (optionnel)
3. **Production**: Branch `main` → Vercel + API host

### CI/CD Pipeline
```
Push → GitHub Actions → Lint → Type Check → Build → Test → Deploy
                                                         ↓
                                                    Production
```

### Rollback Strategy
- **Vercel**: Instant rollback via dashboard
- **API**: Version tagging + deployment history
- **Database**: Migrations versionnées (Prisma)

## Scalabilité

### Horizontal Scaling
- **Web**: Serverless (Vercel Edge Functions)
- **API**: Stateless, peut scaler horizontalement
- **WebSocket**: Sticky sessions ou Redis adapter
- **Database**: Read replicas (futur)

### Vertical Scaling
- **Database**: Augmenter compute/storage
- **Redis**: Augmenter memory
- **Connection pool**: Ajuster selon charge

### Limites actuelles
- **WebSocket**: Single instance (pas de Redis adapter)
- **Cache**: Local par instance API
- **Rate limiting**: Par instance (pas global)

### Solutions futures
- **Redis Adapter**: Pour WebSocket multi-instance
- **Distributed cache**: Redis cluster
- **Global rate limiting**: Via Redis
- **Database sharding**: Si nécessaire

## Conventions de Code

### Naming
- **Files**: kebab-case (`room-card.tsx`)
- **Components**: PascalCase (`RoomCard`)
- **Functions**: camelCase (`createRoom`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`RoomDto`)

### Structure Directories
```
apps/
  web/
    src/
      app/           # Pages (App Router)
      components/    # React components
      hooks/         # Custom hooks
      lib/           # Utilities, API clients
      schemas/       # Zod schemas
  api/
    src/
      modules/       # Feature modules
      common/        # Shared (DTOs, filters, etc.)
      infra/         # Infrastructure (Prisma, Sentry)
```

### TypeScript
- **Strict mode**: Enabled
- **No any**: Utiliser `unknown` si nécessaire
- **Explicit return types**: Sur fonctions publiques
- **Interface vs Type**: Interface préféré

## Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [TMDb API](https://developers.themoviedb.org)
- [Socket.IO Docs](https://socket.io/docs)
