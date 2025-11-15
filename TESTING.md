# Guide de Tests

Ce document décrit l'infrastructure de tests mise en place pour le projet Swipe Movie.

## Vue d'ensemble

Le projet utilise :
- **Jest** pour les tests unitaires (API et Web)
- **@testing-library/react** pour les tests de composants React
- **Playwright** pour les tests end-to-end
- **Supertest** pour les tests d'intégration API

## Tests API (NestJS)

### Configuration

Jest est configuré par défaut dans NestJS. Les fichiers de configuration sont :
- `apps/api/jest.config.json` - Configuration Jest
- `apps/api/test/` - Tests d'intégration

### Structure

```
apps/api/src/
└── modules/
    ├── rooms/
    │   ├── rooms.service.ts
    │   ├── rooms.service.spec.ts     # Tests unitaires
    │   └── rooms.controller.spec.ts  # Tests controller
    ├── swipes/
    │   └── swipes.service.spec.ts
    └── matches/
        └── matches.service.spec.ts
```

### Exécuter les Tests

```bash
cd apps/api

# Tous les tests
npm test

# Tests en mode watch
npm test -- --watch

# Tests avec coverage
npm test -- --coverage

# Tests spécifiques
npm test -- --testPathPatterns=rooms.service.spec

# Tests d'intégration (e2e)
npm run test:e2e
```

### Exemple de Test Unitaire

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PrismaService } from '../../infra/prisma.service';

describe('RoomsService', () => {
  let service: RoomsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    room: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a room', async () => {
    const createRoomDto = {
      name: 'Test Room',
      type: 'MOVIE',
    };

    mockPrismaService.room.create.mockResolvedValue({
      id: 'room-123',
      ...createRoomDto,
    });

    const result = await service.create(createRoomDto, 'user-123');

    expect(result).toHaveProperty('id');
    expect(mockPrismaService.room.create).toHaveBeenCalled();
  });
});
```

### Best Practices

1. **Mock les dépendances** - Utiliser des mocks pour Prisma, Redis, etc.
2. **Test l'isolation** - Chaque test doit être indépendant
3. **Clear mocks** - Nettoyer les mocks après chaque test
4. **Test les erreurs** - Vérifier les cas d'erreur
5. **Coverage** - Viser 70%+ de couverture

## Tests Web (React)

### Configuration

- `apps/web/jest.config.js` - Configuration Jest pour Next.js
- `apps/web/jest.setup.js` - Setup global (mocks, etc.)

### Structure

```
apps/web/src/
└── components/
    ├── error/
    │   ├── ErrorBoundary.tsx
    │   └── __tests__/
    │       └── ErrorBoundary.test.tsx
    └── room/
        └── __tests__/
            └── RoomCard.test.tsx
```

### Exécuter les Tests

```bash
cd apps/web

# Tests en mode watch
npm test

# Tests CI (single run)
npm run test:ci

# Tests avec coverage
npm run test:ci
```

### Exemple de Test React

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>No error</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render error UI when child throws', () => {
    // Component that throws
    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Une erreur est survenue/)).toBeInTheDocument()
  })
})
```

### Mocks Disponibles

Les mocks suivants sont configurés globalement :

- **next/navigation** - Router, pathname, searchParams
- **next-auth/react** - Session, signIn, signOut
- **socket.io-client** - WebSocket client
- **IntersectionObserver** - Pour les composants utilisant l'intersection

## Tests E2E (Playwright)

### Configuration

- `apps/web/playwright.config.ts` - Configuration Playwright
- `apps/web/e2e/` - Tests end-to-end

### Structure

```
apps/web/e2e/
├── home.spec.ts       # Tests page d'accueil
├── rooms.spec.ts      # Tests flow rooms
├── swipe.spec.ts      # Tests swipe flow
└── auth.spec.ts       # Tests authentification
```

### Exécuter les Tests

```bash
cd apps/web

# Tests E2E (headless)
npm run test:e2e

# Tests avec UI interactive
npm run test:e2e:ui

# Tests en mode debug
npm run test:e2e:debug

# Tests sur navigateur spécifique
npx playwright test --project=chromium

# Tests sur mobile
npx playwright test --project="Mobile Chrome"
```

### Exemple de Test E2E

```typescript
import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Swipe Movie/i)

    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should navigate to rooms', async ({ page }) => {
    await page.goto('/')

    const roomsLink = page.getByRole('link', { name: /rooms/i })
    await roomsLink.click()

    await expect(page).toHaveURL(/\/rooms/)
  })
})
```

### Navigateurs Supportés

Les tests s'exécutent sur :
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Coverage

### Objectifs

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Générer le Coverage

```bash
# API
cd apps/api
npm test -- --coverage

# Web
cd apps/web
npm run test:ci
```

Le rapport de coverage est généré dans :
- `apps/api/coverage/`
- `apps/web/coverage/`

Ouvrir `coverage/lcov-report/index.html` dans un navigateur.

## CI/CD Integration

Les tests sont automatiquement exécutés dans le pipeline CI/CD :

```yaml
# .github/workflows/ci.yml
- name: Run Web tests
  run: cd apps/web && npm test --if-present

- name: Run API tests
  run: cd apps/api && npm test --if-present
```

## Debugging

### Debug Tests Jest

```bash
# Avec Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Avec VSCode
# Ajouter breakpoint et lancer "Jest Debug"
```

### Debug Tests Playwright

```bash
# Mode debug interactif
npm run test:e2e:debug

# Avec traces
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## Écrire de Nouveaux Tests

### Checklist

- [ ] Nommer le fichier `.spec.ts` (Jest) ou `.test.tsx` (React)
- [ ] Placer dans `__tests__/` ou à côté du fichier source
- [ ] Grouper les tests avec `describe`
- [ ] Utiliser des noms descriptifs
- [ ] Tester le happy path ET les erreurs
- [ ] Mock les dépendances externes
- [ ] Nettoyer après chaque test

### Conventions de Nommage

```typescript
// BAD
it('works', () => {})

// GOOD
it('should create a room when valid data is provided', () => {})
it('should throw NotFoundException when room not found', () => {})
```

### AAA Pattern

Organiser les tests avec Arrange-Act-Assert :

```typescript
it('should create a match when all members like', async () => {
  // Arrange - Setup
  const roomId = 'room-123'
  const movieId = 'movie-456'
  mockPrisma.swipe.count.mockResolvedValue(2)

  // Act - Execute
  const result = await service.create(roomId, 'user-1', movieId, true)

  // Assert - Verify
  expect(result.matchCreated).toBe(true)
  expect(mockPrisma.match.create).toHaveBeenCalled()
})
```

## Ressources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)

## Troubleshooting

### "Cannot find module '@testing-library/jest-dom'"

```bash
npm install --save-dev @testing-library/jest-dom
```

### "ReferenceError: TextEncoder is not defined"

Ajouter dans `jest.setup.js` :
```javascript
global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder
```

### Playwright "browser not found"

```bash
npx playwright install
```

### Tests Jest timeout

Augmenter le timeout :
```typescript
it('should take time', async () => {
  // ...
}, 10000) // 10 seconds
```

## Prochaines Étapes

- [ ] Augmenter la couverture à 70%+
- [ ] Ajouter tests d'intégration API
- [ ] Ajouter tests E2E complets (auth, swipe, match)
- [ ] Configurer visual regression testing
- [ ] Ajouter performance testing
