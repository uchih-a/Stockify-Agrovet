import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export function ConfirmDialog({
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  description,
  isOpen,
  loading = false,
  onCancel,
  onConfirm,
  title,
}) {
  const danger = confirmVariant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={loading ? undefined : onCancel} size="sm" title={title}>
      <div style={{ display: 'grid', gap: 18 }}>
        <div style={{ color: danger ? 'var(--color-danger-text)' : 'var(--color-warning-text)' }}>
          {danger ? <Trash2 size={28} /> : <AlertTriangle size={28} />}
        </div>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>{description}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button disabled={loading} onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button loading={loading} onClick={onConfirm} variant={confirmVariant}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
