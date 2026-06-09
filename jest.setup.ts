import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/admin',
}))

// Mock Next.js headers
jest.mock('next/headers', () => ({
  headers: () => new Map(),
  cookies: () => ({
    get: () => undefined,
  }),
}))

// Mock session
jest.mock('@/lib/session', () => ({
  getSession: () => Promise.resolve({
    adminId: 'test-id',
    email: 'admin',
    isLoggedIn: true,
  }),
  sessionOptions: {
    password: 'test-password',
    cookieName: 'test-cookie',
  },
}))