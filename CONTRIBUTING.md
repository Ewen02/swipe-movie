# Guide de Contribution

Merci de votre intérêt pour contribuer à Swipe Movie ! Ce document explique comment participer au projet.

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Configurer l'environnement](#configurer-lenvironnement)
- [Standards de code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Rapporter des bugs](#rapporter-des-bugs)
- [Proposer des features](#proposer-des-features)

## Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :

- Être respectueux et inclusif
- Accepter les critiques constructives
- Se concentrer sur ce qui est meilleur pour la communauté
- Faire preuve d'empathie envers les autres membres

## Comment contribuer

### Types de contributions

Nous acceptons plusieurs types de contributions :

1. **🐛 Bug fixes** - Corriger des bugs existants
2. **✨ Features** - Ajouter de nouvelles fonctionnalités
3. **📝 Documentation** - Améliorer la documentation
4. **🎨 UI/UX** - Améliorations d'interface
5. **⚡ Performance** - Optimisations
6. **♿ Accessibilité** - Améliorations a11y
7. **🌐 i18n** - Traductions

### Workflow

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Créer** une branche pour votre contribution
4. **Implémenter** vos changements
5. **Tester** vos modifications
6. **Commit** avec des messages clairs
7. **Push** vers votre fork
8. **Ouvrir** une Pull Request

## Configurer l'environnement

### Prérequis

- Node.js 20+
- npm 10+
- PostgreSQL 14+
- Redis (optionnel)
- Git

### Installation

```bash
# Clone le repository
git clone https://github.com/YOUR_USERNAME/swipe-movie.git
cd swipe-movie

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Éditer les fichiers .env avec vos credentials
```

### Configuration Database

```bash
# Depuis apps/api
cd apps/api

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# (Optionnel) Seed la base
npx prisma db seed
```

### Lancer le projet

```bash
# Terminal 1 - API
cd apps/api
npm run start:dev

# Terminal 2 - Web
cd apps/web
npm run dev
```

Accéder à :
- Web : http://localhost:3000
- API : http://localhost:3001
- Swagger : http://localhost:3001/docs

## Standards de code

### TypeScript

```typescript
// ✅ Bon
interface UserDto {
  id: string;
  email: string;
  name?: string;
}

function createUser(data: UserDto): Promise<User> {
  // Implementation
}

// ❌ Mauvais
function createUser(data: any) {
  // Pas de types
}
```

### React Components

```typescript
// ✅ Bon - Composant fonctionnel avec types
interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export function Card({ title, description, onClick }: CardProps) {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

// ❌ Mauvais - Props sans types
export function Card({ title, description, onClick }) {
  // ...
}
```

### NestJS Services

```typescript
// ✅ Bon
@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<RoomDto> {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    return room;
  }
}

// ❌ Mauvais - Pas de gestion d'erreur
async findById(id: string) {
  return this.prisma.room.findUnique({ where: { id } });
}
```

### Commits

Format : `<type>(<scope>): <description>`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, missing semi colons, etc.
- `refactor`: Refactoring de code
- `perf`: Amélioration de performance
- `test`: Ajout/modification de tests
- `chore`: Maintenance, dependencies, etc.

Exemples :
```
feat(rooms): add advanced filtering options
fix(websocket): handle reconnection edge case
docs(api): update swagger documentation
perf(cache): implement Redis caching layer
```

### Code Style

```bash
# Formattage automatique
npm run format

# Linting
npm run lint

# Type checking
npm run type-check
```

## Processus de Pull Request

### Avant de soumettre

- [ ] Le code compile sans erreur
- [ ] Les tests passent (si présents)
- [ ] Le code est linté et formatté
- [ ] La documentation est à jour
- [ ] Les commits suivent la convention
- [ ] La branche est à jour avec `main`

### Checklist PR

Votre PR doit inclure :

- [ ] **Titre clair** : Résumé de ce qui est changé
- [ ] **Description** : Pourquoi et comment
- [ ] **Screenshots** : Si changements UI
- [ ] **Tests** : Instructions de test manuel
- [ ] **Breaking changes** : Documenter les changements cassants
- [ ] **Documentation** : Mise à jour si nécessaire

### Template PR

```markdown
## Description
Brève description de ce qui a été changé et pourquoi.

## Type de changement
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Comment tester
1. Étape 1
2. Étape 2
3. Résultat attendu

## Screenshots (si applicable)
[Ajouter screenshots]

## Checklist
- [ ] Code compilé et testé localement
- [ ] Documentation mise à jour
- [ ] Pas de console.log ou debugger
- [ ] Code linté et formatté
```

### Review Process

1. **Automatic checks** : CI doit passer
2. **Code review** : Au moins 1 approbation
3. **Discussion** : Répondre aux commentaires
4. **Merge** : Squash and merge préféré

## Rapporter des bugs

### Avant de rapporter

1. Vérifier les [issues existantes](https://github.com/YOUR_USERNAME/swipe-movie/issues)
2. Tester avec la dernière version
3. Isoler le problème

### Template Bug Report

```markdown
**Description**
Description claire et concise du bug.

**To Reproduce**
Étapes pour reproduire :
1. Aller sur '...'
2. Cliquer sur '...'
3. Scroller jusqu'à '...'
4. Voir l'erreur

**Expected behavior**
Comportement attendu.

**Screenshots**
Si applicable, ajouter des screenshots.

**Environment:**
 - OS: [e.g. macOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Tout autre contexte utile.
```

## Proposer des features

### Template Feature Request

```markdown
**Is your feature request related to a problem?**
Description claire du problème.

**Describe the solution you'd like**
Solution proposée.

**Describe alternatives you've considered**
Alternatives envisagées.

**Additional context**
Screenshots, mockups, etc.
```

### Discussion

Les features majeures doivent être discutées dans une issue avant implémentation.

## Guidelines spécifiques

### Sécurité

- **Ne jamais commit** de secrets/credentials
- **Utiliser** des variables d'environnement
- **Valider** tous les inputs utilisateur
- **Sanitizer** les données sensibles dans les logs
- **Rapporter** les vulnérabilités en privé

### Performance

- **Optimiser** les requêtes database
- **Utiliser** le cache quand approprié
- **Lazy load** les composants lourds
- **Minimiser** les bundle sizes
- **Profiler** avant d'optimiser

### Accessibilité

- **Utiliser** des labels sémantiques
- **Tester** avec lecteur d'écran
- **Respecter** les contrastes WCAG
- **Support** navigation clavier
- **Aria** attributes quand nécessaire

### Tests

```typescript
// Example test structure
describe('RoomsService', () => {
  describe('create', () => {
    it('should create a room with valid data', async () => {
      // Arrange
      const data = { name: 'Test Room', type: 'MOVIE' };

      // Act
      const room = await service.create(data);

      // Assert
      expect(room).toBeDefined();
      expect(room.name).toBe(data.name);
    });

    it('should throw error with invalid data', async () => {
      // Arrange
      const data = { name: '', type: 'INVALID' };

      // Act & Assert
      await expect(service.create(data)).rejects.toThrow();
    });
  });
});
```

## Questions ?

- **Discussions** : [GitHub Discussions](https://github.com/YOUR_USERNAME/swipe-movie/discussions)
- **Discord** : [Lien Discord] (si disponible)
- **Email** : contact@swipe-movie.com

## Licence

En contribuant, vous acceptez que vos contributions soient sous la même licence que le projet.

## Remerciements

Merci à tous les contributeurs qui aident à améliorer Swipe Movie ! 🎉
