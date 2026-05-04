/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-low': 'var(--color-surface-low)',
        'surface-mid': 'var(--color-surface-mid)',
        'surface-high': 'var(--color-surface-high)',
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-surface': 'var(--color-primary-surface)',
        amber: 'var(--color-amber)',
        'amber-surface': 'var(--color-amber-surface)',
        text: 'var(--color-text-primary)',
        muted: 'var(--color-text-muted)',
        hint: 'var(--color-text-hint)',
        divider: 'var(--color-divider)',
        success: 'var(--color-success-text)',
        'success-bg': 'var(--color-success-bg)',
        warning: 'var(--color-warning-text)',
        'warning-bg': 'var(--color-warning-bg)',
        danger: 'var(--color-danger-text)',
        'danger-bg': 'var(--color-danger-bg)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        float: 'var(--shadow-float)',
      },
      backgroundImage: {
        harvest: 'var(--harvest-gradient)',
      },
    },
  },
  plugins: [],
};
