# Guide de Configuration des Variables d'Environnement

Ce guide détaille toutes les variables d'environnement nécessaires pour faire fonctionner Swipe Movie.

## 📋 Variables Requises

### API (`apps/api/.env`)

```env
# Configuration Serveur
PORT=3001
NODE_ENV=development
WEB_ORIGIN=http://localhost:3000
API_ORIGIN=http://localhost:3001

# Base de Données PostgreSQL avec Connection Pooling
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?params
DATABASE_URL=postgresql://user:password@localhost:5432/swipe_movie?connection_limit=10&pool_timeout=10&connect_timeout=5

# Authentification JWT
JWT_SECRET=votre-secret-jwt-changez-moi-en-production

# Cache Redis (optionnel - fallback in-memory si vide)
REDIS_URL=redis://localhost:6379

# API TMDb (obligatoire)
TMDB_API_KEY=votre-cle-tmdb-api
TMDB_API_URL=https://api.themoviedb.org/3

# Sentry Monitoring (optionnel)
SENTRY_DSN=
```

### Web (`apps/web/.env.local`)

```env
# Configuration API
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-nextauth-changez-moi

# Google OAuth
GOOGLE_CLIENT_ID=votre-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-google-client-secret

# Sentry Monitoring (optionnel)
NEXT_PUBLIC_SENTRY_DSN=
```

## 🔑 Obtenir les Credentials

### TMDb API (Obligatoire)

1. Créer un compte sur [themoviedb.org](https://www.themoviedb.org/signup)
2. **Paramètres → API** → Demander une clé API (gratuit)
3. Copier la clé **"API Key (v3 auth)"**

### Google OAuth (Obligatoire)

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un projet → Activer **Google+ API**
3. **Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Type: **Web application**
5. **Authorized redirect URIs**:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://votre-domaine.com/api/auth/callback/google`
6. Copier **Client ID** et **Client Secret**

### PostgreSQL (Obligatoire)

**Option 1 - Docker (Local):**
```bash
docker run --name swipe-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=swipe_movie_dev \
  -p 5432:5432 -d postgres:14-alpine

# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/swipe_movie_dev
```

**Option 2 - [Supabase](https://supabase.com) (Gratuit):**
- Créer un projet → Copier la connection string

**Option 3 - [Railway](https://railway.app) (Gratuit):**
- Add PostgreSQL → Copier `DATABASE_URL`

### Redis (Optionnel)

**Option 1 - Docker:**
```bash
docker run --name swipe-redis -p 6379:6379 -d redis:alpine
# REDIS_URL=redis://localhost:6379
```

**Option 2 - [Upstash](https://upstash.com) (Gratuit):**
- Créer une base Redis → Copier l'URL

**Si non configuré:** Cache in-memory utilisé automatiquement ✅

### Sentry (Optionnel)

1. [sentry.io](https://sentry.io) → Créer 2 projets:
   - **swipe-movie-api** (Node.js)
   - **swipe-movie-web** (Next.js)
2. Copier les DSN de chaque projet

**Si non configuré:** Monitoring désactivé, pas d'impact ✅

## 🚀 Configuration Rapide

### Développement

```bash
# 1. Copier les exemples
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 2. Éditer apps/api/.env
# - Configurer DATABASE_URL (PostgreSQL)
# - Ajouter TMDB_API_KEY
# - (Optionnel) REDIS_URL

# 3. Éditer apps/web/.env.local
# - Ajouter GOOGLE_CLIENT_ID
# - Ajouter GOOGLE_CLIENT_SECRET

# 4. Setup database
cd apps/api
npx prisma migrate dev
npx prisma generate

# 5. Lancer l'application
npm run dev  # À la racine du projet
```

### Production

**Variables à changer OBLIGATOIREMENT:**
- `NODE_ENV=production`
- `WEB_ORIGIN` → URL production
- `API_ORIGIN` → URL production
- `NEXTAUTH_URL` → URL production
- `JWT_SECRET` → Générer avec: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NEXTAUTH_SECRET` → Générer avec: `openssl rand -base64 32`
- `DATABASE_URL` → Base de données production
- `GOOGLE_CLIENT_ID/SECRET` → Credentials production (avec redirect URI prod)

## ⚙️ Paramètres Avancés

### Connection Pooling PostgreSQL

Dans `DATABASE_URL`, paramètres recommandés:

```
?connection_limit=20&pool_timeout=10&connect_timeout=5
```

- **connection_limit**:
  - Dev: 10 connexions
  - Prod: 20 connexions
- **pool_timeout**: Timeout pour obtenir une connexion (10s)
- **connect_timeout**: Timeout connexion DB (5s)

### Variables Sentry pour CI/CD

Si vous utilisez Sentry avec upload de source maps:

```env
# API & Web
SENTRY_ORG=votre-organisation
SENTRY_PROJECT=nom-du-projet
SENTRY_AUTH_TOKEN=votre-token  # Settings → Auth Tokens
```

## ✅ Vérification

```bash
# API
cd apps/api
npm run start:dev
# → Devrait démarrer sur http://localhost:3001

# Web
cd apps/web
npm run dev
# → Devrait démarrer sur http://localhost:3000

# Tester l'authentification Google
# → Aller sur http://localhost:3000 et se connecter
```

## 🔐 Sécurité

**IMPORTANT:**
- ❌ Ne JAMAIS commit les fichiers `.env` dans Git
- ✅ Utiliser des secrets forts en production
- ✅ Changer tous les secrets par défaut
- ✅ Restreindre les CORS (`WEB_ORIGIN`)
- ✅ Rotation des secrets tous les 90 jours

## 🆘 Problèmes Courants

**"Connection refused" (Database)**
→ Vérifier que PostgreSQL tourne: `docker ps` ou `pg_isready`

**"Invalid client" (Google OAuth)**
→ Vérifier les redirect URIs dans Google Console

**"TMDb API key invalid"**
→ Vérifier la clé sur [TMDb settings](https://www.themoviedb.org/settings/api)

**Redis ne se connecte pas**
→ Pas grave, fallback in-memory activé automatiquement

## 📚 Ressources

- [README.md](./README.md) - Installation complète
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guide développeur
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [TMDb API Docs](https://developers.themoviedb.org)
