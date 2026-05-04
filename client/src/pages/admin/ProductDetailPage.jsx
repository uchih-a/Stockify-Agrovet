import { ArrowLeft, Upload, X } from 'lucide-react';
import { useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDeleteProduct, useGetProduct, useUploadProductImages } from '@/hooks/useProducts';
import { useGetTransactions } from '@/hooks/useTransactions';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table } from '@/components/ui/Table';
import useUiStore from '@/store/uiStore';
import { formatDate, formatKES, getStockVariant } from '@/utils/formatters';
import { TYPE_LABELS } from '@/utils/constants';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { data: product } = useGetProduct(id);
  const { data: transactionsData } = useGetTransactions({ limit: 10, productId: id });
  const uploadImages = useUploadProductImages(id);
  const deleteProduct = useDeleteProduct();
  const openPanel = useUiStore((state) => state.openPanel);
  const closePanel = useUiStore((state) => state.closePanel);
  const activePanel = useUiStore((state) => state.activePanel);

  if (!product) return null;

  const progress = Math.min(100, Math.round((product.quantity / Math.max(product.reorderLevel, 1)) * 100));

  return (
    <div>
      <Link style={{ alignItems: 'center', color: 'var(--color-amber)', display: 'inline-flex', gap: 8, marginBottom: 18 }} to="/admin/inventory">
        <ArrowLeft size={14} />
        Inventory
      </Link>
      <PageHeader
        title={product.name}
        subtitle={product.description}
        actions={
          <>
            <Button onClick={() => openPanel('confirmDeleteProduct', product)} variant="danger">
              Delete
            </Button>
            <Button onClick={() => openPanel('editProduct', product)} variant="secondary">
              Edit
            </Button>
          </>
        }
      />

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1.6fr) minmax(300px,1fr)' }}>
        <div>
          <Card level="elevated">
            <div style={{ display: 'grid', gap: 12, gridTemplateAreas: '"main main side1" "main main side2"', gridTemplateColumns: '2fr 2fr 1fr' }}>
              <div style={{ gridArea: 'main' }}>
                <img alt={product.name} src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80'} style={{ borderRadius: 'var(--radius-lg)', height: 320, objectFit: 'cover', width: '100%' }} />
              </div>
              {[product.images?.[1], product.images?.[2]].map((image, index) => (
                <div key={image?.url || index} style={{ gridArea: index === 0 ? 'side1' : 'side2', position: 'relative' }}>
                  {image ? (
                    <img alt="" src={image.url} style={{ borderRadius: 'var(--radius-lg)', height: 154, objectFit: 'cover', width: '100%' }} />
                  ) : (
                    <button
                      onClick={() => inputRef.current?.click()}
                      style={{ alignItems: 'center', background: 'var(--color-surface-low)', border: 'none', borderRadius: 'var(--radius-lg)', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', gap: 8, height: 154, justifyContent: 'center', width: '100%' }}
                      type="button"
                    >
                      <Upload size={16} />
                      Upload
                    </button>
                  )}
                </div>
              ))}
            </div>
            <input
              ref={inputRef}
              hidden
              multiple
              onChange={(event) => {
                const formData = new FormData();
                Array.from(event.target.files || []).forEach((file) => formData.append('images', file));
                uploadImages.mutate(formData);
              }}
              type="file"
            />
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '20px 0 0' }}>{product.description || 'No description added yet.'}</p>
          </Card>

          <Card level="elevated" style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 14, margin: 0 }}>Transaction History</h3>
            <div style={{ marginTop: 16 }}>
              <Table
                columns={[
                  { key: 'createdAt', header: 'Date', render: (row) => formatDate(row.createdAt) },
                  { key: 'type', header: 'Type', render: (row) => <Badge variant="primary">{TYPE_LABELS[row.type]}</Badge> },
                  { key: 'quantity', header: 'Qty' },
                  { key: 'unitPrice', header: 'Unit Price', render: (row) => <span style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(row.unitPrice)}</span> },
                  { key: 'totalAmount', header: 'Total', render: (row) => <span style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(row.totalAmount)}</span> },
                  { key: 'performedBy', header: 'Performed By', render: (row) => row.performedBy?.name || '—' },
                ]}
                data={transactionsData?.docs || []}
              />
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <Card level="elevated" padding={20}>
            {[
              ['SKU', product.sku],
              ['Price', formatKES(product.price)],
              ['Quantity', product.quantity],
              ['Reorder Level', product.reorderLevel],
              ['Expiry', formatDate(product.expiryDate)],
              ['Batch #', product.batchNumber || '—'],
              ['Supplier', product.supplierId?.name || product.supplier?.name || '—'],
            ].map(([label, value], index) => (
              <div key={label} style={{ background: index % 2 === 0 ? 'var(--color-surface-low)' : 'var(--color-surface)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', marginBottom: 8, padding: '12px 14px' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontFamily: label.includes('SKU') || label.includes('Batch') || label.includes('Price') ? 'var(--font-mono)' : undefined }}>{value}</span>
              </div>
            ))}
            <Badge variant={getStockVariant(product.quantity, product.reorderLevel)}>{getStockVariant(product.quantity, product.reorderLevel)}</Badge>
          </Card>
          <Card level="elevated">
            <h3 style={{ fontSize: 14, margin: 0 }}>Stock Level</h3>
            <div style={{ background: 'var(--color-surface-low)', borderRadius: 9999, height: 12, marginTop: 16, overflow: 'hidden' }}>
              <div style={{ background: progress < 50 ? 'var(--color-danger-text)' : progress < 100 ? 'var(--color-amber)' : 'var(--color-primary)', height: '100%', width: `${progress}%` }} />
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 8 }}>
              {product.quantity} units against a reorder level of {product.reorderLevel}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Delete Product"
        description={`Delete ${product.name} from the catalogue?`}
        isOpen={activePanel === 'confirmDeleteProduct'}
        loading={deleteProduct.isPending}
        onCancel={closePanel}
        onConfirm={async () => {
          await deleteProduct.mutateAsync(product._id);
          closePanel();
          navigate('/admin/inventory');
        }}
        title="Delete Product?"
      />
    </div>
  );
}

export default ProductDetailPage;
