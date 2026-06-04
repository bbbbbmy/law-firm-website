// Simplified Prisma client for development
// Note: Database needs to be running for full functionality

export const prisma = {
  admin: {
    findUnique: async () => null,
    findMany: async () => [],
  },
  article: {
    findMany: async () => [],
    count: async () => 0,
  },
  teamMember: {
    findMany: async () => [],
    count: async () => 0,
  },
  banner: {
    findMany: async () => [],
    count: async () => 0,
  },
  page: {
    findUnique: async () => null,
    findMany: async () => [],
  },
  pageContent: {
    findUnique: async () => null,
    findMany: async () => [],
  },
  siteConfig: {
    findMany: async () => [],
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as any