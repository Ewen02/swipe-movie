# 🎬 Swipe Movie

> Découvrez votre prochain film à regarder en swipant avec vos amis. Un système de match intelligent pour trouver le film parfait qui plaira à tout le monde.

[![CI](https://github.com/YOUR_USERNAME/swipe-movie/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/swipe-movie/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## ✨ Fonctionnalités

- 🎯 **Swipe de films** - Interface intuitive type Tinder pour découvrir des films
- 👥 **Rooms multi-utilisateurs** - Créez des sessions avec vos amis
- 🎊 **Système de match** - Trouvez automatiquement les films qui plaisent à tous
- 🎬 **Films et séries** - Découvrez des milliers de contenus via TMDb
- 🎨 **Filtres avancés** - Genre, note, année, durée, plateformes de streaming
- 🔔 **Real-time** - Notifications instantanées des matchs via WebSocket
- 🌓 **Dark/Light mode** - Interface adaptative
- 📱 **Responsive** - Optimisé mobile, tablette et desktop
- 🔐 **Authentification sécurisée** - Google OAuth via NextAuth
- ⚡ **Performance** - Cache Redis, optimisation images, connection pooling
- 📊 **Monitoring** - Sentry pour le tracking d'erreurs

## 🏗️ Architecture

### Stack Technique

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Socket.IO client
- NextAuth.js

**Backend**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis (optionnel)
- Socket.IO

**Infrastructure**
- Vercel (Web)
- GitHub Actions (CI/CD)
- Sentry (Monitoring)

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour plus de détails.

## 📦 Structure du Monorepo

```
swipe-movie/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend NestJS
├── .github/          # CI/CD workflows
├── docs/             # Documentation
└── package.json      # Workspace root
```

## 🚀 Installation

### Prérequis

- Node.js 20+
- npm 10+
- PostgreSQL 14+
- Redis (optionnel, fallback in-memory)
- Compte TMDb API (gratuit)
- Compte Google OAuth (pour l'authentification)

### Quick Start

1. **Cloner le repository**
```bash
git clone https://github.com/YOUR_USERNAME/swipe-movie.git
cd swipe-movie
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

**API** (`apps/api/.env`)
```bash
cp apps/api/.env.example apps/api/.env
```

Éditer `apps/api/.env` :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/swipe_movie
JWT_SECRET=your-secret-key
TMDB_API_KEY=your-tmdb-api-key
REDIS_URL=redis://localhost:6379  # Optionnel
```

**Web** (`apps/web/.env.local`)
```bash
cp apps/web/.env.example apps/web/.env.local
```

Éditer `apps/web/.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Configurer la base de données**
```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

5. **Lancer le projet**
```bash
# À la racine du projet
npm run dev
```

Accéder à :
- 🌐 Web : http://localhost:3000
- 🔌 API : http://localhost:3001
- 📖 Swagger : http://localhost:3001/docs

## 📝 Scripts Disponibles

### Root (workspace)
```bash
npm run dev          # Lance web + api en parallèle
npm run dev:web      # Lance uniquement le frontend
npm run dev:api      # Lance uniquement le backend
npm run build        # Build web + api
npm run lint         # Lint tous les packages
npm run format       # Format le code (Prettier)
```

### Database (apps/api)
```bash
npm run db:migrate   # Applique les migrations
npm run db:studio    # Ouvre Prisma Studio
npm run db:generate  # Génère le client Prisma
npm run db:reset     # Reset la database ⚠️
npm run db:seed      # Seed la database (si configuré)
```

## 🎯 Utilisation

1. **S'authentifier** avec Google OAuth
2. **Créer une room** ou rejoindre avec un code
3. **Configurer les filtres** (genre, note, année, etc.)
4. **Swiper les films** - ❤️ Like ou 👎 Pass
5. **Recevoir les matchs** - Notifications en temps réel quand tout le monde like

## 🔧 Configuration Avancée

### TMDb API

1. Créer un compte sur [The Movie Database](https://www.themoviedb.org/)
2. Aller dans **Settings → API**
3. Demander une clé API (gratuit)
4. Copier la clé dans `apps/api/.env`

### Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer **Google+ API**
4. Créer des credentials OAuth 2.0
5. Ajouter les redirects URIs :
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-domain.com/api/auth/callback/google` (prod)
6. Copier Client ID et Secret dans `apps/web/.env.local`

### Redis (Optionnel)

Pour activer le cache Redis :

```bash
# Via Docker
docker run -d -p 6379:6379 redis:alpine

# Ou installer localement
brew install redis  # macOS
redis-server
```

Puis configurer dans `.env` :
```env
REDIS_URL=redis://localhost:6379
```

Si Redis n'est pas disponible, l'app utilise un cache in-memory automatiquement.

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md) - Architecture détaillée du projet
- [Contributing](./CONTRIBUTING.md) - Guide de contribution
- [GitHub Actions](./.github/README.md) - CI/CD workflows
- [Secrets](./.github/SECRETS.md) - Configuration des secrets

## 🚀 Déploiement

### Web (Vercel)

1. Connecter le repo à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement sur push `main`

### API

Le projet supporte plusieurs options :

- **Railway** - Déploiement automatique
- **Render** - Free tier disponible
- **AWS/GCP** - Pour production scale

Voir [GitHub Actions](./.github/workflows/deploy.yml) pour la configuration.

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines détaillées.

## 📊 Roadmap

- [x] Swipe de films et séries
- [x] Rooms multi-utilisateurs
- [x] Filtres avancés
- [x] WebSocket real-time
- [x] Cache Redis
- [x] Error monitoring (Sentry)
- [x] CI/CD GitHub Actions
- [ ] Tests E2E (Playwright)
- [ ] Mode hors ligne
- [ ] Historique des matchs
- [ ] Recommandations personnalisées
- [ ] Support multi-langues (i18n)
- [ ] Application mobile (React Native)

## 🐛 Bugs connus

Voir les [Issues](https://github.com/YOUR_USERNAME/swipe-movie/issues) pour la liste complète.

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🙏 Remerciements

- [TMDb](https://www.themoviedb.org/) pour l'API de films
- [shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- Tous les [contributeurs](https://github.com/YOUR_USERNAME/swipe-movie/graphs/contributors)

## 📞 Contact

- **Email** : contact@swipe-movie.com
- **Twitter** : [@swipemovie](https://twitter.com/swipemovie)
- **Discord** : [Lien Discord](https://discord.gg/xxx)

---

Fait avec ❤️ par l'équipe Swipe Movie
