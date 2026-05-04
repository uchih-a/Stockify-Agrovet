import { AlertTriangle, Package, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ui/ProductCard';
import { StatCard } from '@/components/ui/StatCard';
import { Table } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { useGetMyTransactions } from '@/hooks/useTransactions';
import { useGetProducts } from '@/hooks/useProducts';
import useAuthStore from '@/store/authStore';
import { cartSelectors, useCartStore } from '@/store/cartStore';
import { formatDate, formatKES, formatRelative } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/utils/constants';

export function FarmerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore(cartSelectors.totalItems);

  // Fetch all transactions for this month to get accurate total
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const { data: allTransactionsPayload, isLoading: loadingTransactions } =
    useGetMyTransactions({ limit: 100, sort: '-createdAt' });

  const { data: lowStockPayload } = useGetProducts({ lowStock: true, limit: 4 });

  const allTransactions = allTransactionsPayload?.docs || [];

  // Filter for this month
  const monthlyTransactions = allTransactions.filter((t) => {
    const d = new Date(t.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyTotal = monthlyTransactions.reduce(
    (sum, t) => sum + (Number(t.totalAmount) || 0),
    0,
  );

  // Recent purchases — last 5 only
  const recentPurchases = allTransactions.slice(0, 5);
  const lastPurchase = recentPurchases[0];
  const runningLow = lowStockPayload?.docs || [];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>
          {greeting}, {user?.name?.split(' ')[0]}. 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '8px 0 0' }}>
          {formatDate(new Date())}
        </p>
      </header>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <StatCard
          icon={ShoppingBag}
          label="Spent This Month"
          value={formatKES(monthlyTotal)}
          variant="primary"
          loading={loadingTransactions}
        />
        <StatCard
          icon={ShoppingCart}
          label="Items In Cart"
          onClick={openCart}
          value={String(totalItems)}
          variant="amber"
        />
        <StatCard
          icon={Package}
          label="Last Purchase"
          value={lastPurchase?.productId?.name || 'No purchases yet'}
          unit={lastPurchase ? formatRelative(lastPurchase.createdAt) : ''}
        />
      </div>

      {/* Low stock carousel */}
      {runningLow.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <div
            style={{
              alignItems: 'center',
              color: 'var(--color-amber)',
              display: 'flex',
              fontSize: 13,
              fontWeight: 700,
              gap: 8,
              letterSpacing: '0.06em',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            <AlertTriangle size={14} />
            Running Low — Buy Before It&apos;s Gone
          </div>
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridAutoColumns: 'minmax(260px, 1fr)',
              gridAutoFlow: 'column',
              overflowX: 'auto',
              paddingBottom: 8,
            }}
          >
            {runningLow.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Recent purchases */}
      <section style={{ marginTop: 40 }}>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Recent Purchases</h2>
          <Link style={{ color: 'var(--color-amber)', fontSize: 14 }} to={ROUTES.FARMER_ORDERS}>
            View All →
          </Link>
        </div>

        {recentPurchases.length > 0 ? (
          <Table
            columns={[
              { key: 'createdAt', header: 'Date', render: (row) => formatDate(row.createdAt) },
              {
                key: 'product',
                header: 'Product',
                render: (row) => row.productId?.name || '—',
              },
              { key: 'quantity', header: 'Qty' },
              {
                key: 'totalAmount',
                header: 'Total KES',
                render: (row) => (
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {formatKES(row.totalAmount)}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: () => <Badge variant="success">Completed</Badge>,
              },
            ]}
            data={recentPurchases}
            loading={loadingTransactions}
          />
        ) : (
          !loadingTransactions && (
            <EmptyState
              action={{ label: 'Browse Shop', onClick: () => window.location.assign(ROUTES.FARMER_SHOP) }}
              description="Browse the shop to place your first order."
              icon={<ShoppingBag size={48} />}
              title="No purchases yet"
            />
          )
        )}
      </section>
    </div>
  );
}

export default FarmerDashboardPage;
