import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '@/components/forms/ProductForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { SlidePanel } from '@/components/ui/SlidePanel';
import { Table } from '@/components/ui/Table';
import { useCreateProduct, useDeleteProduct, useGetProducts, useUpdateProduct } from '@/hooks/useProducts';
import useUiStore from '@/store/uiStore';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import { formatDate, formatKES, getStockVariant } from '@/utils/formatters';

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Critical', value: 'critical' },
  { label: 'Expiring', value: 'expiring' },
  { label: 'Expired', value: 'expired' },
];

const sortOptions = [
  { label: 'Name A-Z', value: 'name' },
  { label: 'Price', value: '-price' },
  { label: 'Quantity', value: '-quantity' },
  { label: 'Expiry', value: 'expiryDate' },
];

export function InventoryPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category: 'all', page: 1, search: '', sort: 'name', status: 'all' });
  const [selectedIds, setSelectedIds] = useState([]);
  const openPanel = useUiStore((state) => state.openPanel);
  const closePanel = useUiStore((state) => state.closePanel);
  const activePanel = useUiStore((state) => state.activePanel);
  const panelData = useUiStore((state) => state.panelData);

  // ✅ FIX: Destructure isFetching
  const { data, isFetching } = useGetProducts({ ...filters, limit: 10 });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const products = data?.docs || [];
  const totalValue = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const lowStockCount = products.filter((product) => product.quantity <= product.reorderLevel).length;

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteProduct.mutateAsync(id);
    }
    setSelectedIds([]);
  };

  const panelMode = activePanel === 'editProduct' ? 'edit' : activePanel === 'addProduct' ? 'create' : null;

  const tableColumns = useMemo(
    () => [
      {
        key: 'select',
        width: 48,
        header: (
          <input
            checked={products.length > 0 && selectedIds.length === products.length}
            onChange={(event) => setSelectedIds(event.target.checked ? products.map((p) => p._id) : [])}
            type="checkbox"
          />
        ),
        render: (row) => (
          <input
            checked={selectedIds.includes(row._id)}
            onChange={(event) =>
              setSelectedIds((current) =>
                event.target.checked ? [...current, row._id] : current.filter((id) => id !== row._id),
              )
            }
            type="checkbox"
          />
        ),
      },
      {
        key: 'image',
        header: 'Image',
        width: 60,
        render: (row) => (
          <img
            alt={row.name}
            src={row.images?.[0]?.url || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=200&q=80'}
            style={{ borderRadius: '9999px', height: 40, objectFit: 'cover', width: 40 }}
          />
        ),
      },
      {
        key: 'name',
        header: 'Name + SKU',
        render: (row) => (
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{row.sku}</div>
          </div>
        ),
      },
      { key: 'category', header: 'Category', width: 120, render: (row) => <Badge variant="primary">{row.category}</Badge> },
      { key: 'price', header: 'Price', width: 120, render: (row) => <span style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(row.price)}</span> },
      {
        key: 'quantity',
        header: 'Qty',
        width: 80,
        render: (row) => <span style={{ color: row.quantity <= row.reorderLevel ? 'var(--color-amber)' : undefined, fontWeight: 700 }}>{row.quantity}</span>,
      },
      { key: 'status', header: 'Status', width: 120, render: (row) => <Badge variant={getStockVariant(row.quantity, row.reorderLevel)}>{getStockVariant(row.quantity, row.reorderLevel)}</Badge> },
      { key: 'expiryDate', header: 'Expiry', width: 110, render: (row) => formatDate(row.expiryDate) },
      {
        key: 'actions',
        header: 'Actions',
        width: 90,
        render: (row) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={(e) => { e.stopPropagation(); openPanel('editProduct', row); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }} type="button">
              <Pencil size={14} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); openPanel('confirmDelete', row); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger-text)', cursor: 'pointer' }} type="button">
              <Trash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [openPanel, products, selectedIds],
  );

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle={`${data?.totalDocs || 0} products in stock`}
        actions={
          <Button icon={<Plus size={14} />} onClick={() => openPanel('addProduct', null)}>
            Add Product
          </Button>
        }
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <Badge variant="neutral">Total SKUs: {data?.totalDocs || 0}</Badge>
        <Badge variant="neutral">Total Value: {formatKES(totalValue)}</Badge>
        <Badge variant={lowStockCount > 0 ? 'warning' : 'success'}>Low Stock: {lowStockCount}</Badge>
      </div>
      <Card level="low" padding={16} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'minmax(0,1fr) repeat(3, 220px)' }}>
          <SearchInput value={filters.search} onChange={(value) => setFilters((c) => ({ ...c, page: 1, search: value }))} />
          <Select options={[{ label: 'All Categories', value: 'all' }, ...PRODUCT_CATEGORIES.map((cat) => ({ label: cat, value: cat }))]} value={filters.category} onChange={(e) => setFilters((c) => ({ ...c, category: e.target.value, page: 1 }))} />
          <Select options={statusOptions} value={filters.status} onChange={(e) => setFilters((c) => ({ ...c, page: 1, status: e.target.value }))} />
          <Select options={sortOptions} value={filters.sort} onChange={(e) => setFilters((c) => ({ ...c, sort: e.target.value }))} />
        </div>
        {filters.search || filters.category !== 'all' || filters.status !== 'all' ? (
          <Button onClick={() => setFilters({ category: 'all', page: 1, search: '', sort: 'name', status: 'all' })} size="sm" variant="secondary">
            Reset Filters
          </Button>
        ) : null}
      </Card>

      {selectedIds.length ? (
        <Card level="base" padding={16} style={{ marginTop: 16 }}>
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <span>{selectedIds.length} items selected</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={handleBulkDelete} size="sm" variant="danger">Delete Selected</Button>
              <Button onClick={() => {}} size="sm" variant="secondary">Export</Button>
            </div>
          </div>
        </Card>
      ) : null}

      {/* ✅ FIX: Dim table on page change instead of flash */}
      <div
        style={{
          marginTop: 16,
          opacity: isFetching ? 0.5 : 1,
          transition: 'opacity 0.2s ease',
          pointerEvents: isFetching ? 'none' : 'auto',
        }}
      >
        <Table columns={tableColumns} data={products} onRowClick={(row) => navigate(`/admin/inventory/${row._id}`)} />
      </div>

      <Pagination
        currentPage={data?.page || 1}
        limit={data?.limit || 10}
        onPageChange={(page) => setFilters((c) => ({ ...c, page }))}
        totalDocs={data?.totalDocs || 0}
        totalPages={data?.totalPages || 1}
      />

      <SlidePanel
        footer={null}
        isOpen={Boolean(panelMode)}
        onClose={closePanel}
        subtitle={panelMode === 'edit' ? 'Update product details' : 'Add a new product'}
        title={panelMode === 'edit' ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          initialValues={panelData || {}}
          isLoading={createProduct.isPending || updateProduct.isPending}
          onCancel={closePanel}
          onSubmit={async (values) => {
            if (panelMode === 'edit') {
              await updateProduct.mutateAsync({ data: values, id: panelData._id });
            } else {
              await createProduct.mutateAsync(values);
            }
            closePanel();
          }}
        />
      </SlidePanel>

      <ConfirmDialog
        confirmLabel="Delete Product"
        description={`This will permanently remove ${panelData?.name || 'this product'} from inventory.`}
        isOpen={activePanel === 'confirmDelete'}
        loading={deleteProduct.isPending}
        onCancel={closePanel}
        onConfirm={async () => {
          await deleteProduct.mutateAsync(panelData._id);
          closePanel();
        }}
        title="Delete Product?"
      />
    </div>
  );
}

export default InventoryPage;