import clsx from 'clsx';

const variantStyles = {
  danger: {
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger-text)',
  },
  info: {
    background: 'rgba(59,130,246,0.1)',
    color: 'var(--color-amber)',
  },
  neutral: {
    background: 'var(--color-surface-mid)',
    color: 'var(--color-text-muted)',
  },
  primary: {
    background: 'var(--color-primary-surface)',
    color: 'var(--color-primary)',
  },
  success: {
    background: 'var(--color-success-bg)',
    color: 'var(--color-success-text)',
  },
  warning: {
    background: 'var(--color-warning-bg)',
    color: 'var(--color-warning-text)',
  },
};

const sizeStyles = {
  md: { fontSize: 11, padding: '4px 10px' },
  sm: { fontSize: 10, padding: '3px 9px' },
};

export function Badge({ children, className, size = 'md', style, variant = 'neutral', ...rest }) {
  return (
    <span
      className={clsx('status-pill', className)}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge;
