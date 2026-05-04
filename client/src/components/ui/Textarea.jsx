import clsx from 'clsx';
import { forwardRef, useId } from 'react';

export const Textarea = forwardRef(function Textarea(
  { className, error, hint, label, maxLength, rows = 3, style, ...rest },
  ref,
) {
  const id = useId();
  const currentLength = String(rest.value ?? '').length;

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
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={clsx('input-bottom-line', error && 'error', className)}
        style={{
          resize: 'vertical',
          borderTopLeftRadius: 'var(--radius-sm)',
          borderTopRightRadius: 'var(--radius-sm)',
          ...style,
        }}
        {...rest}
      />
      <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>
          {error ? (
            <span style={{ color: 'var(--color-danger-text)', fontSize: 12 }}>{error}</span>
          ) : hint ? (
            <span style={{ color: 'var(--color-text-hint)', fontSize: 12 }}>{hint}</span>
          ) : null}
        </span>
        {maxLength ? (
          <span style={{ color: 'var(--color-text-hint)', fontSize: 11 }}>
            {currentLength}/{maxLength}
          </span>
        ) : null}
      </span>
    </label>
  );
});

export default Textarea;
