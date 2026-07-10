export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  entries: {
    all: ['entries'] as const,
    list: () => ['entries', 'list'] as const,
    detail: (id: number | string) => ['entries', 'detail', String(id)] as const,
  },
  admin: {
    all: ['admin'] as const,
    users: () => ['admin', 'users'] as const,
    userEntries: (userId: number | string) =>
      ['admin', 'users', String(userId), 'entries'] as const,
    userEntry: (userId: number | string, id: number | string) =>
      ['admin', 'users', String(userId), 'entries', String(id)] as const,
    userStats: (userId: number | string) =>
      ['admin', 'users', String(userId), 'stats'] as const,
  },
} as const
