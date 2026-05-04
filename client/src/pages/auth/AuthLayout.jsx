import { Check, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthLayout({ children }) {
  return (
    <div
      style={{
        background: 'var(--color-bg)',
        display: 'grid',
        gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'minmax(0,1.5fr) minmax(0,1fr)' : '1fr',
        minHeight: '100vh',
      }}
    >
      <aside
        style={{
          background: 'var(--harvest-gradient)',
          color: '#ffffff',
          display: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: 48,
          position: 'relative',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
          <Sprout size={20} />
          <span style={{ fontSize: 18, fontWeight: 700 }}>AgroVet</span>
        </div>
        <div
          aria-hidden="true"
          style={{
            color: 'rgba(255,255,255,0.18)',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(88px, 12vw, 120px)',
            lineHeight: 0.85,
            marginTop: 40,
          }}
        >
          Grow.
          <br />
          Track.
          <br />
          Thrive.
        </div>
        <div style={{ marginTop: 28, maxWidth: 420 }}>
          <p style={{ fontSize: 18, lineHeight: 1.7, margin: 0, opacity: 0.82 }}>
            Precision tools for the modern agrovet.
          </p>
          <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
            {[
              'Track stock and expiry in real time',
              'Serve farmers with data-backed recommendations',
              'Run sales, reports, and AgroBot from one workspace',
            ].map((item) => (
              <span key={item} style={{ alignItems: 'center', display: 'inline-flex', gap: 10, opacity: 0.75 }}>
                <Check size={16} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </aside>

      <main
        style={{
          alignItems: 'center',
          background: 'var(--color-surface)',
          display: 'flex',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 480, width: '100%' }}>
          <Link
            style={{ alignItems: 'center', color: 'var(--color-primary)', display: 'inline-flex', fontWeight: 700, gap: 8, marginBottom: 30 }}
            to="/"
          >
            <Sprout size={18} />
            AgroVet
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
