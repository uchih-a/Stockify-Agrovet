import { Button } from '@/components/ui/Button';

export function EmptyState({ action, description, icon, title }) {
  return (
    <div
      style={{
        alignItems: 'center',
        color: 'var(--color-text-primary)',
        display: 'grid',
        justifyItems: 'center',
        padding: '32px 16px',
        textAlign: 'center',
      }}
    >
      <div style={{ color: 'var(--color-text-hint)', marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>{title}</h3>
      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: 14,
          lineHeight: 1.6,
          margin: '8px 0 0',
          maxWidth: 420,
        }}
      >
        {description}
      </p>
      {action ? (
        <Button onClick={action.onClick} style={{ marginTop: 18 }} variant={action.variant || 'primary'}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;
