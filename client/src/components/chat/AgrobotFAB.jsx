import { useEffect, useState } from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';

export function AgrobotFAB() {
  const [expanded, setExpanded] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ bottom: 24, position: 'fixed', right: 24, zIndex: 90 }}>
      {!expanded ? (
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            bottom: 68,
            boxShadow: 'var(--shadow-card)',
            color: 'var(--color-text-primary)',
            fontSize: 12,
            opacity: 1,
            padding: '6px 10px',
            position: 'absolute',
            right: 0,
          }}
        >
          Ask AgroBot
        </div>
      ) : null}
      {showPulse && !expanded ? (
        <span
          aria-hidden="true"
          style={{
            animation: 'pulse-scale 2s ease-out infinite',
            background: 'rgba(15,82,56,0.18)',
            borderRadius: '9999px',
            inset: 0,
            position: 'absolute',
            transform: 'scale(1.8)',
          }}
        />
      ) : null}
      <ChatPanel expanded={expanded} onClose={() => setExpanded(false)} onMinimize={() => setExpanded(false)} setExpanded={setExpanded} />
    </div>
  );
}

export default AgrobotFAB;
