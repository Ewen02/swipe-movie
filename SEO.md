# SEO & GEO — Swipe Movie

État de la stratégie de référencement (Google + moteurs de réponse IA) et kit
d'acquisition de backlinks.

URL canonique : `https://swipe-movie.com`
Tagline de marque (à réutiliser partout pour la cohérence) :
**"Swipe with friends to decide what movie to watch — no install, free"**

---

## État de la stratégie (ce qui est fait)

**Technique / GEO**
- Crawlers IA explicitement autorisés dans `robots.ts` (GPTBot, CCBot, PerplexityBot,
  ClaudeBot, Google-Extended, Bingbot…).
- `/llms.txt` (route `app/llms.txt/route.ts`) qui résume le produit pour les moteurs IA.
- Metadata homepage des 5 langues réécrites « intention-first » (« quel film regarder ce soir »).
- FAQPage JSON-LD sur /contact, pages contexte, plateforme, genre, comparatif.
- Combos provider×genre en `noindex` (thin/duplicate) + retirés du sitemap.

**Contenu programmatique**
- 18 pages **genre** étoffées (sections éditoriales + FAQ).
- 8 pages **plateforme** étoffées (idem).
- 15 pages **contexte** (dont `quoi-regarder-ce-soir`, `film-pour-pleurer`, etc.) avec
  cross-linking vers genres/plateformes.
- 3 pages **comparatif** (`/comparatif/[slug]`) + 1 **guide pilier**
  (`/guide/choisir-un-film-a-plusieurs`, 1500+ mots/langue).
- Maillage interne : bloc « Découvrir » dans le footer + sitemap à jour.

**Diagnostic Search Console (juin 2026)** : on rankait sur des requêtes floues à
0 clic (`swipe`, `swipe film`). Le travail vise à capter l'intention réelle
(« quel film regarder ce soir », « que regarder sur Netflix », « film à deux »).

**Concurrents identifiés** (apps « Tinder pour films ») : Matched, Movie Swiper,
Taste, Movie Night, Chewsr. Notre angle : web sans install, multilingue, gratuit,
à plusieurs (pas que couple).

**Prochain levier #1 = backlinks (ci-dessous).** C'est l'autorité de domaine qui
plafonne le ranking maintenant, pas la technique. Product Hunt est déjà fait.

---

# Kit Backlinks

---

## 1. AlternativeTo (alternativeto.net) — PRIORITÉ HAUTE

Backlink dofollow de qualité + trafic ciblé. Crée un compte → "Submit an application".

- **Name** : Swipe Movie
- **URL** : https://swipe-movie.com
- **Tagline** : Swipe with friends to decide what movie to watch — no install, free
- **Description** :
  > Swipe Movie is a free web app that helps groups, couples and families decide what to watch. Start a room, share a link, and everyone swipes through movies Tinder-style. When everyone likes the same title, it's an instant match — no debate. Works in the browser (no app to install), covers Netflix, Prime Video, Disney+, Max and more, and is available in 5 languages.
- **Alternative à** : Matched, Movie Swiper, Taste, Likewise, JustWatch
- **Tags** : movie-recommendation, streaming, decision-making, collaborative, web-app, free
- **Platforms** : Web, Android (PWA), iPhone (PWA)

---

## 2. Reddit — PRIORITÉ HAUTE (règles strictes)

⚠️ Ne spamme pas de lien promo direct → ban. Apporte de la valeur d'abord, mentionne l'outil quand c'est pertinent. Construis du karma.

### r/movies, r/NetflixBestOf, r/MovieSuggestions
Réponds aux "what should I watch tonight" avec une vraie suggestion + mention naturelle :
> If you can never agree with whoever you're watching with, I've been using a thing where everyone swipes on movies and you get a match when you both like the same one — way less arguing.

### r/SideProject, r/InternetIsBeautiful, r/webdev (post de lancement OK)
**Titre** : I built a free web app to stop the "what should we watch" debate — everyone swipes, you match on a movie
**Corps** :
> My partner and I wasted 30 min every movie night arguing. So I built Swipe Movie: you start a room, share a link, everyone swipes Tinder-style, and it matches you on a film you all like. No app to install, free, works on any device. Built with Next.js. Feedback welcome! [link]

### r/coolgithubprojects, r/nextjs (angle technique)
"Built a collaborative movie-matching PWA with Next.js — here's how the real-time matching works"

---

## 3. Annuaires produits/startups — PRIORITÉ MOYENNE (dofollow faciles)

| Site | URL |
|---|---|
| BetaList | betalist.com |
| SaaSHub | saashub.com |
| Uneed | uneed.best |
| Fazier | fazier.com |
| Peerlist Launchpad | peerlist.io |
| G2 / Capterra | si B2B (autorité forte, plus long) |

---

## 4. Contenu & niche — LES MEILLEURS LIENS

- **Listicles** : Google `"apps to decide what to watch" 2026` → email aux auteurs pour être ajouté (backlink contextuel = le plus puissant).
- **TikTok / YT Shorts** : le créneau "Tinder for movies" cartonne en vidéo. Un créateur lifestyle qui démo = trafic + mentions.
- **Quora / forums** : réponds à "How do my partner and I decide what to watch?" avec valeur + mention.

---

## 5. Ordre d'attaque (1ère semaine)

1. AlternativeTo (1 fiche) — 15 min
2. SaaSHub + BetaList + Uneed — 30 min
3. 1 post r/SideProject — 10 min
4. Chercher 5 listicles "best movie picker apps" + 5 emails de demande d'ajout — 30 min
