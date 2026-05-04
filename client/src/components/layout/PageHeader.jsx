import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeader({ actions, breadcrumbs = [], subtitle, title }) {
  return (
    <header
      style={{
        alignItems: 'flex-start',
        display: 'flex',
        gap: 20,
        justifyContent: 'space-between',
        marginBottom: 32,
      }}
    >
      <div>
        {breadcrumbs.length ? (
          <nav style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} style={{ alignItems: 'center', color: 'var(--color-text-muted)', display: 'inline-flex', fontSize: 12, gap: 8 }}>
                {index ? <ChevronRight size={12} /> : null}
                {crumb.path ? (
                  <Link style={{ color: 'var(--color-amber)' }} to={crumb.path}>
                    {crumb.label}
                  </Link>
                ) : (
                  crumb.label
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, margin: 0 }}>
          {title}
        </h1>
        {subtitle ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '4px 0 0' }}>{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{actions}</div> : null}
    </header>
  );
}

export default PageHeader;
