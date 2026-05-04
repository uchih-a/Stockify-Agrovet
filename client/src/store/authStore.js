import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: Boolean(user && token),
          isLoading: false,
        }),
      setToken: (token) =>
        set((state) => ({
          accessToken: token,
          isAuthenticated: Boolean(state.user && token),
        })),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'agrovet-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = Boolean(state.user && state.accessToken);
        }
      },
    },
  ),
);

export default useAuthStore;
