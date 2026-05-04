import { ClipboardList, Home, LogOut, Receipt, ShoppingBag, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import authApi from '@/api/authApi';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';
import { getInitials } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

const navItems = [
  { icon: Home,          label: 'Dashboard', path: ROUTES.FARMER_DASHBOARD },
  { icon: ShoppingBag,   label: 'Shop',      path: ROUTES.FARMER_SHOP },
  { icon: ClipboardList, label: 'My Orders', path: ROUTES.FARMER_ORDERS },
  { icon: Receipt,       label: 'History',   path: ROUTES.FARMER_HISTORY },
  { icon: User,          label: 'Profile',   path: ROUTES.FARMER_PROFILE },
];

const LeafLogo = () => (
  <svg height="20" viewBox="0 0 32 32" width="20" fill="none">
    <path d="M16.638 3.5C10.893 4.904 6 10.768 6 16.964c0 4.613 3.2 8.025 7.627 8.025 5.43 0 9.63-5.013 9.63-11.581 0-1.818-.295-3.59-.94-5.081 2.551 1.054 4.54 3.367 4.54 6.795 0 6.438-4.778 10.714-11.076 10.714C8.45 25.836 4 21.255 4 14.702 4 8.497 9.13 3.564 16.158 3.564c.326 0 .6.085.238-.064Z" fill="var(--color-primary)"/>
    <path d="M18.537 5.574c3.56.833 6.172 3.652 6.172 7.564 0 3.656-2.167 6.365-5.495 7.604 1.324-1.368 2.248-3.302 2.515-5.585.626-5.174-.974-8.201-3.192-9.583Z" fill="var(--color-amber)"/>
  </svg>
);

export function FarmerSidebar() {
  const navigate = useNavigate();
  const theme = useUiStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <aside
      style={{
        background: theme === 'dark' ? 'rgba(20,26,18,0.95)' : 'rgba(240,236,227,0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'space-between',
        left: 0,
        overflowY: 'auto',
        padding: 16,
        position: 'fixed',
        top: 0,
        width: 240,
        zIndex: 30,
      }}
    >
      {/* Top: logo + nav */}
      <div>
        <div style={{ padding: 8 }}>
          <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
            <LeafLogo />
            <span style={{ color: 'var(--color-primary)', fontSize: 18, fontWeight: 700 }}>
              AgroVet
            </span>
          </div>
          <p
            style={{
              color: 'var(--color-text-hint)',
              fontSize: 11,
              letterSpacing: '0.08em',
              margin: '8px 0 0',
              textTransform: 'uppercase',
            }}
          >
            Farmer Workspace
          </p>
        </div>

        <nav style={{ display: 'grid', gap: 2, marginTop: 18, padding: 8 }}>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {({ isActive }) => (
                <span
                  style={{
                    alignItems: 'center',
                    background: isActive ? 'var(--color-primary)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                    display: 'flex',
                    gap: 10,
                    padding: '10px 14px',
                    transition: 'background 200ms ease, color 200ms ease',
                  }}
                >
                  <item.icon size={18} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14 }}>{item.label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom: user info + logout */}
      <div style={{ padding: '16px 12px' }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
          <div
            style={{
              alignItems: 'center',
              background: 'var(--color-primary-surface)',
              borderRadius: '9999px',
              color: 'var(--color-primary)',
              display: 'flex',
              flexShrink: 0,
              fontSize: 14,
              fontWeight: 700,
              height: 36,
              justifyContent: 'center',
              width: 36,
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.name}
            </div>
            <Badge size="sm" variant="primary">Farmer</Badge>
          </div>
        </div>
        <Button
          icon={<LogOut size={14} />}
          onClick={handleLogout}
          size="sm"
          style={{ marginTop: 12 }}
          variant="tertiary"
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

export default FarmerSidebar;
