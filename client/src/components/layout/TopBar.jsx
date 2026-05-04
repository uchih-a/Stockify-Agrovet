import { Bell, Menu, ShoppingCart, User2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGetUnreadCount } from '@/hooks/useAlerts';
import useAlertStore from '@/store/alertStore';
import { cartSelectors, useCartStore } from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';
import { getInitials } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

const titleMap = {
  [ROUTES.ADMIN_DASHBOARD]: 'Dashboard',
  [ROUTES.ALERTS]: 'Alerts',
  [ROUTES.INVENTORY]: 'Inventory',
  [ROUTES.REPORTS]: 'Reports & Analytics',
  [ROUTES.SUPPLIERS]: 'Suppliers',
  [ROUTES.TRANSACTIONS]: 'Transactions',
  [ROUTES.USERS]: 'Users',
  [ROUTES.FARMER_DASHBOARD]: 'Dashboard',
  [ROUTES.FARMER_HISTORY]: 'Transaction History',
  [ROUTES.FARMER_ORDERS]: 'My Orders',
  [ROUTES.FARMER_SHOP]: 'Shop',
  [ROUTES.FARMER_PROFILE]: 'My Profile',
};

function useIsLargeScreen() {
  const [large, setLarge] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  useEffect(() => {
    const handler = () => setLarge(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return large;
}

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore(cartSelectors.totalItems);
  const unreadCount = useAlertStore((state) => state.unreadCount);
  const setUnreadCount = useAlertStore((state) => state.setUnreadCount);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLargeScreen = useIsLargeScreen();

  const isAdminView = user?.role === 'admin';
  const { data: unreadPayload } = useGetUnreadCount();

  useEffect(() => {
    if (isAdminView) {
      const nextCount = unreadPayload?.count ?? unreadPayload ?? 0;
      setUnreadCount(nextCount);
    }
  }, [isAdminView, setUnreadCount, unreadPayload]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const title = useMemo(() => {
    if (titleMap[location.pathname]) return titleMap[location.pathname];
    if (location.pathname.startsWith('/admin/inventory/')) return 'Product Detail';
    return 'AgroVet';
  }, [location.pathname]);

  return (
    <header
      style={{
        alignItems: 'center',
        background: isScrolled ? 'rgba(240,236,227,0.92)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        display: 'flex',
        height: 64,
        justifyContent: 'space-between',
        left: isLargeScreen ? 240 : 0,
        padding: '0 20px',
        position: 'fixed',
        right: 0,
        top: 0,
        transition: 'background 300ms ease, backdrop-filter 300ms ease',
        zIndex: 40,
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
        {/* Hamburger — only visible on mobile/tablet */}
        {!isLargeScreen && (
          <Button
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            onClick={toggleSidebar}
            size="sm"
            style={{ paddingInline: 8 }}
            type="button"
            variant="tertiary"
          >
            <Menu size={18} />
          </Button>
        )}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: 0 }}>{title}</h2>
      </div>

      <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
        <ThemeToggle />

        {isAdminView ? (
          <button
            onClick={() => navigate(ROUTES.ALERTS)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              padding: 0,
              position: 'relative',
            }}
            type="button"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  alignItems: 'center',
                  background: '#b91c1c',
                  borderRadius: 9999,
                  color: '#fff',
                  display: 'inline-flex',
                  fontSize: 10,
                  height: 16,
                  justifyContent: 'center',
                  position: 'absolute',
                  right: -6,
                  top: -6,
                  width: 16,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={toggleCart}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              padding: 0,
              position: 'relative',
            }}
            type="button"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span
                style={{
                  alignItems: 'center',
                  background: 'var(--color-amber)',
                  borderRadius: 9999,
                  color: '#fff',
                  display: 'inline-flex',
                  fontSize: 10,
                  height: 16,
                  justifyContent: 'center',
                  position: 'absolute',
                  right: -6,
                  top: -6,
                  width: 16,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        )}

        {/* User avatar dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            style={{
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              gap: 10,
            }}
            type="button"
          >
            <span
              style={{
                alignItems: 'center',
                background: 'var(--color-surface-mid)',
                borderRadius: '9999px',
                display: 'inline-flex',
                fontSize: 13,
                fontWeight: 700,
                height: 32,
                justifyContent: 'center',
                width: 32,
              }}
            >
              {user?.name ? getInitials(user.name) : <User2 size={14} />}
            </span>
            {isLargeScreen && (
              <span>{user?.name}</span>
            )}
          </button>

          {menuOpen && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-float)',
                display: 'grid',
                minWidth: 160,
                padding: 8,
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                zIndex: 60,
              }}
            >
              {user?.role === 'farmer' && (
                <Link
                  onClick={() => setMenuOpen(false)}
                  style={{ color: 'var(--color-text-primary)', padding: '10px 12px', textDecoration: 'none', display: 'block' }}
                  to={ROUTES.FARMER_PROFILE}
                >
                  My Profile
                </Link>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  useAuthStore.getState().clearAuth();
                  navigate(ROUTES.LOGIN);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-danger-text)',
                  cursor: 'pointer',
                  padding: '10px 12px',
                  textAlign: 'left',
                }}
                type="button"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
