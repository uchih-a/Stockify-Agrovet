import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import useUiStore from '@/store/uiStore';

export function ThemeToggle({ className, ...rest }) {
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <Button
      aria-label="Toggle theme"
      className={className}
      onClick={toggleTheme}
      size="sm"
      style={{ paddingInline: 10 }}
      type="button"
      variant="tertiary"
      {...rest}
    >
      <Icon
        size={18}
        style={{
          transform: `rotate(${isDark ? 180 : 0}deg)`,
          transition: 'transform 300ms ease',
        }}
      />
    </Button>
  );
}

export default ThemeToggle;
