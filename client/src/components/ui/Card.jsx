import clsx from 'clsx';

const levelStyles = {
  base: {
    background: 'var(--color-surface)',
    boxShadow: 'none',
  },
  elevated: {
    background: 'var(--color-surface)',
    boxShadow: 'var(--shadow-card)',
  },
  low: {
    background: 'var(--color-surface-low)',
    boxShadow: 'none',
  },
};

export function Card({
  children,
  className,
  level = 'base',
  onClick,
  padding = 24,
  style,
  ...rest
}) {
  return (
    <section
      className={clsx(className)}
      style={{
        ...levelStyles[level],
        borderRadius: 'var(--radius-lg)',
        padding,
        border: 'none',
        outline: 'none',
        transition: onClick ? 'transform 220ms ease, box-shadow 220ms ease' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={(event) => {
        if (!onClick) return;
        event.currentTarget.style.transform = 'scale(1.005)';
      }}
      onMouseLeave={(event) => {
        if (!onClick) return;
        event.currentTarget.style.transform = 'scale(1)';
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </section>
  );
}

export default Card;
