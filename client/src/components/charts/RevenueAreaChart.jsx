import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import ChartTooltip from '@/components/charts/ChartTooltip';
import { compactNumber } from '@/utils/formatters';

const periods = ['7D', '30D', '90D', '12M'];

export function RevenueAreaChart({ data = [], onPeriodChange, period = '30D' }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {periods.map((item) => (
          <Button key={item} onClick={() => onPeriodChange?.(item)} size="sm" variant={item === period ? 'primary' : 'secondary'}>
            {item}
          </Button>
        ))}
      </div>
      <div style={{ height: 280, width: '100%' }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.24} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-divider)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'var(--color-text-hint)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: 'var(--color-text-hint)', fontSize: 11 }}
              tickFormatter={(value) => `KES ${compactNumber(value)}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              activeDot={{ r: 5, fill: 'var(--color-primary)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueAreaChart;
