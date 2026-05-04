import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const variantStyles = {
  amber: {
    background: 'var(--color-amber-surface)',
    color: 'var(--color-amber)',
  },
  danger: {
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger-text)',
  },
  default: {
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
  },
  primary: {
    background: 'var(--harvest-gradient)',
    color: '#ffffff',
  },
};

const renderValue = (value) => {
  const text = String(value ?? '—');
  if (!text.startsWith('KES')) return text;
  const [, amount] = text.split(' ');
  return (
    <>
      <span style={{ fontSize: 18, marginRight: 6 }}>KES</span>
      <span style={{ fontFamily: 'var(--font-mono)' }}>{amount}</span>
    </>
  );
};

export function StatCard({
  delta,
  deltaLabel,
  icon: Icon,
  label,
  loading = false,
  onClick,
  unit,
  value,
  variant = 'default',
}) {
  const styles = variantStyles[variant] || variantStyles.default;
  const positive = Number(delta) >= 0;

  return (
    <Card
      level="elevated"
      onClick={onClick}
      padding={24}
      style={{
        ...styles,
        minHeight: 120,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {loading ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <Skeleton height={10} rounded="full" width="40%" />
          <Skeleton height={36} rounded="lg" width="68%" />
          <Skeleton height={18} rounded="full" width="34%" />
        </div>
      ) : (
        <>
          {Icon ? (
            <Icon
              size={32}
              style={{
                opacity: 0.25,
                position: 'absolute',
                right: 24,
                top: 24,
              }}
            />
          ) : null}
          <p
            style={{
              color: variant === 'primary' ? 'rgba(255,255,255,0.72)' : 'var(--color-text-hint)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.07em',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </p>
          <div style={{ alignItems: 'baseline', display: 'flex', gap: 8, marginTop: 10 }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 44,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {renderValue(value)}
            </div>
            {unit ? (
              <span
                style={{
                  color: variant === 'primary' ? 'rgba(255,255,255,0.74)' : 'var(--color-text-muted)',
                  fontSize: 13,
                }}
              >
                {unit}
              </span>
            ) : null}
          </div>
          {delta !== undefined && delta !== null ? (
            <div style={{ marginTop: 16 }}>
              <Badge variant={positive ? 'success' : 'danger'}>
                {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(Number(delta)).toFixed(1)}%
                {deltaLabel ? ` ${deltaLabel}` : ''}
              </Badge>
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}

export default StatCard;
