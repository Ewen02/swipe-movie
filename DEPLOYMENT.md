# 🚀 Guide de Déploiement Swipe Movie

## Architecture de Production

```
Frontend (Next.js)  →  Vercel
Backend (NestJS)    →  Railway / Render
PostgreSQL          →  Neon / Supabase
Redis               →  Upstash
```

---

## 📋 Étapes de Déploiement

### 1. ✅ Frontend (Déjà fait sur Vercel)

Le frontend est déployé sur Vercel. Une fois les autres services configurés, il faudra mettre à jour les variables d'environnement.

---

### 2. 🗄️ PostgreSQL Database

**Option A: Neon** (Recommandé - Gratuit jusqu'à 3GB)

1. Va sur [neon.tech](https://neon.tech)
2. Créer un compte et un nouveau projet
3. Copie la **Connection String** (format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)
4. Garde cette URL pour l'étape backend

**Option B: Supabase**

1. Va sur [supabase.com](https://supabase.com)
2. New Project
3. Aller dans Settings > Database
4. Copier la "Direct Connection" string

---

### 3. 🔴 Redis Cache

**Upstash Redis** (Gratuit - 10,000 commandes/jour)

1. Va sur [upstash.com](https://upstash.com)
2. Create Database
3. Choose region (proche de ton backend)
4. Type: **Regional** (plus rapide)
5. Copie le **Redis URL** (format: `redis://default:password@region.upstash.io:6379`)

---

### 4. 🚂 Backend NestJS sur Railway

**Pourquoi Railway ?**
- Gratuit ($5/mois de crédit offert)
- Détecte automatiquement le Dockerfile
- Variables d'env faciles à gérer
- Logs en temps réel

**Étapes:**

1. **Créer un compte**
   - Va sur [railway.app](https://railway.app)
   - Sign up avec GitHub

2. **Nouveau projet**
   - New Project → Deploy from GitHub repo
   - Sélectionne `swipe-movie`
   - Root directory: **laisse vide** (le Dockerfile gère tout)

3. **Variables d'environnement** (Settings > Variables)

   ```bash
   PORT=3001
   DATABASE_URL=<colle la connection string Neon>
   REDIS_URL=<colle l'URL Upstash>
   JWT_SECRET=<génère un secret fort>
   TMDB_API_KEY=<ta clé TMDb>
   TMDB_API_URL=https://api.themoviedb.org/3
   WEB_ORIGIN=<ton URL Vercel, ex: https://swipe-movie.vercel.app>
   API_ORIGIN=<sera fourni par Railway après deploy>
   ```

4. **Générer un JWT_SECRET fort**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Deploy**
   - Railway va automatiquement détecter le Dockerfile
   - Attendre la fin du build
   - Récupérer l'URL publique (ex: `https://swipe-movie-production.up.railway.app`)

6. **Migrations**
   - Railway exécutera automatiquement `prisma migrate deploy` au démarrage
   - Vérifier les logs pour confirmer

---

### 5. 🔗 Mettre à jour Vercel

Une fois le backend déployé sur Railway:

1. Va dans **Vercel Dashboard** > Ton projet
2. Settings > Environment Variables
3. Ajoute/Update:
   ```bash
   NEXT_PUBLIC_API_URL=<URL Railway, ex: https://swipe-movie-production.up.railway.app>
   NEXTAUTH_URL=<ton URL Vercel>
   NEXTAUTH_SECRET=<génère un secret>
   GOOGLE_CLIENT_ID=<ton Google OAuth Client ID>
   GOOGLE_CLIENT_SECRET=<ton Google OAuth Secret>
   ```

4. **Générer NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

5. **Redéployer** (Deployments > ... > Redeploy)

---

## 🔐 Google OAuth Configuration

N'oublie pas d'ajouter tes URLs de production dans Google Cloud Console:

1. [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services > Credentials
3. Ton OAuth 2.0 Client
4. Ajouter dans **Authorized redirect URIs**:
   ```
   https://ton-app.vercel.app/api/auth/callback/google
   ```
5. Ajouter dans **Authorized JavaScript origins**:
   ```
   https://ton-app.vercel.app
   ```

---

## ✅ Checklist Finale

- [ ] PostgreSQL (Neon) configuré et accessible
- [ ] Redis (Upstash) configuré
- [ ] Backend déployé sur Railway
- [ ] Variables d'env Railway configurées
- [ ] Migrations Prisma exécutées
- [ ] Variables d'env Vercel mises à jour
- [ ] Google OAuth URLs de production ajoutées
- [ ] Frontend redéployé sur Vercel
- [ ] Test de connexion OAuth
- [ ] Test création de room
- [ ] Test swipe de films
- [ ] Test match en temps réel

---

## 🐛 Troubleshooting

### Backend ne démarre pas
- Vérifier les logs Railway
- Confirmer que `DATABASE_URL` est bien formatée
- Vérifier que Prisma migrations sont passées

### OAuth ne fonctionne pas
- Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
- Confirmer les redirect URIs dans Google Console
- Vérifier `WEB_ORIGIN` dans Railway

### Redis connection failed
- Vérifier format `REDIS_URL` (commence par `redis://`)
- Tester la connexion depuis Railway logs

### CORS errors
- Vérifier `WEB_ORIGIN` dans Railway
- Confirmer que NestJS CORS est activé pour ton domaine Vercel

---

## 📊 Monitoring

- **Railway**: Logs en temps réel dans le dashboard
- **Vercel**: Logs et analytics automatiques
- **Neon**: Database metrics dans le dashboard
- **Upstash**: Redis metrics et usage

---

## 💰 Coûts Estimés (Free Tier)

| Service   | Plan Gratuit | Limite |
|-----------|--------------|--------|
| Vercel    | Hobby        | 100GB bandwidth, builds illimités |
| Railway   | Trial        | $5/mois crédit, ~500h/mois |
| Neon      | Free         | 3GB storage, 1 projet |
| Upstash   | Free         | 10k commandes/jour |

**Total: $0/mois** (dans les limites free tier)

Une fois que tu dépasses, Railway sera ~$5-10/mois.

---

## 🔄 CI/CD (Automatique)

- **Vercel**: Auto-deploy sur push à `main`
- **Railway**: Auto-deploy sur push à `main`
- Prisma migrations automatiques au démarrage Railway

---

Besoin d'aide ? Vérifie les logs de chaque service !
