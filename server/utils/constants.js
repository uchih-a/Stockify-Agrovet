/**
 * Application constants, enums, and lookup tables
 */

const ROLES = Object.freeze({
  ADMIN: 'admin',
  STAFF: 'staff',
  FARMER: 'farmer'
});

const PRODUCT_CATEGORIES = Object.freeze([
  'seeds',
  'fertiliser',
  'pesticide',
  'animal_feed',
  'veterinary_medicine',
  'equipment',
  'other'
]);

const TRANSACTION_TYPES = Object.freeze([
  'sale',
  'restock',
  'adjustment',
  'return',
  'write_off'
]);

const ALERT_TYPES = Object.freeze([
  'low_stock',
  'expiry_warning',
  'expired',
  'system',
  'restock_complete'
]);

const ALERT_SEVERITY = Object.freeze({
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical'
});

const UNITS = Object.freeze([
  'kg',
  'g',
  'litre',
  'ml',
  'piece',
  'pack',
  'bag',
  'bottle',
  'vial'
]);

const KENYAN_COUNTIES = Object.freeze([
  'Baringo',
  'Bomet',
  'Bungoma',
  'Baricho',
  'Elegeyo Marakwet',
  'Embu',
  'Garissa',
  'Homabay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kamba',
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
  'Meru',
  'Migori',
  'Mombasa',
  'Muranga',
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita Taveta',
  'Tana River',
  'Tharaka Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot'
]);

// FIX: was imported by productController but never defined here,
// causing getExpiringProducts to call setDate(x + undefined) → NaN → 500.
// Falls back to env var if set, otherwise defaults to 30 days.
const EXPIRY_ALERT_DAYS_BEFORE = parseInt(process.env.EXPIRY_ALERT_DAYS_BEFORE || '30', 10);

module.exports = {
  ROLES,
  PRODUCT_CATEGORIES,
  TRANSACTION_TYPES,
  ALERT_TYPES,
  ALERT_SEVERITY,
  UNITS,
  KENYAN_COUNTIES,
  EXPIRY_ALERT_DAYS_BEFORE,
};