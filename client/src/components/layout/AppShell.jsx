import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AgrobotFAB } from '@/components/chat/AgrobotFAB';
import { CartOverlay } from '@/components/chat/CartOverlay';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { FarmerSidebar } from '@/components/layout/FarmerSidebar';
import { TopBar } from '@/components/layout/TopBar';

const SIDEBAR_WIDTH = 240;

function useIsLargeScreen() {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= 768;
}

export function AppShell() {
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const location = useLocation();

  const Sidebar = user?.role === 'farmer' ? FarmerSidebar : AdminSidebar;
  const isLargeScreen = useIsLargeScreen();

  // Close mobile sidebar on route change
  useEffect(() => {
    if (!isLargeScreen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isLargeScreen, setSidebarOpen]);

  // On large screens the sidebar is always shown regardless of sidebarOpen state
  const sidebarVisible = isLargeScreen || sidebarOpen;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Mobile backdrop */}
      {!isLargeScreen && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            background: 'rgba(27,28,25,0.45)',
            backdropFilter: 'blur(4px)',
            inset: 0,
            position: 'fixed',
            zIndex: 45,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          height: '100vh',
          left: 0,
          position: 'fixed',
          top: 0,
          transform: sidebarVisible ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`,
          transition: 'transform 250ms ease-out',
          width: SIDEBAR_WIDTH,
          zIndex: 50,
        }}
      >
        <Sidebar />
      </div>

      <TopBar />

      <main
        style={{
          marginLeft: isLargeScreen ? SIDEBAR_WIDTH : 0,
          minHeight: '100vh',
          padding: isLargeScreen ? '96px 48px 40px' : '88px 16px 32px',
        }}
      >
        <Outlet />
      </main>

      {user?.role === 'farmer' ? (
        <>
          <CartOverlay />
          <AgrobotFAB />
        </>
      ) : null}
    </div>
  );
}

export default AppShell;
