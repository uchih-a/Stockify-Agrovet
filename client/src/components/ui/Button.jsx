import clsx from 'clsx';
import { forwardRef } from 'react';
import { Spinner } from '@/components/ui/Spinner';

const sizeStyles = {
  lg: { height: 48, padding: '0 18px' },
  md: { height: 40, padding: '0 16px' },
  sm: { height: 32, padding: '0 14px' },
};

const variantStyles = {
  danger: {
    background: '#b91c1c',
    color: '#ffffff',
  },
  primary: {
    background: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
  },
  secondary: {
    background: 'var(--color-surface-low)',
    color: 'var(--color-text-primary)',
  },
  tertiary: {
    background: 'transparent',
    color: 'var(--color-amber)',
  },
};

export const Button = forwardRef(function Button(
  {
    children,
    className,
    disabled = false,
    fullWidth = false,
    icon,
    iconRight,
    loading = false,
    size = 'md',
    style,
    variant = 'primary',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const isTertiary = variant === 'tertiary';

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={clsx(className)}
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        width: fullWidth ? '100%' : undefined,
        border: 'none',
        borderRadius: isTertiary ? 0 : 'var(--radius-md)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.01em',
        opacity: isDisabled ? 0.7 : 1,
        transition: 'transform 150ms ease, background 300ms ease, color 300ms ease, opacity 200ms ease',
        position: 'relative',
        transform: 'translateZ(0)',
        overflow: 'hidden',
        ...style,
      }}
      onMouseEnter={(event) => {
        if (isDisabled) return;
        if (variant === 'primary') {
          event.currentTarget.style.background = 'var(--harvest-gradient)';
        }
        if (variant === 'secondary') {
          event.currentTarget.style.background = 'var(--color-surface-mid)';
        }
        if (variant === 'danger') {
          event.currentTarget.style.background = '#991b1b';
        }
      }}
      onMouseLeave={(event) => {
        if (variant === 'primary') {
          event.currentTarget.style.background = 'var(--color-primary)';
        }
        if (variant === 'secondary') {
          event.currentTarget.style.background = 'var(--color-surface-low)';
        }
        if (variant === 'danger') {
          event.currentTarget.style.background = '#b91c1c';
        }
      }}
      onMouseDown={(event) => {
        if (!isDisabled && !isTertiary) {
          event.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(event) => {
        event.currentTarget.style.transform = 'scale(1)';
      }}
      {...rest}
    >
      {isTertiary ? (
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {icon}
            {loading ? <Spinner size="xs" /> : children}
            {iconRight}
          </span>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 4,
              height: 1.5,
              background: 'currentColor',
              transform: 'scaleX(0)',
              transformOrigin: 'left center',
              transition: 'transform 300ms ease',
            }}
            className="button-underline"
          />
        </>
      ) : (
        <>
          {icon}
          {loading ? <Spinner size="xs" /> : children}
          {iconRight}
        </>
      )}
    </button>
  );
});

export default Button;
