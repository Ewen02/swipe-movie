# 🚀 Roadmap SaaS - Swipe Movie

**Document créé le** : 25 novembre 2024
**Stratégie** : Lancement Gratuit → Premium TMDB Commercial
**Objectif Année 1** : ~8,000€ de revenus, 100+ abonnés payants

---

## 📋 RÉSUMÉ EXÉCUTIF

### Stratégie en 2 Phases

**Phase 1 (8-10 semaines)** : Lancement gratuit + infrastructure premium
- Garder TMDB gratuit (légal en non-commercial)
- Implémenter toute l'infrastructure d'abonnements
- Architecture API abstraite (prête pour TMDB commercial ou OMDb)
- Validation product-market fit : **500-1000 utilisateurs gratuits**

**Phase 2 (après validation)** : Activation premium TMDB
- Souscrire TMDB Commercial (149$/mois)
- Activer les abonnements Stripe
- Objectif : **30-50 abonnés payants en 3 mois** = rentabilité

---

## 💰 MODÈLE DE PRICING

### Tiers d'Abonnement

#### 🆓 FREE - "Casual Watchers"
**Prix** : 0€/mois
**Cible** : Utilisateurs individuels et petits groupes d'amis

**Fonctionnalités** :
- ✅ Maximum 3 rooms actives
- ✅ Jusqu'à 4 participants par room
- ✅ 20 films par session de swipe
- ✅ Données basiques (titre, poster, note, synopsis)
- ✅ Rooms expirent après 7 jours
- ✅ Notifications de match standard
- ⚠️ Attribution TMDB requise

---

#### 💎 STARTER - "Movie Buffs"
**Prix** : 4.99€/mois ou 49€/an (17% de réduction)
**Cible** : Utilisateurs réguliers et petits groupes

**Fonctionnalités** :
- ✅ Tout de FREE, plus :
- ✅ Rooms illimitées
- ✅ Jusqu'à 8 participants par room
- ✅ 50 films par session de swipe
- ✅ Données étendues (cast, crew, trailers, disponibilité streaming)
- ✅ Rooms expirent après 30 jours
- ✅ Notifications email pour les matchs
- ✅ Historique des rooms (10 dernières sessions)
- ✅ Support prioritaire

---

#### 🌟 PRO - "Social Cinephiles" [TIER PRINCIPAL]
**Prix** : 9.99€/mois ou 89€/an (26% de réduction)
**Cible** : Utilisateurs actifs et grands groupes d'amis

**Fonctionnalités** :
- ✅ Tout de STARTER, plus :
- ✅ Participants illimités par room
- ✅ 100 films par session de swipe
- ✅ Filtres avancés (décennie, combinaisons de genres, notes min, durée)
- ✅ Rooms illimitées dans le temps
- ✅ Templates de room (sauvegarder configurations favorites)
- ✅ Analytics avancés (profils de goûts du groupe, statistiques de match)
- ✅ Thèmes et arrière-plans personnalisés
- ✅ Export des listes de matchs
- ✅ Intégrations WhatsApp/Discord pour notifications
- ✅ Expérience sans publicité

---

#### 👥 TEAM - "Cinema Clubs"
**Prix** : 19.99€/mois ou 179€/an (25% de réduction)
**Cible** : Clubs de cinéma, familles, créateurs de contenu

**Fonctionnalités** :
- ✅ Tout de PRO, plus :
- ✅ Jusqu'à 5 comptes utilisateurs inclus
- ✅ Gestion partagée des rooms
- ✅ Dashboard analytics avancé
- ✅ Accès API (limité)
- ✅ Partage de room en white-label
- ✅ Options de branding personnalisé
- ✅ Soirées cinéma programmées (intégration calendrier)
- ✅ Demandes de fonctionnalités prioritaires
- ✅ Canal de support dédié

---

## 🏗️ PHASE 1 : INFRASTRUCTURE & VALIDATION

**Durée** : 8-10 semaines
**Budget** : ~150€ (hosting uniquement)
**Objectif** : 500-1000 utilisateurs gratuits avec engagement élevé

### Semaine 1-2 : Fondations Légales & Paiements

#### Juridique (PRIORITÉ CRITIQUE)
- [ ] **Privacy Policy** RGPD-compliant
  - Utiliser générateur + adaptation manuelle
  - Mentionner usage TMDB API
  - Droits utilisateurs (accès, export, suppression données)
  - Politique cookies
- [ ] **Terms of Service**
  - Conditions d'utilisation gratuite
  - Conditions d'abonnement (prêtes mais inactives en Phase 1)
  - Politique de remboursement
  - Limitation de responsabilité
  - Droit applicable (France/UE)
- [ ] **Cookie Consent**
  - Intégrer solution (Cookiebot/Osano)
  - Contrôles granulaires (analytics, marketing)
  - Conformité RGPD
- [ ] **Flows RGPD**
  - Export complet des données utilisateur (JSON)
  - Suppression de compte avec cascade
  - Droit à l'oubli

#### Setup Stripe
- [ ] Créer compte Stripe (mode test)
- [ ] Configurer produits et prix :
  - FREE (0€) - tier par défaut
  - STARTER (4.99€/mois, 49€/an)
  - PRO (9.99€/mois, 89€/an) - Badge "Most Popular"
  - TEAM (19.99€/mois, 179€/an)
- [ ] Configurer webhook endpoint (`/api/webhooks/stripe`)
- [ ] Générer clés API test
- [ ] Tester Customer Portal Stripe

---

### Semaine 3-4 : Architecture API Abstraite

#### Objectif
Créer une architecture découplée permettant de switcher facilement entre TMDB et OMDb (ou autre provider)

#### Backend - Abstraction Layer (NestJS)

**Fichiers à créer** :
```
apps/api/src/movies/
├── interfaces/
│   └── movie-provider.interface.ts    # Interface IMovieProvider
├── providers/
│   ├── tmdb.provider.ts              # Implémentation TMDB (actuel)
│   └── omdb.provider.ts              # Implémentation OMDb (skeleton)
├── movies.module.ts                   # Factory pattern
└── movies.service.ts                  # Utilise IMovieProvider
```

**Interface IMovieProvider** :
```typescript
export interface IMovieProvider {
  discover(params: DiscoverParams): Promise<Movie[]>
  getDetails(id: string): Promise<MovieDetails>
  search(query: string): Promise<Movie[]>
  getGenres(): Promise<Genre[]>
}
```

**Configuration** :
- Variable d'environnement : `MOVIE_API_PROVIDER=tmdb` (ou `omdb`)
- Factory pattern dans `movies.module.ts`
- Switch transparent pour le reste de l'application

**Tâches** :
- [ ] Créer interface `IMovieProvider`
- [ ] Refactorer code TMDB actuel en `TMDBProvider`
- [ ] Créer `OMDbProvider` skeleton (non utilisé en Phase 1)
- [ ] Implémenter factory avec variable env
- [ ] Tester que TMDB fonctionne toujours
- [ ] Documenter procédure de switch

---

### Semaine 5-6 : Système d'Abonnements

#### Database Schema (Prisma)

**Nouveau modèle Subscription** :
```prisma
model Subscription {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Stripe
  stripeCustomerId       String?   @unique
  stripeSubscriptionId   String?   @unique
  stripePriceId          String?
  stripeCurrentPeriodEnd DateTime?

  // Plan
  plan      SubscriptionPlan   @default(FREE)
  status    SubscriptionStatus @default(ACTIVE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([plan])
  @@index([status])
}

enum SubscriptionPlan {
  FREE
  STARTER
  PRO
  TEAM
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
  INCOMPLETE
}
```

**Migration User** :
```prisma
model User {
  // ... champs existants
  subscription Subscription?
}
```

#### Backend - SubscriptionModule (NestJS)

**Structure** :
```
apps/api/src/subscription/
├── subscription.module.ts
├── subscription.service.ts
├── subscription.controller.ts
├── stripe-webhook.controller.ts
├── guards/
│   └── subscription.guard.ts
└── dto/
    ├── create-subscription.dto.ts
    └── update-subscription.dto.ts
```

**SubscriptionService** :
- [ ] `createSubscription()` - Créer abonnement Stripe
- [ ] `updateSubscription()` - Mettre à jour plan
- [ ] `cancelSubscription()` - Annuler abonnement
- [ ] `getSubscription()` - Récupérer abonnement utilisateur
- [ ] `checkFeatureAccess(user, feature)` - Vérifier accès feature

**StripeWebhookController** :
- [ ] Vérification signature Stripe
- [ ] Handler `checkout.session.completed`
- [ ] Handler `customer.subscription.updated`
- [ ] Handler `customer.subscription.deleted`
- [ ] Handler `invoice.payment_failed`
- [ ] Handler `invoice.payment_succeeded`
- [ ] Idempotence (éviter double traitement)

**SubscriptionGuard** :
- [ ] Décorateur `@RequiresPlan(SubscriptionPlan.PRO)`
- [ ] Vérification plan utilisateur
- [ ] Réponse 403 si accès refusé

**JWT Payload** :
- [ ] Ajouter `subscription.plan` au JWT
- [ ] Ajouter `subscription.status` au JWT

#### Frontend - Pages & Components (Next.js)

**Pages** :
- [ ] `/pricing` - Page publique de pricing
  - Afficher 4 tiers avec features
  - Badge "Most Popular" sur PRO
  - Boutons CTA **désactivés** en Phase 1
  - Message "Coming soon - Join waitlist"
  - Responsive design
  - Animations Framer Motion

- [ ] `/dashboard/subscription` - Page protégée gestion abonnement
  - Afficher plan actuel avec badge
  - Afficher date de renouvellement
  - Bouton "Manage Subscription" (Stripe Customer Portal)
  - Bouton "Upgrade" (vers /pricing)
  - Historique de facturation

**Components** :
- [ ] `<UpgradePrompt />` - Modal réutilisable
  - Afficher pricing dans modal
  - CTA vers /pricing
  - Fermeture facile (X, clic extérieur, ESC)

- [ ] `<PlanBadge />` - Badge plan utilisateur
  - FREE, STARTER, PRO, TEAM
  - Couleurs différentes par tier

- [ ] `<FeatureGate />` - Composant pour feature gating
  - Affiche upgrade prompt si non autorisé
  - Wrapper autour de features premium

**Hooks** :
- [ ] `useSubscription()` - Hook pour récupérer subscription
- [ ] `useFeatureAccess(feature)` - Hook pour vérifier accès

---

### Semaine 7 : Feature Gating & Limits

#### Implémenter les Limites par Tier

**FREE Tier Limits** :
- [ ] Max 3 rooms actives par utilisateur
  - Vérifier dans `createRoom()`
  - Message : "Upgrade to Starter for unlimited rooms"

- [ ] Max 4 participants par room
  - Vérifier dans `joinRoom()`
  - Message : "Upgrade to Pro for unlimited participants"

- [ ] Max 20 films par session de swipe
  - Compteur frontend
  - Message après 20e swipe : "Upgrade for unlimited swipes"

- [ ] Rooms expirent après 7 jours
  - Cron job pour marquer rooms comme expirées
  - Soft delete (`deletedAt`)

- [ ] Données basiques uniquement
  - Pas de trailers, pas de streaming availability
  - Pas de filtres avancés

**Upgrade Prompts Stratégiques** :

Triggers :
- [ ] Tentative création 4ème room → Modal "Upgrade to Starter"
- [ ] Tentative invitation 5ème participant → Modal "Upgrade to Pro"
- [ ] Après 20 swipes dans session → Modal "Upgrade for unlimited"
- [ ] Accès filtre avancé → Modal "Upgrade to Pro"
- [ ] Tentative export matchs → Modal "Upgrade to Pro"

Design :
- [ ] Non intrusif (peut fermer facilement)
- [ ] Afficher bénéfices upgrade
- [ ] CTA clair "Upgrade Now" / "Maybe Later"

**Analytics Tracking** :
- [ ] Event : `upgrade_prompt_shown` (feature, tier_required)
- [ ] Event : `upgrade_prompt_clicked` (feature, tier_selected)
- [ ] Event : `upgrade_prompt_dismissed`
- [ ] Event : `feature_limit_hit` (feature, current_tier)
- [ ] Event : `pricing_page_visited` (source)

---

### Semaine 8 : Emails & Communication

#### Email Infrastructure

**Setup** :
- [ ] Créer compte SendGrid ou Resend
- [ ] Configurer domaine (SPF, DKIM, DMARC)
- [ ] Vérifier domaine
- [ ] Créer templates HTML responsive
- [ ] Tester envoi emails

**Templates Phase 1 (Gratuit)** :

1. **Welcome Email** (envoi immédiat après signup)
   - Sujet : "Bienvenue sur Swipe Movie 🎬"
   - Guide démarrage rapide
   - Lien vers créer première room
   - Lien vers demo vidéo

2. **Onboarding Sequence** :
   - **J+1** : "Comment ça marche" (guide détaillé)
   - **J+3** : "Conseils pour obtenir plus de matchs"
   - **J+7** : "Découvrez toutes les fonctionnalités"

3. **Notifications Transactionnelles** :
   - Nouveau match trouvé (email + push)
   - Invitation à rejoindre une room
   - Room expirée (rappel)

**Templates Phase 2 (Premium) - Préparés mais non utilisés** :

4. **Subscription Emails** :
   - Subscription confirmed
   - Payment successful
   - Payment failed (retry)
   - Subscription canceled (feedback)
   - Renewal reminder (3 jours avant)

5. **Marketing Emails** :
   - Feature highlight (nouvelles fonctionnalités)
   - Upgrade offer (discount limité)
   - Win-back campaign (utilisateurs inactifs)

**Service Email** :
- [ ] Créer `EmailService` dans NestJS
- [ ] Méthodes : `sendWelcome()`, `sendMatchNotification()`, etc.
- [ ] Queue pour envois asynchrones (Bull/Redis)

---

### Semaine 9-10 : Testing & Soft Launch

#### Testing Complet

**Tests Unitaires** :
- [ ] SubscriptionService tests
- [ ] Feature gating logic tests
- [ ] Webhook handlers tests (mock Stripe)

**Tests E2E** :
- [ ] Flow complet pricing page
- [ ] Feature gates fonctionnent
- [ ] Upgrade prompts s'affichent correctement
- [ ] Webhooks Stripe (test mode)

**Tests Manuels** :
- [ ] Créer compte → voir FREE tier
- [ ] Hit limite 3 rooms → voir upgrade prompt
- [ ] Hit limite 4 participants → voir upgrade prompt
- [ ] Navigation pricing page
- [ ] Email delivery (tous templates)

#### Soft Launch Beta

**Déploiement** :
- [ ] Déployer en production
- [ ] Mode : Tout gratuit, infra premium dormante
- [ ] Monitoring actif (Sentry)
- [ ] Analytics actifs (PostHog)

**Beta Testing** :
- [ ] Inviter 50-100 beta testeurs
  - Amis, famille
  - Communautés en ligne (Reddit, Discord)
  - Early adopters

**Collecte Feedback** :
- [ ] Questionnaire satisfaction (Google Forms / Typeform)
  - NPS score
  - Features les plus appréciées
  - Features manquantes
  - Willingness to pay

- [ ] Sessions feedback 1-on-1 (5-10 users)
  - Observation usage
  - Questions ouvertes
  - Test pricing perception

- [ ] Analytics comportement
  - Quelles features utilisées le plus
  - Taux de création rooms
  - Taux de match
  - Retention J1, J7, J30

**Itération Rapide** :
- [ ] Fixer bugs critiques immédiatement
- [ ] Améliorer UX points de friction
- [ ] Ajuster messaging si confusion

#### Métriques de Validation Phase 1

**Objectifs** (tous requis pour passer Phase 2) :

✅ **500+ utilisateurs inscrits** en 3 mois
✅ **Rétention >20% à J7** (users reviennent après 7 jours)
✅ **>50% users créent 2+ rooms** (engagement réel)
✅ **Feedback positif** (NPS >30)
✅ **Demandes features premium** (dans feedback/support)

**Métriques à Tracker** :
- Signups quotidiens/hebdo/mensuels
- Daily/Weekly/Monthly Active Users (DAU/WAU/MAU)
- Retention curves (J1, J3, J7, J14, J30)
- Rooms créées par jour
- Participants moyens par room
- Matches trouvés par jour
- Taux de match par room
- Feature limit hits (signaux d'upgrade)
- Upgrade prompt CTR
- Pricing page visits
- Time to first room (<5 min idéal)

**Dashboards** :
- [ ] Créer dashboard Metabase/PostHog
- [ ] Graphiques clés visibles en temps réel

---

## 🎯 PHASE 2 : ACTIVATION PREMIUM

**Trigger** : Toutes les métriques de validation Phase 1 atteintes

### Semaine 1 Phase 2 : Souscription TMDB Commercial

#### Contractuel
- [ ] Contacter TMDB : api@themoviedb.org
- [ ] Expliquer projet et revenus estimés
- [ ] Souscrire plan Commercial (149$/mois)
  - Confirmation revenus <1M$ annuels
  - Confirmation users <2M
- [ ] Obtenir clés API commerciales
- [ ] Signer accord si nécessaire

#### Technique
- [ ] Remplacer `TMDB_API_KEY` dans .env
- [ ] Vérifier que tout fonctionne (aucun changement code)
- [ ] Tester quotas et rate limits
- [ ] Configurer monitoring API usage

**Note** : Grâce à l'architecture abstraite, aucun changement de code nécessaire !

---

### Semaine 2 Phase 2 : Activation Stripe Production

#### Stripe Live Mode
- [ ] Basculer compte Stripe en mode LIVE
- [ ] Re-configurer webhooks en production
- [ ] Tester webhooks avec Stripe CLI
- [ ] Vérifier Customer Portal fonctionne
- [ ] Tester un paiement réel (petit montant)

#### Activation Frontend
- [ ] Retirer message "Coming soon" de `/pricing`
- [ ] Activer tous les boutons "Subscribe"
- [ ] Activer Stripe Checkout flows
- [ ] Activer accès Stripe Customer Portal
- [ ] Vérifier redirections après paiement

#### Tests Pré-Launch
- [ ] Tester flow complet Starter subscription
- [ ] Tester flow complet Pro subscription
- [ ] Tester flow complet Team subscription
- [ ] Tester upgrade Starter → Pro
- [ ] Tester downgrade Pro → Starter
- [ ] Tester annulation subscription
- [ ] Tester renouvellement automatique
- [ ] Tester payment failed scenario

---

### Semaine 3 Phase 2 : Communication Launch

#### Email aux Beta Users
- [ ] Rédiger email d'annonce
  - "We're going live! 🚀"
  - Remerciements beta testers
  - Présentation des tiers
  - **Offre spéciale launch** : -20% premier mois
  - Code promo : `BETA20`
  - Expiration : 14 jours

- [ ] Envoyer à tous beta users
- [ ] Tracking open rate / click rate

#### Marketing Launch
- [ ] Post réseaux sociaux
  - LinkedIn (professionnel)
  - Twitter/X (tech community)
  - Instagram/TikTok (grand public)
  - Facebook groups (ciné clubs)

- [ ] Product Hunt launch
  - Préparer page produit
  - Screenshots/GIFs
  - Hunter sponsor si possible
  - Launch mardi-jeudi (meilleurs jours)

- [ ] Reddit posts (règles communautés)
  - r/SideProject
  - r/startups
  - r/movies (avec permission mods)

- [ ] Communities Discord/Slack
  - Groupes tech/startup
  - Groupes cinéma

---

### Mois 1-3 Phase 2 : Croissance & Optimisation

#### Objectifs Quantitatifs
- [ ] **30-50 abonnés payants** en 3 mois
- [ ] **300-500$ MRR** (Monthly Recurring Revenue)
- [ ] **Conversion 3-5%** free → paid
- [ ] **Churn <5%** mensuel
- [ ] **CAC <20€** (Cost Acquisition Customer)

#### Optimisation Conversion

**A/B Testing** :
- [ ] Test messaging upgrade prompts (2 versions)
- [ ] Test pricing page layout (2 versions)
- [ ] Test CTA buttons colors/text
- [ ] Test discount offers (10% vs 20% vs free month)

**Amélioration Funnel** :
- [ ] Analyser drop-off points
- [ ] Améliorer onboarding (time to value)
- [ ] Simplifier checkout (moins de clics)
- [ ] Ajouter social proof (testimonials)
- [ ] Ajouter trust signals (sécurité paiement)

**Exit-Intent** :
- [ ] Popup exit-intent sur pricing page
- [ ] Offre last-minute (20% off)
- [ ] "Wait! Get your first month for just 3.99€"

#### Marketing Croissance

**Content Marketing** :
- [ ] Blog posts SEO
  - "Comment choisir un film en groupe"
  - "Top 10 films [genre] à regarder entre amis"
  - "Alternative à Netflix roulette"

- [ ] Optimisation SEO
  - Mots-clés : "what to watch", "movie picker", "group decision"
  - Backlinks
  - Guest posts

**Referral Program** :
- [ ] Implémenter système de parrainage
- [ ] "Give 5€, Get 5€" (crédit abonnement)
- [ ] Page dédiée `/refer`
- [ ] Tracking referral codes

**Partnerships** :
- [ ] Contacter ciné-clubs
- [ ] Contacter associations étudiantes
- [ ] Offres groupes (discount Team tier)

**Ads (si budget)** :
- [ ] Google Ads (mots-clés intent)
- [ ] Facebook Ads (lookalike audiences)
- [ ] Budget : 100-300€/mois test

---

## 📊 MÉTRIQUES DE SUCCÈS

### Phase 1 : Validation (Mois 1-3)

**Objectifs** :
| Métrique | Objectif | Excellent |
|----------|----------|-----------|
| Signups | 500+ | 1000+ |
| Retention J7 | >20% | >30% |
| Users 2+ rooms | >50% | >70% |
| NPS | >30 | >50 |
| Upgrade prompt CTR | 5% | 10% |

**Tracking** :
- Dashboard temps réel (PostHog)
- Rapports hebdomadaires
- Reviews utilisateurs

---

### Phase 2 : Monétisation (Mois 4-6)

**Objectifs** :
| Métrique | Objectif | Excellent |
|----------|----------|-----------|
| Abonnés payants | 30-50 | 70-100 |
| MRR | 300-500€ | 700€+ |
| Conversion | 3-5% | 6-8% |
| Churn mensuel | <5% | <3% |
| LTV/CAC | >3 | >5 |

**Seuil de Rentabilité** :
```
Coûts mensuels :
- TMDB API : 140€
- Hosting : 50-100€
- Email service : 20€
- Stripe fees : ~3% revenus
Total fixe : ~210€

Revenus minimum pour rentabilité :
- 25 Starter (4.99€) = 124.75€ ❌
- 13 Pro (9.99€) = 129.87€ ❌
- 7 Team (19.99€) = 139.93€ ❌
- Mix réaliste : 10 Starter + 15 Pro + 3 Team = 259.80€ ✅

Objectif conservateur (40 payants mix) : ~350€ MRR
Marge : ~140€ (40%)
```

---

## 💰 PROJECTIONS FINANCIÈRES

### Scénario Conservateur

| Phase | Période | Users | Payants | MRR | Coûts | Profit |
|-------|---------|-------|---------|-----|-------|--------|
| **Phase 1** | Mois 1-3 | 500 | 0 | 0€ | 50€/mois | -150€ |
| **Phase 2 M1** | Mois 4 | 600 | 18 | 140€ | 190€ | -50€ |
| **Phase 2 M2** | Mois 5 | 800 | 28 | 235€ | 190€ | +45€ ✅ |
| **Phase 2 M3** | Mois 6 | 1000 | 40 | 350€ | 190€ | +160€ |
| **Mois 9** | Croissance | 2000 | 80 | 700€ | 220€ | +480€ |
| **Mois 12** | Fin Année 1 | 3000 | 150 | 1200€ | 250€ | +950€ |

**Année 1 Total** :
- Revenus cumulés : ~8,000€
- Coûts cumulés : ~2,400€
- **Profit net : ~5,600€**

### Scénario Optimiste

| Phase | Période | Users | Payants | MRR | Profit |
|-------|---------|-------|---------|-----|--------|
| Phase 1 | Mois 1-3 | 1000 | 0 | 0€ | -150€ |
| Phase 2 M1 | Mois 4 | 1200 | 48 | 400€ | +210€ |
| Phase 2 M2 | Mois 5 | 1500 | 75 | 650€ | +460€ |
| Phase 2 M3 | Mois 6 | 2000 | 100 | 850€ | +660€ |
| Mois 12 | Fin Année 1 | 5000 | 300 | 2500€ | +2250€ |

**Année 1 Total** :
- Revenus : ~15,000€
- **Profit : ~10,000€**

---

## 🎯 CHOIX TECHNIQUES FINAUX

### Stack API Movies

**Phase 1** : TMDB Free (non-commercial)
- Coût : 0€
- Usage : Beta gratuite uniquement
- Légal : ✅ Conforme ToS

**Phase 2** : TMDB Commercial
- Coût : 149$/mois (~140€)
- Usage : SaaS commercial complet
- Légal : ✅ Licence payante

**Fallback** : OMDb si besoin
- Coût : 10$/mois (~9€)
- Architecture abstraite prête pour switch

### Stack Paiements

**Provider** : Stripe
- Frais : 2.9% + 0.30€ par transaction
- Gestion TVA : Manuel (calcul seulement)
- Customer Portal : Inclus
- Webhooks : Robustes

**Alternative Phase 2+** : Paddle (Merchant of Record)
- Frais : 5% + 0.50€
- Gestion TVA : Automatique (27 pays UE)
- Moins de complexité légale
- À évaluer si revenus >10k€/mois

### Stack Emails

**Phase 1** : Resend (recommandé)
- Gratuit : 100 emails/jour
- Simple, moderne, bon DX
- Parfait pour démarrage

**Phase 2** : SendGrid si volume élevé
- Gratuit : 100 emails/jour
- Payant : à partir de 14.95$/mois
- Plus robuste, plus de features

### Hosting

**Frontend** : Vercel
- Free tier généreux
- Deploy automatique
- Edge functions

**Backend** : Railway ou Render
- ~10-20€/mois
- Managed PostgreSQL inclus
- Auto-scaling

**Database** : Neon ou Supabase
- Free tier : 0.5GB storage
- Payant : ~10-20€/mois
- Managed Postgres

**Redis** : Upstash
- Free tier : 10k commands/jour
- Payant : ~3€/mois si besoin

---

## 📋 CHECKLIST PRÉ-LAUNCH PREMIUM

### Légal ✅

- [ ] Privacy Policy publiée et accessible
- [ ] Terms of Service publiés et accessibles
- [ ] Cookie consent actif et fonctionnel
- [ ] RGPD data export fonctionne
- [ ] RGPD data deletion fonctionne
- [ ] TMDB Commercial souscrit et actif
- [ ] Mentions légales complètes

### Technique ✅

- [ ] Stripe production configuré
- [ ] Webhooks Stripe testés et fonctionnels
- [ ] Customer Portal Stripe accessible
- [ ] Feature gates implémentés et testés
- [ ] Upgrade prompts fonctionnels
- [ ] Emails transactionnels opérationnels
- [ ] API abstraite prête (switch possible)
- [ ] Monitoring actif (Sentry)
- [ ] Analytics actif (PostHog)
- [ ] Backups database automatiques

### Business ✅

- [ ] ≥500 users beta validés
- [ ] Métriques engagement positives
  - Retention J7 >20%
  - 50%+ créent 2+ rooms
- [ ] Feedback qualitatif bon (NPS >30)
- [ ] Pricing testé et validé
- [ ] Communication launch prête
  - Email sequence
  - Social media posts
  - Product Hunt page
- [ ] Support client prêt (email/chat)

---

## 🚀 PROCHAINES ÉTAPES IMMÉDIATES

### Cette Semaine (Semaine 1)

**Lundi** :
- [ ] Créer compte Stripe (test mode)
- [ ] Commencer Privacy Policy (template)

**Mardi** :
- [ ] Terminer Privacy Policy
- [ ] Commencer Terms of Service (template)

**Mercredi** :
- [ ] Terminer Terms of Service
- [ ] Designer page `/pricing` (Figma ou direct)

**Jeudi** :
- [ ] Setup cookie consent (Cookiebot)
- [ ] Commencer schema Prisma Subscription

**Vendredi** :
- [ ] Terminer schema Prisma
- [ ] Créer migration database
- [ ] Review semaine et planifier Semaine 2

### Semaine Prochaine (Semaine 2)

**Lundi-Mardi** :
- [ ] Créer architecture API abstraite
  - Interface IMovieProvider
  - TMDBProvider refactor
  - OMDbProvider skeleton

**Mercredi-Jeudi** :
- [ ] Implémenter SubscriptionModule NestJS
  - Service, Controller, Guards
  - Webhooks Stripe

**Vendredi** :
- [ ] Créer page `/pricing` Next.js
- [ ] Créer composant `<UpgradePrompt />`

---

## 📚 RESSOURCES & DOCUMENTATION

### Légal
- [Privacy Policies Generator](https://www.privacypolicies.com/)
- [Termly ToS Generator](https://termly.io/)
- [GDPR Checklist](https://gdpr.eu/checklist/)
- [Cookiebot](https://www.cookiebot.com/)

### Technique
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Vercel Next.js Subscription Template](https://github.com/vercel/nextjs-subscription-payments)
- [NestJS Stripe Tutorial](https://dev.to/slaknoah/seamless-payment-processing-with-stripe-and-nestjs-3cbg)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

### Marketing
- [Product Hunt Launch Checklist](https://www.producthunt.com/posts/product-hunt-launch-guide)
- [SaaS Marketing Playbook](https://www.cobloom.com/blog/saas-marketing-strategy)
- [Conversion Rate Optimization](https://www.crazyegg.com/blog/conversion-rate-optimization/)

### Analytics
- [PostHog Docs](https://posthog.com/docs)
- [SaaS Metrics Guide](https://www.cobloom.com/blog/saas-metrics)

---

## 🎉 CONCLUSION

Cette roadmap représente un plan réaliste et détaillé pour transformer Swipe Movie en SaaS rentable.

**Points Clés** :
✅ Approche progressive (gratuit → payant)
✅ Validation avant investissement
✅ Architecture flexible (TMDB ↔ OMDb)
✅ Coûts maîtrisés (<200€/mois Phase 2)
✅ Objectifs atteignables (5-10k€ Année 1)

**Success Factors** :
1. 🎯 **Focus product-market fit** avant monétisation
2. 🎯 **Expérience utilisateur** excellente (onboarding <5min)
3. 🎯 **Upgrade prompts stratégiques** (non intrusifs)
4. 🎯 **Viral growth loops** (invite friends = core value)
5. 🎯 **Data-driven decisions** (A/B testing, analytics)

**Prêt à démarrer !** 🚀

---

*Document vivant - Mis à jour régulièrement avec progrès et apprentissages*
