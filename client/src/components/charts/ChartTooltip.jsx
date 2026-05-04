import { Card } from '@/components/ui/Card';

export function ChartTooltip({ active, label, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <Card level="elevated" padding={12} style={{ minWidth: 140 }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 12, margin: 0 }}>{label}</p>
      <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
        {payload.map((entry) => (
          <div key={entry.dataKey} style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{entry.name || entry.dataKey}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ChartTooltip;
