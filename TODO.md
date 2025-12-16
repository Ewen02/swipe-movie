# TODO - Swipe Movie

> Dernière mise à jour: 14 Décembre 2024

---

## ✅ Phase 1 - SaaS Foundation (Terminé)

- [x] **Chantier 0**: Optimisation Monorepo - Migration vers `@swipe-movie/ui`
- [x] **Chantier 1**: Stripe Customer Portal Route (`POST /subscriptions/portal`)
- [x] **Chantier 2**: Feature Gating complet (rooms, swipes, participants)
- [x] **Chantier 3**: Dashboard Subscription (`/dashboard/subscription`)
- [x] **Feature Flag**: `ENABLE_SUBSCRIPTION_LIMITS` (défaut: false pour PMF)

---

## ✅ Phase 3 - Features Concurrentielles (Terminé)

> Inspiré de l'analyse concurrentielle (Queue, Matched, Letterboxd)
> Voir [docs/COMPETITOR_ANALYSIS.md](docs/COMPETITOR_ANALYSIS.md)

### Quick Wins - Fun Factor

| Feature | Statut | Fichiers |
|---------|--------|----------|
| **QR Code invitation** | ✅ | `ShareRoomButton.tsx` + `react-qr-code` |
| **Trailers YouTube** | ✅ | `MovieDetailsModal.tsx` (iframe YouTube) |
| **Spinner (roue)** | ✅ | `FortuneWheel` dans `@swipe-movie/ui` |
| **Share match** | ✅ | `ShareMatchButton.tsx` (Web Share API + réseaux sociaux) |

---

## ✅ Phase 4 - PWA Optimisation (Terminé)

### Service Worker (Serwist)
- [x] Cache offline des images TMDB (30 jours)
- [x] Cache API avec Network First (5 min)
- [x] Push notifications setup
- [x] Fichier: `apps/web/src/app/sw.ts`

### Installation & UX
- [x] Bannière "Ajouter à l'écran d'accueil" (`PWAInstallBanner.tsx`)
- [x] Hook `usePWAInstall.ts` (détection iOS/Android)
- [x] Support iOS avec instructions Safari

---

## 🔲 Phase 2 - Infrastructure (~29h)

### Chantier 4: Email System (Resend) - 15h

- [ ] Créer module email NestJS
  - `apps/api/src/modules/email/email.module.ts`
  - `apps/api/src/modules/email/email.service.ts`
- [ ] Templates React Email
  - `templates/trial-ending.tsx` - Fin d'essai
  - `templates/payment-failed.tsx` - Échec paiement
  - `templates/subscription-confirmed.tsx` - Confirmation abo
  - `templates/match-notification.tsx` - Notification match
- [ ] Intégrer avec webhooks Stripe
- [ ] Config: `RESEND_API_KEY` dans `.env`
- [ ] Tests

### Chantier 5: RGPD Compliance - 14h

#### Cookie Consent Banner (3h)
- [ ] `apps/web/src/components/gdpr/CookieConsent.tsx`
- [ ] `apps/web/src/hooks/useCookieConsent.ts`
- [ ] Ajouter dans layout.tsx

#### API Export/Delete User (6h)
- [ ] `apps/api/src/modules/users/users.module.ts`
- [ ] `apps/api/src/modules/users/users.service.ts`
- [ ] `apps/api/src/modules/users/users.controller.ts`
- [ ] `GET /users/me/export` - Export JSON données
- [ ] `DELETE /users/me` - Suppression compte + cascade Stripe

#### Page Settings (5h)
- [ ] `apps/web/src/app/[locale]/(protected)/settings/page.tsx`
- [ ] `ProfileSection.tsx` - Infos profil
- [ ] `DataSection.tsx` - Export/delete
- [ ] `DangerZone.tsx` - Zone danger

---

## 🔲 Phase 6 - Intégrations Externes (NOUVEAU - Feedback Testeurs)

> Basé sur le feedback des testeurs : algo de recommandation, connexion loggers externes

### Intégration Loggers (Trakt + AniList)

| Feature | Effort | Description |
|---------|--------|-------------|
| **Schema Prisma UserMediaLibrary** | 1h | Modèle pour stocker watchlist/watched importés |
| **Types partagés** | 0.5h | `packages/types/src/external-services.ts` |
| **Module Trakt.tv** | 4h | OAuth + sync watchlist/watched + mapping TMDB |
| **Module AniList** | 4h | OAuth + GraphQL + mapping TMDB |
| **Page Connexions Profil** | 2h | UI `/profile/connections` |
| **Callback OAuth** | 1h | Page `/auth/[provider]/callback` |

### Algorithme de Recommandation

| Feature | Effort | Description |
|---------|--------|-------------|
| **Module Recommandations** | 3h | Service de scoring et tri |
| **Exclusion films vus** | 1h | Filtrer films déjà vus par le groupe |
| **Priorisation watchlist commune** | 1h | Films dans watchlist de tous en premier |
| **Badges "Déjà vu"** | 1h | Indicateurs sur cartes swipe |

### Multi-sources Notes (Optionnel)

| Feature | Effort | Description |
|---------|--------|-------------|
| **Module OMDB** | 2h | IMDb + Rotten Tomatoes + Metacritic |
| **Affichage multi-notes** | 1h | UI pour afficher plusieurs sources |

**Total Phase 6** : ~16h

---

## 🔲 Phase 5 - Engagement (Stretch Goals)

| Feature | Effort | Description |
|---------|--------|-------------|
| **Badges utilisateur** | 8h | Gamification (10 rooms, 100 swipes...) |
| **Historique swipes** | 6h | Voir ses swipes passés |
| **Room vocale** | 40h | WebRTC audio pendant session |
| **Réactions live** | 16h | Emojis temps réel via WebSocket |
| **Watchlist perso** | 12h | Sauvegarder films hors room |
| **Swipes enrichis** | 4h | 4 types : intéressé / pas intéressé / vu aimé / vu pas aimé |
| **Historique détaillé room** | 4h | Voir qui a swipé quoi |
| **Support flèches clavier** | 2h | Navigation clavier pour swipe |

---

## 📊 Résumé par Phase

| Phase | Description | Effort | Statut |
|:-----:|-------------|-------:|:------:|
| 1 | SaaS Foundation | 46.5h | ✅ |
| 3 | Features Concurrentielles | 12h | ✅ |
| 4 | PWA Optimisation | 8h | ✅ |
| 2 | Infrastructure (Email + RGPD) | 29h | 🔲 |
| **6** | **Intégrations Externes (Trakt/AniList)** | **16h** | **✅** |
| 5 | Engagement (Stretch) | 90h | 🔲 |

---

## 🎯 Prochaine priorité

### Phase 6 - Intégrations Externes (Feedback Testeurs) ✅
1. [x] Schema Prisma `UserMediaLibrary` + migration
2. [x] Types partagés `external-services.ts`
3. [x] Module Trakt.tv (OAuth + sync)
4. [x] Module AniList (OAuth + GraphQL)
5. [x] Page `/connections`
6. [x] Module Recommandations (scoring + exclusion)
7. [x] Badges "Déjà vu" sur cartes

### Phase 2 - Infrastructure (Après Phase 6)
1. [ ] Email System (Resend) - 15h
2. [ ] RGPD Cookie Banner - 3h
3. [ ] Page Settings avec export/delete - 11h

---

## 💡 Notes

### Ce qu'on ne fait PAS (pour l'instant)
- ❌ Watchlist complète (Queue le fait mieux)
- ❌ Tracking épisodes/séries (TV Time le fait mieux)
- ❌ App native (PWA suffit pour PMF)
- ❌ Calendrier sorties (pas prioritaire)

### Notre différenciateur
> **Swipe Movie** = Sessions temps réel en groupe
>
> Les concurrents (Queue, Matched) font du swipe **asynchrone**.
> Nous sommes les seuls à faire du swipe **synchrone en room**.

### Fichiers créés cette session
- `packages/ui/src/organisms/fortune-wheel.tsx` - Composant roue de la fortune
- `apps/web/src/app/sw.ts` - Service Worker Serwist
- `apps/web/src/hooks/usePWAInstall.ts` - Hook installation PWA
- `apps/web/src/components/pwa/PWAInstallBanner.tsx` - Bannière installation
