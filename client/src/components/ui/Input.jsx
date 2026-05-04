import clsx from 'clsx';
import { forwardRef, useId } from 'react';

export const Input = forwardRef(function Input(
  { className, error, hint, label, prefix, suffix, style, ...rest },
  ref,
) {
  const id = useId();

  return (
    <label htmlFor={id} style={{ display: 'grid', gap: 4 }}>
      {label ? (
        <span
          style={{
            color: 'var(--color-text-hint)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      ) : null}
      <span style={{ position: 'relative', display: 'block' }}>
        {prefix ? (
          <span
            style={{
              alignItems: 'center',
              color: 'var(--color-text-hint)',
              display: 'inline-flex',
              inset: '0 auto 0 14px',
              position: 'absolute',
              zIndex: 1,
            }}
          >
            {prefix}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={clsx('input-bottom-line', error && 'error', className)}
          style={{
            paddingLeft: prefix ? 42 : undefined,
            paddingRight: suffix ? 42 : undefined,
            ...style,
          }}
          {...rest}
        />
        <span
          aria-hidden="true"
          style={{
            background: error ? 'var(--color-danger-text)' : 'var(--color-amber)',
            bottom: 0,
            height: 2,
            left: 0,
            position: 'absolute',
            right: 0,
            transform: 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 300ms ease',
          }}
        />
        {suffix ? (
          <span
            style={{
              alignItems: 'center',
              color: 'var(--color-text-hint)',
              display: 'inline-flex',
              inset: '0 14px 0 auto',
              position: 'absolute',
              zIndex: 1,
            }}
          >
            {suffix}
          </span>
        ) : null}
      </span>
      {error ? (
        <span style={{ color: 'var(--color-danger-text)', fontSize: 12 }}>{error}</span>
      ) : hint ? (
        <span style={{ color: 'var(--color-text-hint)', fontSize: 12 }}>{hint}</span>
      ) : null}
    </label>
  );
});

export default Input;
