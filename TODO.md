# TODO - Swipe Movie

> Dernière mise à jour: 18 Décembre 2024

---

## 🔥 Bugs à corriger (Urgent)

- [ ] **Fix Light Mode** - Le thème clair n'est pas supporté correctement (30+ instances text-white hardcodé)
- [x] ~~**Filtrer films sans providers**~~ - Déjà implémenté via `with_watch_providers` dans TMDB API

## ⚠️ Comportements à clarifier (Trial)

- [ ] **Guests invités (orphelins)** — Quand Alice (guest) invite Bob via `/try/join/{code}`, Bob crée son propre guest user. Si Alice convertit son compte via Google sign-in, sa migration (`migrateGuestToUser`) ne migre que les rooms où elle est `createdBy`. Les memberships de Bob/Charlie dans la room d'Alice survivent (bien — ils restent dans la room après migration), MAIS leur user guest est wipé à T+24h par le cron `cleanupExpiredGuests` → ils perdent leur historique de swipes dans cette room.
  - **Options à arbitrer** :
    1. Proposer un "Save this room to your account" à Bob aussi (sur match ou à T+1h)
    2. Détecter les guests `members` (pas seulement `createdBy`) dans le cleanup et les protéger plus longtemps (par exemple 7 jours)
    3. Garder le comportement actuel mais documenter dans le copy ("Connecte-toi pour garder ton historique")
  - **À discuter** avec PM avant impl. Le cron logue déjà les guests "engaged" (>=5 swipes) supprimés (cf. `trial.service.ts cleanupExpiredGuests`) pour mesurer l'impact.

---

## ✅ Phase 1 - SaaS Foundation (Terminé)

- [x] **Chantier 0**: Optimisation Monorepo - Migration vers `@swipe-movie/ui`
- [x] **Chantier 1**: Stripe Customer Portal Route (`POST /subscriptions/portal`)
- [x] **Chantier 2**: Feature Gating complet (rooms, swipes, participants)
- [x] **Chantier 3**: Dashboard Subscription (`/dashboard/subscription`)
- [x] **Feature Flag**: `ENABLE_SUBSCRIPTION_LIMITS` (défaut: false pour PMF)

---

## ✅ Phase 2 - Infrastructure (Terminé)

### Chantier 4: Email System (Resend) ✅

- [x] Module email NestJS (`packages/email/` + `apps/api/src/modules/email/`)
- [x] Templates HTML (Welcome, Room Invite, Match Notification, Weekly Digest)
- [x] Email de bienvenue connecté à l'inscription
- [x] Config: `RESEND_API_KEY`
- [ ] Intégrer avec webhooks Stripe (trial-ending, payment-failed)

### Chantier 5: RGPD Compliance ✅

- [x] Cookie Consent Banner (`apps/web/src/components/gdpr/CookieConsent.tsx`)
- [x] ConditionalAnalytics - GA uniquement si consent
- [x] Lien "Gérer mes cookies" dans Footer
- [x] API Export/Delete User (`apps/api/src/modules/users/`)
- [x] Page Settings (`/settings`) avec export/delete compte

---

## ✅ Phase 3 - Features Concurrentielles (Terminé)

| Feature | Statut | Fichiers |
|---------|--------|----------|
| **QR Code invitation** | ✅ | `ShareRoomButton.tsx` + `react-qr-code` |
| **Trailers YouTube** | ✅ | `MovieDetailsModal.tsx` (iframe YouTube) |
| **Spinner (roue)** | ✅ | `FortuneWheel` dans `@swipe-movie/ui` |
| **Share match** | ✅ | `ShareMatchButton.tsx` (Web Share API + réseaux sociaux) |

---

## ✅ Phase 4 - PWA Optimisation (Terminé)

- [x] Service Worker Serwist (`apps/web/src/app/sw.ts`)
- [x] Cache offline des images TMDB (30 jours)
- [x] Cache API avec Network First (5 min)
- [x] Push notifications setup
- [x] Bannière "Ajouter à l'écran d'accueil" (`PWAInstallBanner.tsx`)
- [x] Support iOS avec instructions Safari

---

## ✅ Phase 6 - Intégrations Externes (Terminé)

### Intégration Loggers (Trakt + AniList)

- [x] Schema Prisma `UserMediaLibrary` + migration
- [x] Module Trakt.tv (OAuth + sync watchlist/watched)
- [x] Module AniList (OAuth + GraphQL + mapping TMDB)
- [x] Page `/connections`
- [x] Page `/library`
- [x] Page `/discover`

### Algorithme de Recommandation

- [x] Module Recommandations (scoring + cache 2min)
- [x] Exclusion films déjà vus par le groupe
- [x] Priorisation watchlist commune
- [x] Badges "Déjà vu" sur cartes swipe

---

## 🔲 Phase 5 - Engagement (Stretch Goals)

| Feature | Effort | Description |
|---------|--------|-------------|
| **Badges utilisateur** | 8h | Gamification (10 rooms, 100 swipes...) |
| **Room vocale** | 40h | WebRTC audio pendant session |
| **Réactions live** | 16h | Emojis temps réel via WebSocket |
| **Swipes enrichis** | 4h | 4 types : intéressé / pas intéressé / vu aimé / vu pas aimé |

---

## 📊 Résumé par Phase

| Phase | Description | Statut |
|:-----:|-------------|:------:|
| 1 | SaaS Foundation | ✅ |
| 2 | Infrastructure (Email + RGPD) | ✅ |
| 3 | Features Concurrentielles | ✅ |
| 4 | PWA Optimisation | ✅ |
| 6 | Intégrations Externes (Trakt/AniList) | ✅ |
| 5 | Engagement (Stretch) | 🔲 |

---

## 🎯 Prochaines priorités

1. [ ] **Fix Light Mode** - Corriger les couleurs hardcodées
2. [ ] **Ajouter Skeletons** - Pages settings, library, onboarding, connections
3. [ ] **Webhooks Stripe → Email** - Notifications trial/payment

---

## 💡 Notes

### Notre différenciateur
> **Swipe Movie** = Sessions temps réel en groupe
>
> Les concurrents (Queue, Matched) font du swipe **asynchrone**.
> Nous sommes les seuls à faire du swipe **synchrone en room**.

### Ce qu'on ne fait PAS (pour l'instant)
- ❌ Watchlist complète (Queue le fait mieux)
- ❌ Tracking épisodes/séries (TV Time le fait mieux)
- ❌ App native (PWA suffit pour PMF)
