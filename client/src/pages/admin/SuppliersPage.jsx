import { Pencil, Plus, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import { SupplierForm } from '@/components/forms/SupplierForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { SlidePanel } from '@/components/ui/SlidePanel';
import { useCreateSupplier, useDeleteSupplier, useGetSuppliers, useUpdateSupplier } from '@/hooks/useSuppliers';
import useUiStore from '@/store/uiStore';
import { formatDate } from '@/utils/formatters';

export function SuppliersPage() {
  const { data } = useGetSuppliers({ limit: 30 });
  const suppliers = data?.docs || [];
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const openPanel = useUiStore((state) => state.openPanel);
  const closePanel = useUiStore((state) => state.closePanel);
  const activePanel = useUiStore((state) => state.activePanel);
  const panelData = useUiStore((state) => state.panelData);
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  return (
    <div>
      <PageHeader
        title="Suppliers"
        actions={
          <Button icon={<Plus size={14} />} onClick={() => openPanel('addSupplier', null)}>
            Add Supplier
          </Button>
        }
      />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {suppliers.map((supplier) => (
          <Card key={supplier._id} level="elevated" onClick={() => setSelectedSupplier(supplier)} padding={20}>
            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: 0 }}>{supplier.name}</h3>
              <Badge variant={supplier.isActive ? 'success' : 'danger'}>{supplier.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: '8px 0 0' }}>{supplier.contactPerson}</p>
            <div style={{ display: 'grid', gap: 4, gridTemplateColumns: 'repeat(2, minmax(0,1fr))', marginTop: 12 }}>
              <span>{supplier.phone}</span>
              <span>{supplier.email}</span>
              <Badge variant="neutral">{supplier.county}</Badge>
              <span>{supplier.productsSupplied?.length || 0} products</span>
              <span>{formatDate(supplier.lastDeliveryDate)}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button onClick={(event) => { event.stopPropagation(); openPanel('editSupplier', supplier); }} size="sm" variant="secondary">
                <Pencil size={14} />
              </Button>
              <Button onClick={(event) => { event.stopPropagation(); openPanel('confirmDeleteSupplier', supplier); }} size="sm" variant="danger">
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={Boolean(selectedSupplier)} onClose={() => setSelectedSupplier(null)} size="md" title={selectedSupplier?.name}>
        {selectedSupplier ? (
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ alignItems: 'center', color: 'var(--color-primary)', display: 'flex', gap: 8 }}>
              <Truck size={18} />
              <span>{selectedSupplier.contactPerson}</span>
            </div>
            <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
              {selectedSupplier.email}
              <br />
              {selectedSupplier.phone}
              <br />
              {selectedSupplier.address}
            </div>
            <Card level="low" padding={16}>
              <h4 style={{ margin: 0 }}>Products</h4>
              <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                {(selectedSupplier.productsSupplied || []).map((product) => (
                  <div key={product._id} style={{ alignItems: 'center', display: 'grid', gap: 10, gridTemplateColumns: 'minmax(0,1fr) auto auto' }}>
                    <span>{product.name}</span>
                    <span>{product.quantity}</span>
                    <span>{formatDate(product.updatedAt)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}
      </Modal>

      <SlidePanel isOpen={activePanel === 'addSupplier' || activePanel === 'editSupplier'} onClose={closePanel} subtitle="Manage supplier relationships and contact details" title={activePanel === 'editSupplier' ? 'Edit Supplier' : 'Add Supplier'}>
        <SupplierForm
          initialValues={panelData || {}}
          isLoading={createSupplier.isPending || updateSupplier.isPending}
          onCancel={closePanel}
          onSubmit={async (values) => {
            if (activePanel === 'editSupplier') {
              await updateSupplier.mutateAsync({ data: values, id: panelData._id });
            } else {
              await createSupplier.mutateAsync(values);
            }
            closePanel();
          }}
        />
      </SlidePanel>

      <ConfirmDialog
        confirmLabel="Delete Supplier"
        description={`Remove ${panelData?.name || 'this supplier'} from your supplier list?`}
        isOpen={activePanel === 'confirmDeleteSupplier'}
        loading={deleteSupplier.isPending}
        onCancel={closePanel}
        onConfirm={async () => {
          await deleteSupplier.mutateAsync(panelData._id);
          closePanel();
        }}
        title="Delete supplier?"
      />
    </div>
  );
}

export default SuppliersPage;
