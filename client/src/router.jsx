import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import useAuthStore from '@/store/authStore';
import { ROLES, ROUTES } from '@/utils/constants';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { InventoryPage } from '@/pages/admin/InventoryPage';
import { ProductDetailPage } from '@/pages/admin/ProductDetailPage';
import { TransactionsPage } from '@/pages/admin/TransactionsPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { AlertsPage } from '@/pages/admin/AlertsPage';
import { SuppliersPage } from '@/pages/admin/SuppliersPage';
import { ReportsPage } from '@/pages/admin/ReportsPage';
import { FarmerDashboardPage } from '@/pages/farmer/FarmerDashboardPage';
import { ShopPage } from '@/pages/farmer/ShopPage';
import { OrdersPage } from '@/pages/farmer/OrdersPage';
import { TransactionHistoryPage } from '@/pages/farmer/TransactionHistoryPage';
import { FarmerProfilePage } from '@/pages/farmer/FarmerProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function HomeRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) return <HomePage />;
  if (user?.role === ROLES.FARMER) return <Navigate replace to={ROUTES.FARMER_DASHBOARD} />;
  return <Navigate replace to={ROUTES.ADMIN_DASHBOARD} />;
}

function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate replace to={ROUTES.LOGIN} />;
  return <Outlet />;
}

function RoleGuard({ allowedRoles }) {
  const user = useAuthStore((state) => state.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate replace to={ROUTES.HOME} />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: ROUTES.HOME,     element: <HomeRoute /> },
  { path: ROUTES.LOGIN,    element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  { path: ROUTES.FORGOT,   element: <ForgotPasswordPage /> },

  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          // Admin-only routes
          {
            element: <RoleGuard allowedRoles={[ROLES.ADMIN]} />,
            children: [
              { path: ROUTES.ADMIN_DASHBOARD,      element: <AdminDashboardPage /> },
              { path: ROUTES.INVENTORY,            element: <InventoryPage /> },
              { path: '/admin/inventory/:id',      element: <ProductDetailPage /> },
              { path: ROUTES.TRANSACTIONS,         element: <TransactionsPage /> },
              { path: ROUTES.USERS,                element: <UsersPage /> },
              { path: ROUTES.ALERTS,               element: <AlertsPage /> },
              { path: ROUTES.SUPPLIERS,            element: <SuppliersPage /> },
              { path: ROUTES.REPORTS,              element: <ReportsPage /> },
            ],
          },
          // Farmer-only routes
          {
            element: <RoleGuard allowedRoles={[ROLES.FARMER]} />,
            children: [
              { path: ROUTES.FARMER_DASHBOARD, element: <FarmerDashboardPage /> },
              { path: ROUTES.FARMER_SHOP,      element: <ShopPage /> },
              { path: ROUTES.FARMER_ORDERS,    element: <OrdersPage /> },
              { path: ROUTES.FARMER_HISTORY,   element: <TransactionHistoryPage /> },
              { path: ROUTES.FARMER_PROFILE,   element: <FarmerProfilePage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

export default router;
