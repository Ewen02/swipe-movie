import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
}))

// Mock Better Auth client (project migrated off next-auth). Individual
// specs can override these with jest.mock(...) at file scope to test
// session-dependent behavior.
jest.mock('@/lib/auth-client', () => ({
  useSession() {
    return {
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
      },
      isPending: false,
    }
  },
  getSession: jest.fn().mockResolvedValue({
    data: { user: { id: 'test-user-id', email: 'test@example.com', name: 'Test User' } },
  }),
  signIn: { social: jest.fn() },
  signOut: jest.fn(),
  authClient: {},
}))

// Mock lib/auth (server-side Better Auth instance — not usable in jsdom)
jest.mock('@/lib/auth', () => ({
  auth: { api: { getSession: jest.fn() } },
}))

// Mock Socket.IO client
jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    io: {
      on: jest.fn(),
    },
  }))
})

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    span: 'span',
    button: 'button',
    a: 'a',
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
