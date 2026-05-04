import { endOfDay, formatISO, startOfDay, subDays } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const toInputDate = (value) => (value ? formatISO(new Date(value), { representation: 'date' }) : '');

export function DateRangePicker({
  endDate,
  label,
  onEndChange,
  onStartChange,
  startDate,
}) {
  const setPreset = (days) => {
    const end = endOfDay(new Date());
    const start = startOfDay(days === 0 ? new Date() : subDays(new Date(), days - 1));
    onStartChange?.(toInputDate(start));
    onEndChange?.(toInputDate(end));
  };

  return (
    <div style={{ display: 'grid', gap: 10 }}>
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
      <div
        style={{
          alignItems: 'end',
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
        }}
      >
        <Input type="date" value={toInputDate(startDate)} onChange={(event) => onStartChange?.(event.target.value)} />
        <span style={{ color: 'var(--color-text-hint)', paddingBottom: 10 }}>→</span>
        <Input type="date" value={toInputDate(endDate)} onChange={(event) => onEndChange?.(event.target.value)} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[
          { label: 'Today', value: 0 },
          { label: '7 Days', value: 7 },
          { label: '30 Days', value: 30 },
          { label: '90 Days', value: 90 },
        ].map((preset) => (
          <Button key={preset.label} onClick={() => setPreset(preset.value)} size="sm" type="button" variant="tertiary">
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default DateRangePicker;
