import { create } from 'zustand';

const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const getSavedTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.localStorage.getItem('agrovet-theme') || 'light';
};

export const useUiStore = create((set, get) => ({
  sidebarOpen: true,
  activePanel: null,
  panelData: null,
  theme: getSavedTheme(),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  openPanel: (activePanel, panelData = null) => set({ activePanel, panelData }),
  closePanel: () => set({ activePanel: null, panelData: null }),
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    window.localStorage.setItem('agrovet-theme', nextTheme);
    set({ theme: nextTheme });
  },
  setTheme: (theme) => {
    applyTheme(theme);
    window.localStorage.setItem('agrovet-theme', theme);
    set({ theme });
  },
}));

export { applyTheme, getSavedTheme };
export default useUiStore;
