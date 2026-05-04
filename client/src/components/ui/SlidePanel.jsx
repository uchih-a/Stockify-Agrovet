import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';

const widthMap = {
  lg: 640,
  md: 480,
};

export function SlidePanel({
  children,
  footer,
  isOpen,
  onClose,
  subtitle,
  title,
  width = 'md',
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        background: 'rgba(27,28,25,0.45)',
        backdropFilter: 'blur(4px)',
        inset: 0,
        position: 'fixed',
        zIndex: 120,
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <aside
        style={{
          background: 'var(--color-surface)',
          boxShadow: 'var(--shadow-float)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          marginLeft: 'auto',
          maxWidth: '100%',
          opacity: 1,
          transform: 'translateX(0)',
          transition: 'transform 250ms ease-out, opacity 250ms ease',
          width: widthMap[width] || widthMap.md,
        }}
      >
        <header
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: 64,
            padding: '12px 24px',
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>{title}</h3>
            {subtitle ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: '4px 0 0' }}>{subtitle}</p>
            ) : null}
          </div>
          <Button
            aria-label="Close panel"
            onClick={onClose}
            size="sm"
            style={{ paddingInline: 8 }}
            variant="tertiary"
          >
            <X size={18} />
          </Button>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>{children}</div>
        {footer ? (
          <footer
            style={{
              background: 'var(--color-surface-low)',
              bottom: 0,
              padding: '16px 24px',
              position: 'sticky',
            }}
          >
            {footer}
          </footer>
        ) : null}
      </aside>
    </div>,
    document.body,
  );
}

export default SlidePanel;
