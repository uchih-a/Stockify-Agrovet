import { format, formatDistanceToNow } from 'date-fns';

const kesFormatter = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatKES = (amount = 0) =>
  kesFormatter.format(Number(amount) || 0).replace('Ksh', 'KES');

export const formatDate = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
};

export const formatRelative = (date) => {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatQuantity = (qty, unit) => `${Number(qty) || 0} ${unit || ''}`.trim();

export const truncate = (str = '', n = 60) =>
  str.length > n ? `${str.slice(0, Math.max(0, n - 3))}...` : str;

export const capitalise = (str = '') =>
  str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : '';

export const getStockVariant = (qtyOrStatus, reorderLevel = 0) => {
  if (typeof qtyOrStatus === 'string') {
    if (qtyOrStatus === 'expired' || qtyOrStatus === 'critical') return 'danger';
    if (qtyOrStatus === 'expiring' || qtyOrStatus === 'low_stock') return 'warning';
    if (qtyOrStatus === 'healthy' || qtyOrStatus === 'in_stock') return 'success';
    return 'neutral';
  }

  const qty = Number(qtyOrStatus) || 0;
  const reorder = Number(reorderLevel) || 0;

  if (qty <= 0) return 'danger';
  if (reorder > 0 && qty <= Math.max(1, Math.floor(reorder * 0.5))) return 'danger';
  if (reorder > 0 && qty <= reorder) return 'warning';
  if (qty > reorder) return 'success';
  return 'neutral';
};

export const getRoleBadgeVariant = (role) => {
  if (role === 'admin') return 'success';
  return 'primary';
};

export const getInitials = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

export const compactNumber = (value = 0) =>
  new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
