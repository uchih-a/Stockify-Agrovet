import { ArrowLeftRight, BarChart3, Bell, LayoutDashboard, LogOut, Package, Truck, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import authApi from '@/api/authApi';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import useAlertStore from '@/store/alertStore';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';
import { getInitials, getRoleBadgeVariant } from '@/utils/formatters';
import { ROLES, ROUTES } from '@/utils/constants';

const LeafLogo = () => (
  <svg height="20" viewBox="0 0 32 32" width="20" fill="none">
    <path d="M16.638 3.5C10.893 4.904 6 10.768 6 16.964c0 4.613 3.2 8.025 7.627 8.025 5.43 0 9.63-5.013 9.63-11.581 0-1.818-.295-3.59-.94-5.081 2.551 1.054 4.54 3.367 4.54 6.795 0 6.438-4.778 10.714-11.076 10.714C8.45 25.836 4 21.255 4 14.702 4 8.497 9.13 3.564 16.158 3.564c.326 0 .6.085.238-.064Z" fill="var(--color-primary)"/>
    <path d="M18.537 5.574c3.56.833 6.172 3.652 6.172 7.564 0 3.656-2.167 6.365-5.495 7.604 1.324-1.368 2.248-3.302 2.515-5.585.626-5.174-.974-8.201-3.192-9.583Z" fill="var(--color-amber)"/>
  </svg>
);

// All nav items are for ADMIN only (staff role removed)
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    path: ROUTES.ADMIN_DASHBOARD },
  { icon: Package,         label: 'Inventory',    path: ROUTES.INVENTORY },
  { icon: ArrowLeftRight,  label: 'Transactions', path: ROUTES.TRANSACTIONS },
  { icon: Users,           label: 'Users',        path: ROUTES.USERS },
  { icon: Bell,            label: 'Alerts',       path: ROUTES.ALERTS,   badge: 'alerts' },
  { icon: BarChart3,       label: 'Reports',      path: ROUTES.REPORTS },
  { icon: Truck,           label: 'Suppliers',    path: ROUTES.SUPPLIERS },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const unreadCount = useAlertStore((state) => state.unreadCount);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const theme = useUiStore((state) => state.theme);

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
            Admin Panel
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
                  <span style={{ flex: 1, fontSize: 14 }}>{item.label}</span>
                  {item.badge === 'alerts' && unreadCount > 0 && (
                    <span
                      style={{
                        alignItems: 'center',
                        background: '#b91c1c',
                        borderRadius: 9999,
                        color: '#fff',
                        display: 'inline-flex',
                        fontSize: 10,
                        height: 18,
                        justifyContent: 'center',
                        minWidth: 18,
                        paddingInline: 4,
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
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
            <Badge size="sm" variant={getRoleBadgeVariant(user?.role)}>
              {user?.role}
            </Badge>
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

export default AdminSidebar;
