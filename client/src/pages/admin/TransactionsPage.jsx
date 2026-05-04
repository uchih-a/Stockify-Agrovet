import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Pagination } from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/SearchInput';
import { SlidePanel } from '@/components/ui/SlidePanel';
import { PageHeader } from '@/components/layout/PageHeader';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useCreateTransaction, useGetTransactions } from '@/hooks/useTransactions';
import useUiStore from '@/store/uiStore';
import { formatDate, formatKES } from '@/utils/formatters';
import { TRANSACTION_TYPES, TYPE_LABELS } from '@/utils/constants';

export function TransactionsPage() {
  const [filters, setFilters] = useState({ endDate: '', farmer: '', page: 1, search: '', startDate: '', type: 'all' });
  const params = useMemo(() => ({ ...filters, limit: 10, sort: '-createdAt' }), [filters]);

  // ✅ FIX: Destructure isFetching
  const { data, isFetching } = useGetTransactions(params);
  const transactions = data?.docs || [];

  const openPanel = useUiStore((state) => state.openPanel);
  const closePanel = useUiStore((state) => state.closePanel);
  const activePanel = useUiStore((state) => state.activePanel);
  const createTransaction = useCreateTransaction();
  const totalAmount = transactions.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Transactions"
        actions={
          <Button icon={<Plus size={14} />} onClick={() => openPanel('addTransaction', null)}>
            Record Transaction
          </Button>
        }
      />
      <Card level="low" padding={16} style={{ display: 'grid', gap: 14 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Button onClick={() => setFilters((c) => ({ ...c, page: 1, type: 'all' }))} size="sm" variant={filters.type === 'all' ? 'primary' : 'secondary'}>
            All
          </Button>
          {TRANSACTION_TYPES.map((type) => (
            <Button key={type} onClick={() => setFilters((c) => ({ ...c, page: 1, type }))} size="sm" variant={filters.type === type ? 'primary' : 'secondary'}>
              {TYPE_LABELS[type]}
            </Button>
          ))}
        </div>
        <DateRangePicker
          endDate={filters.endDate}
          onEndChange={(value) => setFilters((c) => ({ ...c, endDate: value, page: 1 }))}
          onStartChange={(value) => setFilters((c) => ({ ...c, page: 1, startDate: value }))}
          startDate={filters.startDate}
        />
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
          <SearchInput placeholder="Search by product name" value={filters.search} onChange={(value) => setFilters((c) => ({ ...c, page: 1, search: value }))} />
          <SearchInput placeholder="Search by farmer name" value={filters.farmer} onChange={(value) => setFilters((c) => ({ ...c, farmer: value, page: 1 }))} />
        </div>
      </Card>

      <div style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', marginTop: 18, textAlign: 'right' }}>
        Showing {data?.totalDocs || 0} transactions · Total: {formatKES(totalAmount)}
      </div>

      {/* ✅ FIX: Dim list on page change instead of flashing to empty */}
      <div
        style={{
          display: 'grid',
          gap: 12,
          marginTop: 16,
          minHeight: 80,
          opacity: isFetching ? 0.5 : 1,
          transition: 'opacity 0.2s ease',
          pointerEvents: isFetching ? 'none' : 'auto',
        }}
      >
        {transactions.map((transaction) => (
          <Card key={transaction._id} level="base" padding={16}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(8, minmax(0,1fr))' }}>
              <div>{formatDate(transaction.createdAt)}</div>
              <div>
                <Badge variant={transaction.type === 'sale' ? 'success' : transaction.type === 'write_off' ? 'danger' : transaction.type === 'adjustment' ? 'warning' : 'primary'}>
                  {TYPE_LABELS[transaction.type]}
                </Badge>
              </div>
              <div>{transaction.productId?.name}</div>
              <div>{transaction.userId?.name || '—'}</div>
              <div>{transaction.quantity}</div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(transaction.unitPrice)}</div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(transaction.totalAmount)}</div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>{transaction.reference}</div>
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 10 }}>
              Notes: {transaction.notes || 'No notes'} · Stock: {transaction.previousStock} → {transaction.newStock}
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={data?.page || 1}
        limit={data?.limit || 10}
        onPageChange={(page) => setFilters((c) => ({ ...c, page }))}
        totalDocs={data?.totalDocs || 0}
        totalPages={data?.totalPages || 1}
      />

      <SlidePanel isOpen={activePanel === 'addTransaction'} onClose={closePanel} subtitle="Log stock movement or a farmer purchase" title="Record Transaction">
        <TransactionForm
          isLoading={createTransaction.isPending}
          onCancel={closePanel}
          onSubmit={async (values) => {
            await createTransaction.mutateAsync(values);
            closePanel();
          }}
        />
      </SlidePanel>
    </div>
  );
}

export default TransactionsPage;