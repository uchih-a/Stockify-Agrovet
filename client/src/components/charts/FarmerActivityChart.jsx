import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartTooltip from '@/components/charts/ChartTooltip';

export function FarmerActivityChart({ data = [] }) {
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="var(--color-divider)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'var(--color-text-hint)', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--color-text-hint)', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="newFarmers" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="activeFarmers" stroke="var(--color-secondary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FarmerActivityChart;
