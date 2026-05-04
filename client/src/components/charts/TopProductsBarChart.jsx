import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartTooltip from '@/components/charts/ChartTooltip';
import { truncate } from '@/utils/formatters';

export function TopProductsBarChart({ data = [], onProductClick }) {
  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fill: 'var(--color-text-hint)', fontSize: 11, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: 'var(--color-text-hint)', fontSize: 12 }}
            width={120}
            tickFormatter={(value) => truncate(value, 20)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="revenue" fill="var(--color-primary)" radius={[0, 4, 4, 0]} onClick={(payload) => onProductClick?.(payload.productId)}>
            {data.map((item) => (
              <Cell key={item.productId || item.name} cursor={onProductClick ? 'pointer' : 'default'} />
            ))}
            <LabelList dataKey="revenue" position="right" formatter={(value) => `KES ${value}`} fill="var(--color-primary)" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TopProductsBarChart;
