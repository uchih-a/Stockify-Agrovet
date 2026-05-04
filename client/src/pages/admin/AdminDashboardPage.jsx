import { AlertTriangle, Package, ShoppingBag, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { MonthlySalesChart } from '@/components/charts/MonthlySalesChart';
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart';
import { TopProductsBarChart } from '@/components/charts/TopProductsBarChart';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import { useGetAlerts } from '@/hooks/useAlerts';
import { useGetLowStockProducts } from '@/hooks/useProducts';
import { useGetInventorySnapshot, useGetSalesSummary } from '@/hooks/useReports';
import { useGetTransactions } from '@/hooks/useTransactions';
import useAuthStore from '@/store/authStore';
import { formatDate, formatKES } from '@/utils/formatters';

export function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [period, setPeriod] = useState('30D');
  const salesParams = useMemo(() => ({ period }), [period]);
  const { data: snapshot, isLoading: loadingSnapshot } = useGetInventorySnapshot();
  const { data: salesSummary, isLoading: loadingSales } = useGetSalesSummary(salesParams);
  const { data: alertsData } = useGetAlerts({ limit: 5 });
  const { data: lowStockData } = useGetLowStockProducts();
  const { data: recentTransactions } = useGetTransactions({ limit: 5, sort: '-createdAt' });
  const greeting = ['Good night', 'Good morning', 'Good afternoon', 'Good evening'][new Date().getHours() >= 18 ? 3 : new Date().getHours() >= 12 ? 2 : new Date().getHours() >= 5 ? 1 : 0];
  const alerts = alertsData?.docs || [];
  const lowStock = lowStockData || [];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`${greeting}, ${user?.name}.`} />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard loading={loadingSales} icon={ShoppingBag} label="Total Revenue" value={formatKES(salesSummary?.totalRevenue || 0)} delta={salesSummary?.revenueGrowth || 0} variant="primary" />
        <StatCard loading={loadingSnapshot} icon={Package} label="Total Products" value={snapshot?.totalProducts || 0} />
        <StatCard loading={loadingSnapshot} icon={AlertTriangle} label="Low Stock" value={snapshot?.lowStockCount || lowStock.length} variant={(snapshot?.lowStockCount || 0) > 5 ? 'danger' : 'amber'} />
        <StatCard loading={loadingSnapshot} icon={Users} label="Active Farmers" value={snapshot?.totalFarmers || 0} />
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1.6fr) minmax(320px,1fr)', marginTop: 24 }}>
        <Card level="elevated">
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, margin: 0 }}>Revenue Overview</h3>
          </div>
          {loadingSales ? <Skeleton height={280} rounded="lg" /> : <RevenueAreaChart data={salesSummary?.dailyRevenue || []} onPeriodChange={setPeriod} period={period} />}
        </Card>
        <Card level="elevated">
          <h3 style={{ fontSize: 14, margin: 0 }}>Inventory by Category</h3>
          <div style={{ marginTop: 16 }}>
            {loadingSnapshot ? <Skeleton height={280} rounded="lg" /> : <CategoryDonutChart data={snapshot?.byCategory || []} />}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1.2fr) minmax(320px,1fr)', marginTop: 24 }}>
        <Card level="elevated">
          <h3 style={{ fontSize: 14, margin: 0 }}>Best Sellers</h3>
          <div style={{ marginTop: 16 }}>
            <TopProductsBarChart data={salesSummary?.topProducts?.slice(0, 5) || []} />
          </div>
        </Card>
        <Card level="elevated">
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 14, margin: 0 }}>Active Alerts</h3>
            <Badge variant="danger">{alerts.length}</Badge>
          </div>
          <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert._id} style={{ background: alert.severity === 'critical' ? 'var(--color-danger-bg)' : 'var(--color-surface-low)', borderRadius: 'var(--radius-md)', display: 'grid', gap: 8, gridTemplateColumns: '4px minmax(0,1fr) auto', overflow: 'hidden' }}>
                <span style={{ background: alert.severity === 'critical' ? 'var(--color-danger-text)' : 'var(--color-amber)' }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{alert.productId?.name || 'System Alert'}</div>
                  <div className="clamp-2" style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 4 }}>
                    {alert.message}
                  </div>
                </div>
                <div style={{ alignSelf: 'center', paddingRight: 12 }}>
                  <Button size="sm" variant="secondary">
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Link style={{ color: 'var(--color-amber)', display: 'inline-block', marginTop: 16 }} to="/admin/alerts">
            View All Alerts →
          </Link>
        </Card>
      </div>

      <Card level="elevated" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 14, margin: 0 }}>Monthly Sales Overview</h3>
        <div style={{ marginTop: 16 }}>
          <MonthlySalesChart data={salesSummary?.monthlySales || []} />
        </div>
      </Card>

      <Card level="elevated" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 14, margin: 0 }}>Recent Transactions</h3>
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          {(recentTransactions?.docs || []).map((transaction) => (
            <div key={transaction._id} style={{ alignItems: 'center', background: 'var(--color-surface-low)', borderRadius: 'var(--radius-md)', display: 'grid', gap: 10, gridTemplateColumns: 'minmax(0,1fr) auto auto', padding: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{transaction.productId?.name}</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{formatDate(transaction.createdAt)}</div>
              </div>
              <Badge variant="primary">{transaction.type}</Badge>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(transaction.totalAmount)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboardPage;
