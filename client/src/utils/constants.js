export const ROLES = Object.freeze({
  ADMIN: 'admin',
  FARMER: 'farmer',
});

export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT: '/forgot-password',
  ADMIN_DASHBOARD: '/admin',
  INVENTORY: '/admin/inventory',
  PRODUCT_DETAIL: '/admin/inventory/:id',
  TRANSACTIONS: '/admin/transactions',
  USERS: '/admin/users',
  ALERTS: '/admin/alerts',
  SUPPLIERS: '/admin/suppliers',
  REPORTS: '/admin/reports',
  FARMER_DASHBOARD: '/farmer',
  FARMER_SHOP: '/farmer/shop',
  FARMER_ORDERS: '/farmer/orders',
  FARMER_HISTORY: '/farmer/history',
  FARMER_PROFILE: '/farmer/profile',
});

export const PRODUCT_CATEGORIES = Object.freeze([
  'pesticide',
  'animal_feed',
  'veterinary_medicine',
  'equipment',
  'other',
]);

export const TRANSACTION_TYPES = Object.freeze([
  'sale',
  'restock',
  'adjustment',
  'return',
  'write_off',
]);

export const ALERT_TYPES = Object.freeze([
  'low_stock',
  'expiry_warning',
  'expired',
  'system',
  'restock_complete',
]);

export const UNITS = Object.freeze([
  'kg',
  'g',
  'litre',
  'ml',
  'piece',
  'pack',
  'bag',
  'bottle',
  'vial',
]);

export const KENYAN_COUNTIES = Object.freeze([
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo-Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  'Murang’a',
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita-Taveta',
  'Tana River',
  'Tharaka-Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot',
]);

export const CATEGORY_LABELS = Object.freeze({
  animal_feed: 'Animal Feed',
  equipment: 'Equipment',
  other: 'Other',
  pesticide: 'Pesticide',
  veterinary_medicine: 'Veterinary Medicine',
});

export const TYPE_LABELS = Object.freeze({
  adjustment: 'Adjustment',
  restock: 'Restock',
  return: 'Return',
  sale: 'Sale',
  write_off: 'Write-off',
});
