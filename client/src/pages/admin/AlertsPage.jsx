import { CheckCircle2, Eye, EyeOff, PackagePlus, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SlidePanel } from '@/components/ui/SlidePanel';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { useGetAlerts, useMarkAsRead, useResolveAlert } from '@/hooks/useAlerts';
import { useCreateTransaction } from '@/hooks/useTransactions';
import useAlertStore from '@/store/alertStore';
import useUiStore from '@/store/uiStore';
import { formatRelative } from '@/utils/formatters';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Expiry', value: 'expiry_warning' },
  { label: 'Expired', value: 'expired' },
  { label: 'Resolved', value: 'resolved' },
];

const severityColor = (severity) => {
  if (severity === 'critical') return 'var(--color-danger-text)';
  if (severity === 'warning') return 'var(--color-amber)';
  return 'var(--color-success-text)';
};

export function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const openPanel = useUiStore((state) => state.openPanel);
  const closePanel = useUiStore((state) => state.closePanel);
  const activePanel = useUiStore((state) => state.activePanel);
  const panelData = useUiStore((state) => state.panelData);

  const { data } = useGetAlerts({ filter, limit: 50 });
  const alerts = data?.docs || [];

  const markAsRead = useMarkAsRead();
  const resolveAlert = useResolveAlert();
  const createTransaction = useCreateTransaction();
  const setUnreadCount = useAlertStore((state) => state.setUnreadCount);

  // Auto-mark visible alerts as read
  useEffect(() => {
    const unreadIds = alerts.filter((a) => !a.isRead).map((a) => a._id);
    if (unreadIds.length) {
      markAsRead.mutate(unreadIds);
      setUnreadCount(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts.length]);

  const unreadCount = useMemo(
    () => alerts.filter((a) => !a.isRead).length,
    [alerts],
  );

  const handleCreateRestock = (alert) => {
    // Pre-fill the transaction form with data from the alert's product
    openPanel('restockFromAlert', {
      productId: alert.productId?._id || alert.productId,
      productName: alert.productId?.name || 'Product',
      alertId: alert._id,
    });
  };

  const handleRestockSubmit = async (values) => {
    await createTransaction.mutateAsync({ ...values, type: 'restock' });
    // Also resolve the alert
    if (panelData?.alertId) {
      await resolveAlert.mutateAsync(panelData.alertId);
    }
    closePanel();
  };

  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle="Review stock warnings, expiry risks, and operational notifications."
        actions={
          <Button
            onClick={() => markAsRead.mutate(alerts.map((a) => a._id))}
            variant="secondary"
          >
            Mark All as Read
          </Button>
        }
      />

      {/* Filter tabs */}
      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {unreadCount > 0 && <Badge variant="danger">{unreadCount} unread</Badge>}
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            size="sm"
            variant={filter === tab.value ? 'primary' : 'secondary'}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Alert list */}
      <div style={{ display: 'grid', gap: 8 }}>
        {alerts.length === 0 && (
          <div
            style={{
              background: 'var(--color-surface-low)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--color-text-muted)',
              fontSize: 14,
              padding: '40px 24px',
              textAlign: 'center',
            }}
          >
            No alerts for this filter.
          </div>
        )}

        {alerts.map((alert) => {
          const isExpanded = expandedId === alert._id;
          const accentColor = severityColor(alert.severity);
          const isLowStock =
            alert.type === 'low_stock' ||
            alert.type === 'expiry_warning' ||
            alert.type === 'expired';

          return (
            <Card
              key={alert._id}
              level="low"
              padding={0}
              style={{
                opacity: alert.isResolved ? 0.6 : 1,
                overflow: 'hidden',
                transition: 'opacity 200ms',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '4px minmax(0,1fr)' }}>
                {/* Severity accent bar */}
                <span style={{ background: accentColor }} />

                <div style={{ padding: '14px 16px 14px 20px' }}>
                  {/* Main row */}
                  <div
                    style={{
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      display: 'grid',
                      gap: 16,
                      gridTemplateColumns: 'auto minmax(0,1fr) auto',
                    }}
                    onClick={() =>
                      setExpandedId((current) =>
                        current === alert._id ? null : alert._id,
                      )
                    }
                  >
                    {/* Icon + type badge */}
                    <div style={{ alignItems: 'center', display: 'flex', gap: 8, paddingTop: 2 }}>
                      <ShieldAlert size={18} style={{ color: accentColor, flexShrink: 0 }} />
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'danger'
                            : alert.severity === 'warning'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {alert.type?.replaceAll('_', ' ')}
                      </Badge>
                    </div>

                    {/* Message */}
                    <div>
                      <div
                        style={{
                          color: 'var(--color-amber)',
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 3,
                        }}
                      >
                        {alert.productId?.name || 'System Alert'}
                      </div>
                      <div
                        style={{
                          color: 'var(--color-text-muted)',
                          fontSize: 13,
                          lineHeight: 1.5,
                          overflow: isExpanded ? 'visible' : 'hidden',
                          textOverflow: isExpanded ? 'clip' : 'ellipsis',
                          whiteSpace: isExpanded ? 'normal' : 'nowrap',
                        }}
                      >
                        {alert.message}
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'grid', gap: 8, justifyItems: 'end' }}
                    >
                      <span
                        style={{ color: 'var(--color-text-hint)', fontSize: 11, whiteSpace: 'nowrap' }}
                      >
                        {formatRelative(alert.createdAt)}
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!alert.isResolved && (
                          <Button
                            onClick={() => resolveAlert.mutate(alert._id)}
                            size="sm"
                            variant="secondary"
                          >
                            Resolve
                          </Button>
                        )}
                        <Button
                          onClick={() =>
                            setExpandedId((cur) =>
                              cur === alert._id ? null : alert._id,
                            )
                          }
                          size="sm"
                          variant="tertiary"
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div
                      style={{
                        background: 'var(--color-surface-low)',
                        borderRadius: 'var(--radius-md)',
                        marginTop: 14,
                        padding: '14px 16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gap: '8px 24px',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                          marginBottom: 14,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: 'var(--color-text-hint)',
                              fontSize: 11,
                              fontWeight: 500,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Current Stock
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 16,
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            {alert.productId?.quantity ?? '—'}{' '}
                            {alert.productId?.unit || ''}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              color: 'var(--color-text-hint)',
                              fontSize: 11,
                              fontWeight: 500,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Reorder Level
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 16,
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            {alert.productId?.reorderLevel ?? '—'}
                          </div>
                        </div>
                        {alert.productId?.expiryDate && (
                          <div>
                            <div
                              style={{
                                color: 'var(--color-text-hint)',
                                fontSize: 11,
                                fontWeight: 500,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                              }}
                            >
                              Expiry Date
                            </div>
                            <div
                              style={{
                                color: 'var(--color-danger-text)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 14,
                                marginTop: 2,
                              }}
                            >
                              {new Date(alert.productId.expiryDate).toLocaleDateString('en-KE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Create Restock button — only for low-stock alerts */}
                      {isLowStock && !alert.isResolved && alert.productId && (
                        <Button
                          icon={<PackagePlus size={14} />}
                          onClick={() => handleCreateRestock(alert)}
                          variant="primary"
                          size="sm"
                        >
                          Create Restock Transaction
                        </Button>
                      )}

                      {alert.isResolved && (
                        <div
                          style={{
                            alignItems: 'center',
                            color: 'var(--color-success-text)',
                            display: 'flex',
                            fontSize: 12,
                            gap: 6,
                          }}
                        >
                          <CheckCircle2 size={14} />
                          Resolved by {alert.resolvedBy?.name || 'system'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Restock slide panel */}
      <SlidePanel
        isOpen={activePanel === 'restockFromAlert'}
        onClose={closePanel}
        title={`Restock — ${panelData?.productName || 'Product'}`}
        subtitle="Record a new stock delivery to resolve this alert."
      >
        {activePanel === 'restockFromAlert' && (
          <TransactionForm
            initialValues={{
              type: 'restock',
              productId: panelData?.productId,
            }}
            isLoading={createTransaction.isPending}
            onCancel={closePanel}
            onSubmit={handleRestockSubmit}
          />
        )}
      </SlidePanel>
    </div>
  );
}

export default AlertsPage;
