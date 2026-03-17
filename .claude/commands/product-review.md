Run an interactive product review for the Swipe Movie project.

If `$ARGUMENTS` is provided, focus the review on that aspect. Valid focus areas: `personas`, `roadmap`, `gaps`, `metrics`, `tech-debt`. If no argument, run the full review.

---

## Phase 1 — Scan automatique du projet

Gather project state by reading these files and running these commands **in parallel** (use Explore agents):

**Agent 1 — Project docs & schema:**
- Read `docs/PRODUCT_ROADMAP.md` (etat actuel, recommandations)
- Read `docs/ROADMAP.md` (roadmap technique)
- Read `packages/database/prisma/schema.prisma` (data model)
- Read `packages/subscription/` (plans, limites, features par plan)

**Agent 2 — Code surface (API + Web):**
- List all API modules: `ls apps/api/src/modules/`
- List all web pages: find all `page.tsx` files in `apps/web/src/app/`
- List all hooks: `ls apps/web/src/hooks/`
- List all UI components: `ls packages/ui/src/`
- List web components: `ls apps/web/src/components/`

**Agent 3 — Activity & quality:**
- `git log --oneline -30` (recent activity)
- `git log --oneline --since="2 weeks ago" --format="%h %s"` (recent focus)
- Check test coverage: count test files in `apps/api/`, `apps/web/`, `packages/`
- Check for TODO/FIXME/HACK comments in source code
- Check `apps/web/src/i18n/messages/` for translation completeness

From this scan, build an internal map of:
- All implemented features (modules, pages, endpoints)
- Data model entities and their relationships
- Subscription plans and their limits
- Test coverage level
- Recent development focus areas

---

## Phase 2 — Questions interactives

Use `AskUserQuestion` to ask the user the following questions. Adapt the questions based on Phase 1 findings. Ask all questions in a **single** AskUserQuestion call with multiple questions.

### Questions obligatoires :

1. **Objectif court terme** — "Quel est ton objectif principal a court terme ?"
   Options: Lancement beta prive, Demo investisseur/incubateur, Premiers users payants, Proof of concept technique, Autre (preciser)

2. **Timeline** — "Quel est ton horizon de temps pour cet objectif ?"
   Options: 2 semaines, 1 mois, 3 mois, Pas de deadline fixe

3. **Personas prioritaires** — "Qui sont tes premiers utilisateurs cibles ?"
   Options (multi-select): Couples/amis proches, Colocs/groupes d'amis, Familles, Communautes en ligne (Discord, Reddit), Autre (preciser)

4. **Retours existants** — "As-tu deja des retours utilisateurs ou des pain points identifies ?"
   Free text

### Questions conditionnelles (selon focus `$ARGUMENTS`) :

- Si `personas` : "Decris un use case concret pour ton persona principal — combien de personnes, quel contexte (soiree, weekend, quotidien) ?"
- Si `roadmap` : "Y a-t-il des features que tes premiers users ont explicitement demandees ?"
- Si `metrics` : "Quels KPIs veux-tu suivre pour valider le product-market fit ?"
- Si `tech-debt` : "Y a-t-il des parties du code qui te causent des problemes regulierement ?"
- Si `gaps` : "Quels concurrents as-tu identifies et quelles features te semblent manquantes par rapport a eux ?"

---

## Phase 3 — Analyse et synthese

Croiser les donnees du scan (Phase 1) avec les reponses du user (Phase 2) pour produire l'analyse suivante.

### 3.1 Maturite produit

Evaluer sur cette grille :
| Critere | MVP | Beta | Production |
|---------|-----|------|------------|
| Auth complete | OAuth basique | + email/password + reset | + SSO, 2FA |
| Core swipe | like/dislike basique | + undo, bookmarks, filtres | + algo ML, trending |
| Rooms | creation/join | + edit, archive, templates | + rooms publiques, moderation |
| Matches | detection basique | + partage, commentaires | + notifications push, digest |
| Integrations | TMDB | + Trakt, AniList | + Letterboxd, JustWatch API |
| Paiement | non | Stripe checkout | + usage-based, invoicing |
| Tests | < 30% | > 60% | > 80% + E2E |
| Monitoring | logs basiques | structured logging + Sentry | + APM, alerting, dashboards |
| i18n | 1 langue | 2 langues | 5+ langues |
| PWA | manifest basique | + install banner | + push notifs, offline |

### 3.2 Mapping Personas → Features

Pour chaque persona identifie en Phase 2, lister :
- Les features existantes qui le servent directement
- Les gaps critiques (ce qui manque pour qu'il puisse utiliser le produit)
- Les nice-to-have (ameliorations qui augmentent la valeur)

### 3.3 Roadmap recommandee

Basee sur :
- La timeline du user
- Les personas prioritaires
- Les gaps critiques identifies
- L'effort estime par feature (S/M/L/XL)

Organiser en sprints de 1-2 semaines, ordonnes par impact.

### 3.4 Risques et dette

Identifier :
- Risques techniques (scaling, deps obsoletes, securite)
- Risques produit (features manquantes pour le persona cible)
- Dette technique accumulee (code quality, tests, docs)

---

## Phase 4 — Rapport structure

Presenter le rapport dans ce format exact :

```markdown
# Point Produit Swipe Movie — YYYY-MM-DD

## Maturite globale : [MVP | Beta avancee | Production-ready]

Score : X/10 criteres au niveau Beta ou superieur

---

## Ce qui est livre

| Feature | Statut | Persona impacte | Notes |
|---------|--------|-----------------|-------|
| ... | OK / Partiel / Manquant | ... | ... |

---

## Personas

| Persona | Priorite | Features existantes | Gaps critiques | Score couverture |
|---------|----------|--------------------|----|------|
| ... | P0/P1/P2 | ... | ... | X% |

---

## Horizon produit

### Sprint suivant (2 semaines) — Focus: [theme]
| Tache | Effort | Impact | Persona |
|-------|--------|--------|---------|
| ... | S/M/L | Critique/Haut/Moyen | ... |

### Moyen terme (1-2 mois)
| Tache | Effort | Impact | Persona |
|-------|--------|--------|---------|
| ... | ... | ... | ... |

### Long terme (3+ mois)
- ...

---

## Quick wins (effort S, impact haut)
1. ...
2. ...
3. ...

## Risques
| Risque | Severite | Mitigation |
|--------|----------|------------|
| ... | Critique/Haut/Moyen | ... |

## Recommandations strategiques
1. ...
2. ...
3. ...
```

---

## Regles

- Toujours baser l'analyse sur le code reel (scan Phase 1), pas sur des hypotheses
- Ne pas inventer des features qui n'existent pas dans le code
- Etre honnete sur les gaps — le but est d'aider, pas de flatter
- Adapter le langage au profil du user (technique si dev, business si fondateur)
- Si `$ARGUMENTS` est fourni, le rapport complet est genere mais la section correspondante est detaillee en profondeur
- Le rapport doit etre actionnable : chaque recommandation doit etre concrete et faisable
