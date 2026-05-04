import clsx from 'clsx';

const radiusMap = {
  full: '9999px',
  lg: '16px',
  sm: '8px',
};

export function Skeleton({
  width = '100%',
  height = 16,
  rounded = 'sm',
  className,
  style,
  ...rest
}) {
  return (
    <div
      className={clsx(className)}
      style={{
        width,
        height,
        borderRadius: radiusMap[rounded] || radiusMap.sm,
        background: 'var(--color-surface-mid)',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.08)',
        }}
      />
    </div>
  );
}

export default Skeleton;
