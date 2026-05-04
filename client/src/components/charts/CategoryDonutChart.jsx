import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartTooltip from '@/components/charts/ChartTooltip';

const categoryColours = {
  animal_feed: '#ba7517',
  equipment: '#a3a89d',
  other: '#6e7068',
  pesticide: '#40916c',
  veterinary_medicine: '#8b5e3c',
};

export function CategoryDonutChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + (item.value || item.count || 0), 0);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data.map((item) => ({ ...item, value: item.value || item.count || 0 }))}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.colour || categoryColours[item.name] || '#6e7068'} />
              ))}
            </Pie>
            <text x="50%" y="47%" textAnchor="middle" fill="var(--color-text-hint)" fontSize="11">
              Total
            </text>
            <text x="50%" y="57%" textAnchor="middle" fill="var(--color-text-primary)" fontFamily="var(--font-display)" fontSize="28">
              {total}
            </text>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {data.map((item) => (
          <span key={item.name} style={{ alignItems: 'center', display: 'inline-flex', gap: 8 }}>
            <span
              style={{
                background: item.colour || categoryColours[item.name] || '#6e7068',
                borderRadius: 9999,
                height: 10,
                width: 10,
              }}
            />
            <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{item.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{item.value || item.count || 0}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default CategoryDonutChart;
