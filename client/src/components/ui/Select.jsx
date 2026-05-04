import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { forwardRef, useId } from 'react';

export const Select = forwardRef(function Select(
  { className, error, label, options = [], placeholder = 'Select an option', style, ...rest },
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
        <select
          ref={ref}
          id={id}
          className={clsx('input-bottom-line', error && 'error', className)}
          style={{
            appearance: 'none',
            paddingRight: 42,
            ...style,
          }}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--color-amber)',
            inset: '50% 14px auto auto',
            pointerEvents: 'none',
            position: 'absolute',
            transform: 'translateY(-50%)',
          }}
        />
      </span>
      {error ? <span style={{ color: 'var(--color-danger-text)', fontSize: 12 }}>{error}</span> : null}
    </label>
  );
});

export default Select;
