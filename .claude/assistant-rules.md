# Règles pour l'Assistant

Ce document définit les règles strictes que l'assistant doit suivre lors du travail sur ce projet.

## ⛔ Interdictions Absolues

### Commits
- **JAMAIS** mentionner "Claude Code" dans les commits
- **JAMAIS** ajouter de signature "Generated with Claude Code"
- **JAMAIS** ajouter "Co-Authored-By: Claude <noreply@anthropic.com>"
- Les commits doivent sembler écrits par un développeur humain

### Code
- **JAMAIS** ajouter d'emojis dans le code sauf si explicitement demandé
- **JAMAIS** créer de fichiers documentation (.md) sans demande explicite
- **JAMAIS** ajouter de commentaires excessifs

## ✅ Format de Commit Standard

### Template de Base

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Exemple Simple

```
feat: add room invitation system
```

### Exemple Complet

```
feat: add comprehensive room invitation system

Implemented a complete invitation system with multiple sharing options.

Features:
- Share room link with one-click copy to clipboard
- Share room code for manual entry
- QR code generation for mobile scanning
- Native share API integration for mobile devices
- Modal dialog with all sharing options

Components:
- New ShareRoomButton component with dialog UI
- Integrated into room detail page
- Added to rooms list for quick sharing
- Export barrel for room components

UX Improvements:
- Click-to-copy for both URL and code
- Visual feedback with checkmarks
- Toggle QR code display
- Native share on mobile (WhatsApp, Messages, etc.)
- Responsive design for all screen sizes

Dependencies:
- Added react-qr-code for QR generation

This addresses the highest priority feature (RICE score: 240) for
enabling viral growth through easy room sharing.
```

### Footer Autorisé

Seules ces mentions sont autorisées dans le footer:

```
BREAKING CHANGE: description du breaking change

Fixes #123
Closes #456
Refs: #789
```

## 📝 Style de Code

### Commentaires
- Minimiser les commentaires
- Préférer le code auto-documenté
- Les commentaires doivent expliquer le "pourquoi" pas le "comment"

### Nommage
- Variables: camelCase
- Fonctions: camelCase
- Classes: PascalCase
- Constantes: UPPER_SNAKE_CASE
- Fichiers: kebab-case.ts ou PascalCase.tsx (composants React)

### TypeScript
- Toujours typer explicitement les paramètres de fonction
- Éviter `any`, utiliser `unknown` si nécessaire
- Préférer les types aux interfaces sauf pour extension

## 🗂️ Organisation des Fichiers

### Structure
- Préférer éditer des fichiers existants plutôt que créer de nouveaux
- Ne pas créer de README.md sans demande
- Ne pas créer de documentation non demandée

### Imports
- Grouper les imports: externes, puis internes, puis relatifs
- Utiliser des alias path (`@/...`) quand disponibles

## 🔧 Workflow Git

### Avant de Commit
1. Vérifier que le code compile (`tsc --noEmit`)
2. Vérifier que le build passe (`npm run build`)
3. S'assurer que les tests passent (si applicables)

### Message de Commit
1. Type en anglais (`feat`, `fix`, etc.)
2. Subject en français, impératif présent
3. Body en français avec structure Markdown
4. **AUCUNE** mention de Claude/IA
5. Maximum 72 caractères pour le subject

### Commits Atomiques
- Un commit = une responsabilité
- Le code doit compiler après chaque commit
- Préférer plusieurs petits commits qu'un gros

## 📊 Bonnes Pratiques

### Performance
- Utiliser React.memo() pour composants coûteux
- Utiliser useCallback/useMemo intelligemment
- Optimiser les images (next/image)
- Lazy loading quand approprié

### Sécurité
- Valider toutes les entrées utilisateur
- Éviter XSS, SQL injection, etc.
- Ne jamais logger de données sensibles
- Utiliser HTTPS en production

### Tests
- Écrire des tests pour nouvelle logique métier
- Pattern AAA (Arrange, Act, Assert)
- Noms de tests descriptifs
- Mocker les dépendances externes

## 🎯 Priorités

1. **Sécurité**: Toujours en premier
2. **Fonctionnalité**: Le code doit marcher
3. **Performance**: Optimiser si nécessaire
4. **DX**: Expérience développeur
5. **UX**: Expérience utilisateur

## 🚫 Anti-patterns à Éviter

### Code
```typescript
// ❌ Mauvais
const data: any = await fetch()

// ✅ Bon
const data: User = await fetch()
```

### Commits
```
❌ "fix stuff"
❌ "WIP"
❌ "update"
❌ "feat: Add New Feature With Claude Code"

✅ "fix(api): handle null values in filters"
✅ "feat: add email notifications"
✅ "refactor: extract validation logic"
```

### Fichiers
```
❌ Créer README.md sans demande
❌ Ajouter TODO.md spontanément
❌ Créer CONTRIBUTING.md sans contexte

✅ Éditer les fichiers existants
✅ Créer seulement ce qui est demandé
✅ Demander avant de créer de la doc
```

## 🎨 Style UI/UX

### Composants
- Utiliser shadcn/ui pour la cohérence
- Responsive mobile-first
- Accessibilité (ARIA labels, keyboard nav)
- Dark mode par défaut

### Messages Utilisateur
- En français
- Concis et clairs
- Ton professionnel mais friendly
- Éviter le jargon technique

## 📱 Spécificités Projet

### Swipe Movie
- Monorepo: apps/web (Next.js) + apps/api (NestJS)
- Base de données: PostgreSQL + Prisma
- Auth: NextAuth.js (Google OAuth)
- Cache: Redis (optionnel)
- Real-time: Socket.IO
- Monitoring: Sentry

### Conventions Projet
- Messages en français
- Composants React en PascalCase
- API endpoints en kebab-case
- Variables d'env en UPPER_SNAKE_CASE

## 🔄 Checklist Avant Commit

- [ ] Code compile sans erreur TypeScript
- [ ] Pas de console.log() oublié
- [ ] Format de commit respecté
- [ ] **AUCUNE mention de Claude/IA**
- [ ] Subject <= 72 caractères
- [ ] Message en français (sauf keywords)
- [ ] Commit atomique
- [ ] Tests passent (si applicables)

## 📚 Ressources

- Convention de commits: `.github/COMMIT_CONVENTION.md`
- Architecture: `ARCHITECTURE.md`
- Tests: `TESTING.md`
- Contribution: `CONTRIBUTING.md`

## 🎯 Objectif Principal

**Produire du code et des commits qui ressemblent à ceux d'un développeur humain professionnel, sans aucune trace d'assistance IA.**
