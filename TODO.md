# TODO - Swipe Movie SaaS Phase 1

## ✅ Terminé

- [x] **Chantier 0**: Optimisation Monorepo - Migration vers `@swipe-movie/ui`
- [x] **Chantier 1**: Stripe Customer Portal Route (`POST /subscriptions/portal`)
- [x] **Chantier 2**: Feature Gating complet (rooms, swipes, participants)
- [x] **Chantier 3**: Dashboard Subscription (`/dashboard/subscription`)
- [x] **Feature Flag**: `ENABLE_SUBSCRIPTION_LIMITS` (défaut: false)

---

## 🔲 Reste à faire (~29h)

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

## 📊 Résumé

| Statut | Chantier | Effort |
|:------:|----------|-------:|
| ✅ | Optimisation Monorepo | 16h |
| ✅ | Stripe Customer Portal | 2h |
| ✅ | Feature Gating | 12h |
| ✅ | Dashboard Subscription | 16h |
| ✅ | Feature Flag Limits | 0.5h |
| 🔲 | **Email System (Resend)** | **15h** |
| 🔲 | **RGPD Compliance** | **14h** |
| | **TOTAL RESTANT** | **~29h** |
