import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { PageHeader } from '@/components/layout/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/SearchInput';
import { useGetMyTransactions } from '@/hooks/useTransactions';
import { formatDate, formatKES, getStockVariant } from '@/utils/formatters';

export function OrdersPage() {
  const [filters, setFilters] = useState({ endDate: '', page: 1, search: '', startDate: '' });
  const params = useMemo(() => ({ ...filters, limit: 8, type: 'sale' }), [filters]);

  // ✅ FIX: Destructure isFetching
  const { data, isFetching } = useGetMyTransactions(params);
  const orders = data?.docs || [];
  const [expandedId, setExpandedId] = useState(null);

  // ✅ STRIPE: Show toast on redirect back from Stripe Checkout
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      toast.success('Payment successful! Your order has been placed.');
      // Remove query params so toast doesn't re-show on refresh
      setSearchParams({});
    } else if (payment === 'cancelled') {
      toast.error('Payment was cancelled. Your cart is still saved.');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <div>
      <PageHeader title="My Orders" subtitle="Track each order reference, quantity, and current fulfilment status." />
      <Card level="low" padding={16} style={{ display: 'grid', gap: 16 }}>
        <DateRangePicker
          endDate={filters.endDate}
          onEndChange={(value) => setFilters((c) => ({ ...c, endDate: value, page: 1 }))}
          onStartChange={(value) => setFilters((c) => ({ ...c, page: 1, startDate: value }))}
          startDate={filters.startDate}
        />
        <SearchInput placeholder="Search by product or order ref" value={filters.search} onChange={(value) => setFilters((c) => ({ ...c, page: 1, search: value }))} />
      </Card>

      {/* ✅ FIX: Dim list on page change instead of flash */}
      <div
        style={{
          display: 'grid',
          gap: 12,
          marginTop: 20,
          opacity: isFetching ? 0.5 : 1,
          transition: 'opacity 0.2s ease',
          pointerEvents: isFetching ? 'none' : 'auto',
        }}
      >
        {orders.map((order) => (
          <Card key={order._id} level="base" onClick={() => setExpandedId((c) => (c === order._id ? null : order._id))} padding={0}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(7, minmax(0,1fr))', padding: 16 }}>
              <div>{formatDate(order.createdAt)}</div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>{order.reference}</div>
              <div>{order.productId?.name}</div>
              <div>{order.quantity}</div>
              <div>{order.productId?.unit}</div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(order.unitPrice)}</div>
              <div>
                <Badge variant={getStockVariant(order.newStock, order.productId?.reorderLevel)}>
                  {order.newStock > 0 ? 'Fulfilled' : 'Pending'}
                </Badge>
              </div>
            </div>
            {expandedId === order._id ? (
              <div style={{ background: 'var(--color-surface-low)', padding: '0 16px 16px' }}>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 13, lineHeight: 1.7 }}>
                  Reference: <span style={{ fontFamily: 'var(--font-mono)' }}>{order.reference}</span>
                  <br />
                  Batch number: <span style={{ fontFamily: 'var(--font-mono)' }}>{order.productId?.batchNumber || '—'}</span>
                  <br />
                  Notes: {order.notes || 'No extra notes for this order.'}
                </div>
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={data?.page || 1}
        limit={data?.limit || 8}
        onPageChange={(page) => setFilters((c) => ({ ...c, page }))}
        totalDocs={data?.totalDocs || 0}
        totalPages={data?.totalPages || 1}
      />
    </div>
  );
}

export default OrdersPage;