import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartTooltip from '@/components/charts/ChartTooltip';

export function MonthlySalesChart({ data = [] }) {
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid stroke="var(--color-divider)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'var(--color-text-hint)', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--color-text-hint)', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-text-hint)', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" dataKey="transactions" name="Transactions" stroke="var(--color-amber)" strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlySalesChart;
