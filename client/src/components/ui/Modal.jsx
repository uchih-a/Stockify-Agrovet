import { X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';

const sizeMap = {
  lg: 720,
  md: 560,
  sm: 400,
  xl: 900,
};

export function Modal({ children, isOpen, onClose, size = 'md', title }) {
  const dialogRef = useRef(null);
  const lastActiveElement = useRef(null);
  const width = useMemo(() => sizeMap[size] || sizeMap.md, [size]);

  useEffect(() => {
    if (!isOpen) return undefined;

    lastActiveElement.current = document.activeElement;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleEscape);
    setTimeout(() => dialogRef.current?.focus(), 0);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = bodyOverflow;
      lastActiveElement.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      style={{
        alignItems: 'center',
        background: 'rgba(27,28,25,0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        inset: 0,
        justifyContent: 'center',
        opacity: 1,
        padding: 20,
        position: 'fixed',
        transition: 'opacity 200ms ease',
        zIndex: 110,
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-float)',
          maxHeight: '85vh',
          maxWidth: '100%',
          overflow: 'hidden',
          transform: 'translateY(0)',
          transition: 'transform 250ms ease, opacity 250ms ease',
          width,
        }}
      >
        <header
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px 24px',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>{title}</h3>
          <Button
            aria-label="Close modal"
            onClick={onClose}
            size="sm"
            style={{ paddingInline: 8 }}
            variant="tertiary"
          >
            <X size={18} />
          </Button>
        </header>
        <div
          style={{
            background: 'var(--color-surface-low)',
            maxHeight: 'calc(85vh - 72px)',
            overflowY: 'auto',
            padding: 24,
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
