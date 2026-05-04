import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { PageHeader } from '@/components/layout/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/SearchInput';
import { useGetMyTransactions } from '@/hooks/useTransactions';
import { formatDate, formatKES } from '@/utils/formatters';
import { TYPE_LABELS } from '@/utils/constants';

export function TransactionHistoryPage() {
  const [filters, setFilters] = useState({ endDate: '', page: 1, search: '', startDate: '' });
  const params = useMemo(() => ({ ...filters, limit: 10 }), [filters]);

  // ✅ FIX: Destructure isFetching
  const { data, isFetching } = useGetMyTransactions(params);
  const transactions = data?.docs || [];
  const totalVisible = transactions.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

  const exportCsv = () => {
    const rows = [
      ['Date', 'Type', 'Reference', 'Product', 'Quantity', 'Total'],
      ...transactions.map((t) => [formatDate(t.createdAt), t.type, t.reference, t.productId?.name, t.quantity, t.totalAmount]),
    ];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agrovet-history.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported.');
  };

  return (
    <div>
      <PageHeader
        title="Transaction History"
        subtitle="A complete log of your purchases, returns, and adjustments."
        actions={
          <Button icon={<Download size={14} />} onClick={exportCsv} variant="secondary">
            Export CSV
          </Button>
        }
      />
      <Card level="low" padding={16} style={{ display: 'grid', gap: 16 }}>
        <DateRangePicker
          endDate={filters.endDate}
          onEndChange={(value) => setFilters((c) => ({ ...c, endDate: value, page: 1 }))}
          onStartChange={(value) => setFilters((c) => ({ ...c, page: 1, startDate: value }))}
          startDate={filters.startDate}
        />
        <SearchInput placeholder="Search history" value={filters.search} onChange={(value) => setFilters((c) => ({ ...c, page: 1, search: value }))} />
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
        {transactions.map((transaction) => (
          <Card key={transaction._id} level="base" padding={16}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(6, minmax(0,1fr))' }}>
              <div>{formatDate(transaction.createdAt)}</div>
              <div>
                <Badge variant="primary">{TYPE_LABELS[transaction.type] || transaction.type}</Badge>
              </div>
              <div>{transaction.productId?.name}</div>
              <div>{transaction.quantity}</div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(transaction.unitPrice)}</div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(transaction.totalAmount)}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 16 }}>
        {transactions.length} transactions · Total KES{' '}
        <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{formatKES(totalVisible)}</span>
      </div>

      <Pagination
        currentPage={data?.page || 1}
        limit={data?.limit || 10}
        onPageChange={(page) => setFilters((c) => ({ ...c, page }))}
        totalDocs={data?.totalDocs || 0}
        totalPages={data?.totalPages || 1}
      />
    </div>
  );
}

export default TransactionHistoryPage;