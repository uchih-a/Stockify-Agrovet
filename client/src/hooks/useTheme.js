import { useEffect } from 'react';
import useUiStore, { applyTheme, getSavedTheme } from '@/store/uiStore';

export function useTheme() {
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);

  useEffect(() => {
    applyTheme(getSavedTheme());
  }, []);

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}

export default useTheme;
