export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'],
  },
  products: {
    all: (params = {}) => ['products', 'all', params],
    detail: (id) => ['products', 'detail', id],
    lowStock: () => ['products', 'low-stock'],
    expiring: () => ['products', 'expiring'],
  },
  transactions: {
    all: (params = {}) => ['transactions', 'all', params],
    my: (params = {}) => ['transactions', 'my', params],
    detail: (id) => ['transactions', 'detail', id],
  },
  users: {
    all: (params = {}) => ['users', 'all', params],
    detail: (id) => ['users', 'detail', id],
    stats: (id) => ['users', 'stats', id],
  },
  chat: {
    history: (params = {}) => ['chat', 'history', params],
    session: (id) => ['chat', 'session', id],
  },
  alerts: {
    all: (params = {}) => ['alerts', 'all', params],
    unreadCount: () => ['alerts', 'unread-count'],
  },
  suppliers: {
    all: (params = {}) => ['suppliers', 'all', params],
    detail: (id) => ['suppliers', 'detail', id],
  },
  reports: {
    sales: (params = {}) => ['reports', 'sales', params],
    inventory: () => ['reports', 'inventory'],
    farmers: (params = {}) => ['reports', 'farmers', params],
    chatbot: () => ['reports', 'chatbot'],
    insights: () => ['reports', 'insights'],
  },
};

export default queryKeys;
