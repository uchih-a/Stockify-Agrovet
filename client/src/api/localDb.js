import { addDays, differenceInCalendarDays, endOfDay, format, isAfter, isBefore, startOfDay, subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ALERT_TYPES, PRODUCT_CATEGORIES, ROLES, TRANSACTION_TYPES, TYPE_LABELS, UNITS } from '@/utils/constants';

const STORAGE_KEY = 'agrovet-local-db';
const STORAGE_VERSION = 'v3'; // bump this whenever seed data changes
const VERSION_KEY = 'agrovet-local-db-version';

const ids = {
  admin: '661111111111111111111111',
  staff: '661111111111111111111112',
  farmer1: '661111111111111111111113',
  farmer2: '661111111111111111111114',
  farmer3: '661111111111111111111115',
  supplier1: '662222222222222222222221',
  supplier2: '662222222222222222222222',
  supplier3: '662222222222222222222223',
  product1: '663333333333333333333331',
  product2: '663333333333333333333332',
  product3: '663333333333333333333333',
  product4: '663333333333333333333334',
  product5: '663333333333333333333335',
  product6: '663333333333333333333336',
  product7: '663333333333333333333337',
  product8: '663333333333333333333338',
  product9: '663333333333333333333339',
  product10: '663333333333333333333340',
};

const now = new Date();

const clone = (value) => JSON.parse(JSON.stringify(value));

const buildSeedDb = () => {
  const users = [
    {
      _id: ids.admin,
      name: 'Admin User',
      email: 'admin@agrovet.co.ke',
      password: 'Admin@1234',
      role: ROLES.ADMIN,
      phone: '+254712345678',
      location: 'Nairobi',
      isActive: true,
      isVerified: true,
      lastLogin: subDays(now, 1).toISOString(),
      createdAt: subDays(now, 120).toISOString(),
      updatedAt: subDays(now, 1).toISOString(),
      profilePic: '',
    },
    {
      _id: ids.farmer1,
      name: 'John Kamau',
      email: 'farmer1@gmail.com',
      password: 'Farmer@1234',
      role: ROLES.FARMER,
      phone: '+254712345680',
      location: 'Kiambu County',
      isActive: true,
      isVerified: true,
      lastLogin: subDays(now, 1).toISOString(),
      createdAt: subDays(now, 45).toISOString(),
      updatedAt: subDays(now, 1).toISOString(),
      profilePic: '',
    },
    {
      _id: ids.farmer2,
      name: 'Grace Achieng',
      email: 'farmer2@gmail.com',
      password: 'Farmer@1234',
      role: ROLES.FARMER,
      phone: '+254712345681',
      location: 'Kisii County',
      isActive: true,
      isVerified: true,
      lastLogin: subDays(now, 4).toISOString(),
      createdAt: subDays(now, 35).toISOString(),
      updatedAt: subDays(now, 4).toISOString(),
      profilePic: '',
    },
    {
      _id: ids.farmer3,
      name: 'Peter Mutua',
      email: 'farmer3@gmail.com',
      password: 'Farmer@1234',
      role: ROLES.FARMER,
      phone: '+254712345682',
      location: 'Makueni County',
      isActive: true,
      isVerified: true,
      lastLogin: subDays(now, 8).toISOString(),
      createdAt: subDays(now, 28).toISOString(),
      updatedAt: subDays(now, 8).toISOString(),
      profilePic: '',
    },
  ];

  const suppliers = [
    {
      _id: ids.supplier1,
      name: 'AgroInput Kenya Ltd',
      contactPerson: 'Mr. Kipchoge',
      email: 'sales@agroinputkenya.com',
      phone: '+254712000001',
      address: '100 Industrial Area, Nairobi',
      county: 'Nairobi',
      isActive: true,
      notes: 'Leading distributor of seeds and fertilisers.',
      lastDeliveryDate: subDays(now, 4).toISOString(),
      createdAt: subDays(now, 80).toISOString(),
      updatedAt: subDays(now, 4).toISOString(),
    },
    {
      _id: ids.supplier2,
      name: 'KenyaVet Supplies',
      contactPerson: 'Dr. Kariuki',
      email: 'info@kenyavetsupplies.com',
      phone: '+254712000002',
      address: 'Parklands, Nairobi',
      county: 'Nairobi',
      isActive: true,
      notes: 'Veterinary medicines and vaccines.',
      lastDeliveryDate: subDays(now, 10).toISOString(),
      createdAt: subDays(now, 70).toISOString(),
      updatedAt: subDays(now, 10).toISOString(),
    },
    {
      _id: ids.supplier3,
      name: 'Afri-Seeds Ltd',
      contactPerson: 'Ms. Njoki',
      email: 'contact@afriseeds.com',
      phone: '+254712000003',
      address: 'Ruiru, Kiambu County',
      county: 'Kiambu',
      isActive: true,
      notes: 'Premium seeds and agricultural inputs.',
      lastDeliveryDate: subDays(now, 16).toISOString(),
      createdAt: subDays(now, 65).toISOString(),
      updatedAt: subDays(now, 16).toISOString(),
    },
  ];

  const products = [
    {
      _id: ids.product1,
      name: 'Bulldock 025EC',
      sku: 'PEST-BULL025',
      category: 'pesticide',
      description: 'Systemic insecticide for control of aphids, whiteflies, and thrips on vegetables and cereals.',
      images: [{ url: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0e06bb?auto=format&fit=crop&w=600&q=80', publicId: 'pest-bull025' }],
      price: 780,
      unit: 'litre',
      quantity: 5,
      reorderLevel: 10,
      expiryDate: addDays(now, 180).toISOString(),
      supplierId: ids.supplier1,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 28).toISOString(),
      updatedAt: subDays(now, 3).toISOString(),
    },
    {
      _id: ids.product2,
      name: 'Dairy Meal 50kg',
      sku: 'FEED-DAIRY50',
      category: 'animal_feed',
      description: 'High-energy dairy meal formulated to boost milk production in lactating cows.',
      images: [{ url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80', publicId: 'feed-dairy50' }],
      price: 3400,
      unit: 'bag',
      quantity: 8,
      reorderLevel: 15,
      supplierId: ids.supplier1,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 26).toISOString(),
      updatedAt: subDays(now, 2).toISOString(),
    },
    {
      _id: ids.product3,
      name: 'Newcastle Vaccine (100 doses)',
      sku: 'VET-NEWC100',
      category: 'veterinary_medicine',
      description: 'Live attenuated vaccine for prevention of Newcastle disease in poultry.',
      images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', publicId: 'vet-newc100' }],
      price: 1200,
      unit: 'vial',
      quantity: 50,
      reorderLevel: 20,
      expiryDate: addDays(now, 90).toISOString(),
      supplierId: ids.supplier2,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 24).toISOString(),
      updatedAt: subDays(now, 4).toISOString(),
    },
    {
      _id: ids.product4,
      name: 'Foot & Mouth Vaccine 50ml',
      sku: 'VET-FMD50',
      category: 'veterinary_medicine',
      description: 'Trivalent FMD vaccine for cattle, sheep, and goats. Controls all major serotypes.',
      images: [{ url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80', publicId: 'vet-fmd50' }],
      price: 950,
      unit: 'vial',
      quantity: 8,
      reorderLevel: 15,
      expiryDate: addDays(now, 60).toISOString(),
      supplierId: ids.supplier2,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 22).toISOString(),
      updatedAt: subDays(now, 5).toISOString(),
    },
    {
      _id: ids.product5,
      name: 'Duduthrin 1.8EC',
      sku: 'PEST-DUDU1.8',
      category: 'pesticide',
      description: 'Broad-spectrum pest control solution for crop protection.',
      images: [{ url: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0e06bb?auto=format&fit=crop&w=600&q=80', publicId: 'pest-dudu' }],
      price: 850,
      unit: 'litre',
      quantity: 35,
      reorderLevel: 10,
      expiryDate: addDays(now, 120).toISOString(),
      supplierId: ids.supplier1,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 20).toISOString(),
      updatedAt: subDays(now, 1).toISOString(),
    },
    {
      _id: ids.product6,
      name: 'Coragen 20SC',
      sku: 'PEST-CORAGEN',
      category: 'pesticide',
      description: 'Effective insecticide for fall armyworm and caterpillar control.',
      images: [{ url: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=600&q=80', publicId: 'pest-coragen' }],
      price: 1200,
      unit: 'litre',
      quantity: 2,
      reorderLevel: 5,
      expiryDate: addDays(now, 45).toISOString(),
      supplierId: ids.supplier1,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 18).toISOString(),
      updatedAt: subDays(now, 2).toISOString(),
    },
    {
      _id: ids.product7,
      name: 'Unga Starter Chick Mash 50kg',
      sku: 'FEED-CHICK50',
      category: 'animal_feed',
      description: 'Nutritious starter feed for rapid chick development.',
      images: [{ url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80', publicId: 'feed-chick50' }],
      price: 2800,
      unit: 'bag',
      quantity: 18,
      reorderLevel: 5,
      supplierId: ids.supplier1,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 17).toISOString(),
      updatedAt: subDays(now, 1).toISOString(),
    },
    {
      _id: ids.product8,
      name: 'Tetracycline HCl Injectable',
      sku: 'VET-TETRA',
      category: 'veterinary_medicine',
      description: 'Antibiotic injectable for common livestock bacterial infections.',
      images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', publicId: 'vet-tetra' }],
      price: 450,
      unit: 'vial',
      quantity: 12,
      reorderLevel: 5,
      expiryDate: addDays(now, 300).toISOString(),
      supplierId: ids.supplier2,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 16).toISOString(),
      updatedAt: subDays(now, 1).toISOString(),
    },
    {
      _id: ids.product9,
      name: 'Ivermectin 1%',
      sku: 'VET-IVER1',
      category: 'veterinary_medicine',
      description: 'Antiparasitic treatment for cattle, sheep, and goats.',
      images: [{ url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80', publicId: 'vet-iver' }],
      price: 650,
      unit: 'litre',
      quantity: 3,
      reorderLevel: 4,
      expiryDate: subDays(now, 10).toISOString(),
      supplierId: ids.supplier2,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 14).toISOString(),
      updatedAt: subDays(now, 1).toISOString(),
    },
    {
      _id: ids.product10,
      name: 'Knapsack Sprayer 16L',
      sku: 'EQUIP-SPRAY16',
      category: 'equipment',
      description: 'Durable field sprayer with comfortable straps and brass lance.',
      images: [{ url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80', publicId: 'equip-spray16' }],
      price: 1500,
      unit: 'piece',
      quantity: 7,
      reorderLevel: 3,
      supplierId: ids.supplier1,
      addedBy: ids.admin,
      isActive: true,
      createdAt: subDays(now, 12).toISOString(),
      updatedAt: subDays(now, 1).toISOString(),
    },
  ];

  const transactions = [
    {
      _id: '664444444444444444444441',
      type: 'sale',
      productId: ids.product1,
      userId: ids.farmer1,
      performedBy: ids.admin,
      quantity: 2,
      unitPrice: 780,
      totalAmount: 1560,
      previousStock: 7,
      newStock: 5,
      notes: 'Sold Bulldock pesticide.',
      reference: 'ORD-1201',
      createdAt: subDays(now, 12).toISOString(),
      updatedAt: subDays(now, 12).toISOString(),
    },
    {
      _id: '664444444444444444444442',
      type: 'restock',
      productId: ids.product3,
      userId: ids.admin,
      performedBy: ids.admin,
      quantity: 30,
      unitPrice: 1200,
      totalAmount: 36000,
      previousStock: 20,
      newStock: 50,
      notes: 'Vaccine delivery received.',
      reference: 'RST-2201',
      createdAt: subDays(now, 10).toISOString(),
      updatedAt: subDays(now, 10).toISOString(),
    },
    {
      _id: '664444444444444444444443',
      type: 'sale',
      productId: ids.product5,
      userId: ids.farmer2,
      performedBy: ids.admin,
      quantity: 3,
      unitPrice: 850,
      totalAmount: 2550,
      previousStock: 38,
      newStock: 35,
      notes: 'Farmer requested pesticide refill.',
      reference: 'ORD-1202',
      createdAt: subDays(now, 8).toISOString(),
      updatedAt: subDays(now, 8).toISOString(),
    },
    {
      _id: '664444444444444444444444',
      type: 'sale',
      productId: ids.product7,
      userId: ids.farmer3,
      performedBy: ids.admin,
      quantity: 2,
      unitPrice: 2800,
      totalAmount: 5600,
      previousStock: 20,
      newStock: 18,
      notes: 'Starter feed picked up in store.',
      reference: 'ORD-1203',
      createdAt: subDays(now, 6).toISOString(),
      updatedAt: subDays(now, 6).toISOString(),
    },
    {
      _id: '664444444444444444444445',
      type: 'sale',
      productId: ids.product2,
      userId: ids.farmer1,
      performedBy: ids.admin,
      quantity: 1,
      unitPrice: 3400,
      totalAmount: 3400,
      previousStock: 9,
      newStock: 8,
      notes: 'One bag of dairy meal sold.',
      reference: 'ORD-1204',
      createdAt: subDays(now, 2).toISOString(),
      updatedAt: subDays(now, 2).toISOString(),
    },
  ];

  return {
    users,
    suppliers,
    products,
    transactions,
    alerts: [],
    chats: [],
  };
};

const computeDynamicAlerts = (db) => {
  const alerts = [];
  const today = new Date();

  db.products.forEach((product) => {
    if (!product.isActive) return;

    if (product.quantity <= product.reorderLevel) {
      alerts.push({
        _id: `alert-${product._id}-low`,
        type: ALERT_TYPES[0],
        productId: product._id,
        message: `${product.name} is below reorder level (${product.quantity}/${product.reorderLevel}).`,
        severity: product.quantity <= Math.max(1, Math.floor(product.reorderLevel * 0.5)) ? 'critical' : 'warning',
        isRead: false,
        isResolved: false,
        createdAt: subDays(today, 1).toISOString(),
        updatedAt: subDays(today, 1).toISOString(),
      });
    }

    if (product.expiryDate) {
      const expiryDate = new Date(product.expiryDate);

      if (isBefore(expiryDate, today)) {
        alerts.push({
          _id: `alert-${product._id}-expired`,
          type: 'expired',
          productId: product._id,
          message: `${product.name} expired on ${format(expiryDate, 'dd MMM yyyy')}.`,
          severity: 'critical',
          isRead: false,
          isResolved: false,
          createdAt: subDays(today, 1).toISOString(),
          updatedAt: subDays(today, 1).toISOString(),
        });
      } else if (differenceInCalendarDays(expiryDate, today) <= 45) {
        alerts.push({
          _id: `alert-${product._id}-expiring`,
          type: 'expiry_warning',
          productId: product._id,
          message: `${product.name} expires soon on ${format(expiryDate, 'dd MMM yyyy')}.`,
          severity: 'warning',
          isRead: false,
          isResolved: false,
          createdAt: subDays(today, 2).toISOString(),
          updatedAt: subDays(today, 2).toISOString(),
        });
      }
    }
  });

  alerts.push({
    _id: 'alert-system-sync',
    type: 'system',
    productId: null,
    message: 'Morning inventory reconciliation completed successfully.',
    severity: 'info',
    isRead: true,
    isResolved: true,
    resolvedBy: ids.admin,
    resolvedAt: subDays(today, 1).toISOString(),
    createdAt: subDays(today, 1).toISOString(),
    updatedAt: subDays(today, 1).toISOString(),
  });

  return alerts;
};

export const ensureLocalDb = () => {
  if (typeof window === 'undefined') {
    const seed = buildSeedDb();
    return { ...seed, alerts: computeDynamicAlerts(seed) };
  }

  // Clear stale data if version changed
  const storedVersion = window.localStorage.getItem(VERSION_KEY);
  if (storedVersion !== STORAGE_VERSION) {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
  }

  const existing = window.localStorage.getItem(STORAGE_KEY);

  if (!existing) {
    const seed = buildSeedDb();
    const prepared = { ...seed, alerts: computeDynamicAlerts(seed) };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prepared));
    return prepared;
  }

  const parsed = JSON.parse(existing);
  if (!parsed.alerts?.length) {
    parsed.alerts = computeDynamicAlerts(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }
  return parsed;
};

export const getLocalDb = () => clone(ensureLocalDb());

export const saveLocalDb = (db) => {
  const next = { ...db, alerts: computeDynamicAlerts(db) };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return clone(next);
};

export const updateLocalDb = (updater) => {
  const current = getLocalDb();
  const updated = updater(current) ?? current;
  return saveLocalDb(updated);
};

const populateProduct = (db, product) => ({
  ...product,
  supplier: db.suppliers.find((supplier) => supplier._id === product.supplierId) || null,
  supplierId: db.suppliers.find((supplier) => supplier._id === product.supplierId) || product.supplierId,
  addedBy: db.users.find((user) => user._id === product.addedBy) || null,
});

const populateTransaction = (db, transaction) => ({
  ...transaction,
  productId: populateProduct(db, db.products.find((product) => product._id === transaction.productId) || {}),
  userId: db.users.find((user) => user._id === transaction.userId) || null,
  performedBy: db.users.find((user) => user._id === transaction.performedBy) || null,
});

const populateAlert = (db, alert) => ({
  ...alert,
  productId: alert.productId ? populateProduct(db, db.products.find((product) => product._id === alert.productId) || {}) : null,
  resolvedBy: alert.resolvedBy ? db.users.find((user) => user._id === alert.resolvedBy) || null : null,
});

const paginate = (items, params = {}) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const totalDocs = items.length;
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit));
  const safePage = Math.min(page, totalPages);
  const docs = items.slice((safePage - 1) * limit, safePage * limit);

  return {
    docs,
    totalDocs,
    totalPages,
    page: safePage,
    limit,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
};

const matchSearch = (text = '', search = '') =>
  String(text).toLowerCase().includes(String(search).toLowerCase());

const sortBy = (collection, sort = 'name') => {
  const items = [...collection];

  if (!sort) return items;

  const [direction, field] = sort.startsWith('-') ? ['desc', sort.slice(1)] : ['asc', sort];

  return items.sort((a, b) => {
    const left = a[field] ?? '';
    const right = b[field] ?? '';
    const result =
      typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right));
    return direction === 'desc' ? result * -1 : result;
  });
};

export const localAuth = {
  login: ({ email, password }) => {
    const db = getLocalDb();
    const user = db.users.find(
      (entry) =>
        entry.email.toLowerCase() === email.toLowerCase() &&
        entry.password === password &&
        entry.isActive,
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const accessToken = `local-${user._id}`;
    const safeUser = { ...user };
    delete safeUser.password;
    return { user: safeUser, accessToken };
  },
  register: (payload) => {
    const db = updateLocalDb((draft) => {
      const exists = draft.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) throw new Error('Email already registered');

      draft.users.unshift({
        _id: uuidv4().replace(/-/g, '').slice(0, 24),
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: payload.password,
        role: ROLES.FARMER,
        phone: payload.phone,
        location: payload.location,
        isActive: true,
        isVerified: true,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profilePic: '',
      });
      return draft;
    });

    const user = db.users[0];
    const safeUser = { ...user };
    delete safeUser.password;
    return { user: safeUser, accessToken: `local-${safeUser._id}` };
  },
};

export const localProducts = {
  list: (params = {}) => {
    const db = getLocalDb();
    let items = db.products.filter((product) => product.isActive !== false);

    if (params.search) {
      items = items.filter(
        (product) =>
          matchSearch(product.name, params.search) ||
          matchSearch(product.sku, params.search) ||
          matchSearch(product.description, params.search),
      );
    }

    if (params.category && params.category !== 'all') {
      items = items.filter((product) => product.category === params.category);
    }

    if (params.lowStock) {
      items = items.filter((product) => product.quantity <= product.reorderLevel);
    }

    if (params.status === 'healthy') {
      items = items.filter((product) => product.quantity > product.reorderLevel);
    }

    if (params.status === 'low_stock') {
      items = items.filter((product) => product.quantity <= product.reorderLevel && product.quantity > 0);
    }

    if (params.status === 'critical') {
      items = items.filter((product) => product.quantity === 0);
    }

    if (params.status === 'expiring') {
      items = items.filter((product) => {
        if (!product.expiryDate) return false;
        return differenceInCalendarDays(new Date(product.expiryDate), now) <= 45 && isAfter(new Date(product.expiryDate), now);
      });
    }

    if (params.status === 'expired') {
      items = items.filter((product) => product.expiryDate && isBefore(new Date(product.expiryDate), now));
    }

    items = sortBy(items, params.sort || 'name').map((item) => populateProduct(db, item));
    return paginate(items, params);
  },
  getById: (id) => {
    const db = getLocalDb();
    const product = db.products.find((entry) => entry._id === id);
    if (!product) throw new Error('Product not found');
    return populateProduct(db, product);
  },
  create: (payload, user) => {
    const db = updateLocalDb((draft) => {
      draft.products.unshift({
        _id: uuidv4().replace(/-/g, '').slice(0, 24),
        name: payload.name,
        sku: payload.sku.toUpperCase(),
        category: PRODUCT_CATEGORIES.includes(payload.category) ? payload.category : 'other',
        description: payload.description || '',
        images: payload.images || [],
        price: Number(payload.price) || 0,
        unit: UNITS.includes(payload.unit) ? payload.unit : 'piece',
        quantity: Number(payload.quantity) || 0,
        reorderLevel: Number(payload.reorderLevel) || 0,
        expiryDate: payload.expiryDate || null,
        batchNumber: payload.batchNumber || '',
        supplierId: payload.supplierId || null,
        addedBy: user?._id || ids.admin,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return draft;
    });

    return populateProduct(db, db.products[0]);
  },
  update: (id, payload) => {
    const db = updateLocalDb((draft) => {
      draft.products = draft.products.map((product) =>
        product._id === id ? { ...product, ...payload, updatedAt: new Date().toISOString() } : product,
      );
      return draft;
    });

    return populateProduct(db, db.products.find((product) => product._id === id));
  },
  remove: (id) => {
    updateLocalDb((draft) => {
      draft.products = draft.products.filter((product) => product._id !== id);
      draft.transactions = draft.transactions.filter((transaction) => transaction.productId !== id);
      return draft;
    });
    return { success: true };
  },
  uploadImages: (id, files = []) => {
    const urls = files.map((file, index) => ({
      url:
        typeof file === 'string'
          ? file
          : URL.createObjectURL(file),
      publicId: `${id}-${index}-${Date.now()}`,
    }));

    return localProducts.update(id, {
      images: [...(localProducts.getById(id).images || []), ...urls],
    });
  },
  deleteImage: (id, imgId) => {
    return localProducts.update(id, {
      images: (localProducts.getById(id).images || []).filter(
        (image) => image.publicId !== imgId && image._id !== imgId,
      ),
    });
  },
  // FIX: return paginated shape { docs, totalDocs, totalPages, page, limit }
  // so hooks using data?.docs and <Pagination> using data?.totalPages work correctly.
  // Previously these returned plain arrays → data?.docs was undefined → empty lists.
  lowStock: (params = {}) => {
    const db = getLocalDb();
    const items = db.products
      .filter((product) => product.isActive !== false && product.quantity <= product.reorderLevel)
      .sort((a, b) => a.quantity - b.quantity)
      .map((product) => populateProduct(db, product));
    return paginate(items, params);
  },
  expiring: (params = {}) => {
    const db = getLocalDb();
    const items = db.products
      .filter((product) => {
        if (!product.expiryDate || product.isActive === false) return false;
        return differenceInCalendarDays(new Date(product.expiryDate), now) <= 45;
      })
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
      .map((product) => populateProduct(db, product));
    return paginate(items, params);
  },
};

export const localTransactions = {
  list: (params = {}, currentUser = null, mine = false) => {
    const db = getLocalDb();
    let items = db.transactions;

    if (mine && currentUser) {
      items = items.filter((transaction) => transaction.userId === currentUser._id);
    }

    if (params.type && params.type !== 'all') {
      items = items.filter((transaction) => transaction.type === params.type);
    }

    if (params.productId) {
      items = items.filter((transaction) => transaction.productId === params.productId);
    }

    if (params.startDate) {
      items = items.filter((transaction) => isAfter(new Date(transaction.createdAt), startOfDay(new Date(params.startDate))));
    }

    if (params.endDate) {
      items = items.filter((transaction) => isBefore(new Date(transaction.createdAt), endOfDay(new Date(params.endDate))));
    }

    if (params.search) {
      items = items.filter((transaction) => {
        const product = db.products.find((entry) => entry._id === transaction.productId);
        return matchSearch(transaction.reference, params.search) || matchSearch(product?.name, params.search);
      });
    }

    if (params.farmer) {
      items = items.filter((transaction) => {
        const user = db.users.find((entry) => entry._id === transaction.userId);
        return matchSearch(user?.name, params.farmer);
      });
    }

    items = sortBy(items, params.sort || '-createdAt').map((item) => populateTransaction(db, item));
    return paginate(items, params);
  },
  getById: (id) => {
    const db = getLocalDb();
    const transaction = db.transactions.find((entry) => entry._id === id);
    if (!transaction) throw new Error('Transaction not found');
    return populateTransaction(db, transaction);
  },
  create: (payload, currentUser) => {
    const db = updateLocalDb((draft) => {
      const product = draft.products.find((entry) => entry._id === payload.productId);
      if (!product) throw new Error('Product not found');

      const quantity = Number(payload.quantity) || 0;
      const previousStock = Number(product.quantity) || 0;
      let nextStock = previousStock;

      if (payload.type === 'sale' || payload.type === 'write_off') nextStock -= quantity;
      if (payload.type === 'restock' || payload.type === 'return') nextStock += quantity;
      if (payload.type === 'adjustment') nextStock = Number(payload.newStock ?? quantity);

      product.quantity = Math.max(0, nextStock);
      product.updatedAt = new Date().toISOString();

      draft.transactions.unshift({
        _id: uuidv4().replace(/-/g, '').slice(0, 24),
        type: TRANSACTION_TYPES.includes(payload.type) ? payload.type : 'sale',
        productId: payload.productId,
        userId: payload.userId || currentUser?._id || ids.farmer1,
        performedBy: currentUser?._id || ids.admin,
        quantity,
        unitPrice: Number(payload.unitPrice) || product.price || 0,
        totalAmount: quantity * (Number(payload.unitPrice) || product.price || 0),
        previousStock,
        newStock: product.quantity,
        notes: payload.notes || '',
        reference: payload.reference || `REF-${Math.floor(Math.random() * 9000 + 1000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return draft;
    });

    return populateTransaction(db, db.transactions[0]);
  },
};

export const localUsers = {
  list: (params = {}) => {
    let items = getLocalDb().users;
    if (params.role && params.role !== 'all') items = items.filter((user) => user.role === params.role);
    if (params.search) {
      items = items.filter(
        (user) =>
          matchSearch(user.name, params.search) ||
          matchSearch(user.email, params.search) ||
          matchSearch(user.phone, params.search),
      );
    }
    items = sortBy(items.map((user) => ({ ...user, password: undefined })), params.sort || 'name');
    return paginate(items, params);
  },
  getById: (id) => {
    const user = getLocalDb().users.find((entry) => entry._id === id);
    if (!user) throw new Error('User not found');
    const safeUser = { ...user };
    delete safeUser.password;
    return safeUser;
  },
  create: (payload) => {
    const db = updateLocalDb((draft) => {
      draft.users.unshift({
        _id: uuidv4().replace(/-/g, '').slice(0, 24),
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: payload.password || 'Password@123',
        role: payload.role || ROLES.FARMER,
        phone: payload.phone || '',
        location: payload.county || payload.location || '',
        isActive: payload.isActive ?? true,
        isVerified: true,
        lastLogin: null,
        profilePic: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return draft;
    });
    return localUsers.getById(db.users[0]._id);
  },
  update: (id, payload) => {
    const db = updateLocalDb((draft) => {
      draft.users = draft.users.map((user) =>
        user._id === id
          ? {
              ...user,
              ...payload,
              location: payload.county || payload.location || user.location,
              updatedAt: new Date().toISOString(),
            }
          : user,
      );
      return draft;
    });
    return localUsers.getById(id);
  },
  remove: (id) => {
    updateLocalDb((draft) => {
      draft.users = draft.users.filter((user) => user._id !== id);
      return draft;
    });
    return { success: true };
  },
  uploadProfilePic: (id, file) =>
    localUsers.update(id, {
      profilePic: typeof file === 'string' ? file : URL.createObjectURL(file),
    }),
  farmerStats: (id) => {
    const db = getLocalDb();
    const transactions = db.transactions.filter((entry) => entry.userId === id && entry.type === 'sale');
    const totalSpent = transactions.reduce((sum, entry) => sum + entry.totalAmount, 0);
    return {
      totalOrders: transactions.length,
      totalSpent,
      lastPurchaseAt: transactions[0]?.createdAt ?? null,
    };
  },
};

export const localSuppliers = {
  list: (params = {}) => {
    const db = getLocalDb();
    let items = db.suppliers.map((supplier) => ({
      ...supplier,
      productsSupplied: db.products.filter((product) => product.supplierId === supplier._id),
    }));

    if (params.search) {
      items = items.filter((supplier) => matchSearch(supplier.name, params.search) || matchSearch(supplier.county, params.search));
    }

    return paginate(sortBy(items, params.sort || 'name'), params);
  },
  getById: (id) => {
    const db = getLocalDb();
    const supplier = db.suppliers.find((entry) => entry._id === id);
    if (!supplier) throw new Error('Supplier not found');
    return {
      ...supplier,
      productsSupplied: db.products.filter((product) => product.supplierId === id).map((product) => populateProduct(db, product)),
    };
  },
  create: (payload) => {
    const db = updateLocalDb((draft) => {
      draft.suppliers.unshift({
        _id: uuidv4().replace(/-/g, '').slice(0, 24),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastDeliveryDate: payload.lastDeliveryDate || null,
        ...payload,
      });
      return draft;
    });
    return localSuppliers.getById(db.suppliers[0]._id);
  },
  update: (id, payload) => {
    updateLocalDb((draft) => {
      draft.suppliers = draft.suppliers.map((supplier) =>
        supplier._id === id ? { ...supplier, ...payload, updatedAt: new Date().toISOString() } : supplier,
      );
      return draft;
    });
    return localSuppliers.getById(id);
  },
  remove: (id) => {
    updateLocalDb((draft) => {
      draft.suppliers = draft.suppliers.filter((supplier) => supplier._id !== id);
      return draft;
    });
    return { success: true };
  },
  products: (id) => {
    const db = getLocalDb();
    return db.products.filter((product) => product.supplierId === id).map((product) => populateProduct(db, product));
  },
};

export const localAlerts = {
  list: (params = {}) => {
    const db = getLocalDb();
    let items = db.alerts.map((alert) => populateAlert(db, alert));

    if (params.filter === 'unread') items = items.filter((alert) => !alert.isRead);
    if (params.filter === 'resolved') items = items.filter((alert) => alert.isResolved);
    if (params.filter && ALERT_TYPES.includes(params.filter)) items = items.filter((alert) => alert.type === params.filter);
    if (params.search) {
      items = items.filter((alert) => matchSearch(alert.message, params.search) || matchSearch(alert.productId?.name, params.search));
    }

    return paginate(sortBy(items, params.sort || '-createdAt'), params);
  },
  unreadCount: () => getLocalDb().alerts.filter((alert) => !alert.isRead).length,
  markAsRead: (idsToRead = []) => {
    updateLocalDb((draft) => {
      draft.alerts = draft.alerts.map((alert) =>
        idsToRead.includes(alert._id) ? { ...alert, isRead: true, updatedAt: new Date().toISOString() } : alert,
      );
      return draft;
    });
    return { success: true };
  },
  resolve: (id, currentUser) => {
    updateLocalDb((draft) => {
      draft.alerts = draft.alerts.map((alert) =>
        alert._id === id
          ? {
              ...alert,
              isRead: true,
              isResolved: true,
              resolvedBy: currentUser?._id || ids.admin,
              resolvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : alert,
      );
      return draft;
    });
    return { success: true };
  },
  remove: (id) => {
    updateLocalDb((draft) => {
      draft.alerts = draft.alerts.filter((alert) => alert._id !== id);
      return draft;
    });
    return { success: true };
  },
};

const generateChatReply = (message, db) => {
  const inventoryMatch = db.products.find((product) => matchSearch(product.name, message) || matchSearch(product.category, message));

  if (matchSearch(message, 'fall armyworm') || matchSearch(message, 'pest')) {
    return `Likely cause: a chewing pest pressure such as fall armyworm.\n\nRecommended solution:\n- Scout the crop early morning and late afternoon.\n- Use a labelled pesticide like Coragen 20SC if infestation is active.\n- Rotate active ingredients to reduce resistance.\n\nSafety:\n- Wear gloves and a mask during spraying.\n- Follow label rates carefully and keep livestock away until dry.`;
  }

  if (matchSearch(message, 'fertiliser') || matchSearch(message, 'maize')) {
    return `For maize, start with a balanced planting fertiliser, then top-dress with CAN once the crop is established.\n\nPractical guide:\n- Planting: DAP works well at establishment.\n- Top-dressing: apply CAN when the crop is actively growing.\n- Keep fertiliser a little away from the seed to avoid burn.`;
  }

  if (matchSearch(message, 'livestock') || matchSearch(message, 'worm')) {
    return `For internal parasite concerns, review symptoms, age of the animal, and weight before dosing.\n\nHelpful next step:\n- Isolate sick animals if symptoms are severe.\n- Confirm temperature, appetite, and stool condition.\n- Consult a veterinarian for exact dosage if the case is urgent.`;
  }

  if (inventoryMatch) {
    return `We currently stock ${inventoryMatch.name} at KES ${inventoryMatch.price} per ${inventoryMatch.unit}, with ${inventoryMatch.quantity} units available.\n\nIf you want, I can also explain when to use it, how to apply it safely, or suggest an alternative from the same category.`;
  }

  return `Hello from AgroBot. I can help with crop diseases, fertiliser choice, livestock medication guidance, and practical agrovet recommendations for Kenyan farmers.\n\nShare the crop, livestock type, or product you're asking about and I’ll give a more specific recommendation.`;
};

export const localChat = {
  history: (params = {}, currentUser) => {
    const db = getLocalDb();
    const sessions = Object.values(
      db.chats
        .filter((chat) => !currentUser || chat.userId === currentUser._id)
        .reduce((acc, message) => {
          if (!acc[message.sessionId]) {
            acc[message.sessionId] = {
              sessionId: message.sessionId,
              messages: [],
            };
          }

          acc[message.sessionId].messages.push(message);
          return acc;
        }, {}),
    )
      .map((session) => ({
        ...session,
        messages: session.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
        lastMessage: session.messages[session.messages.length - 1],
      }))
      .sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

    return paginate(sessions, params);
  },
  session: (sessionId) => {
    const db = getLocalDb();
    return db.chats
      .filter((message) => message.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },
  send: ({ message, sessionId }, currentUser) => {
    const db = updateLocalDb((draft) => {
      const createdAt = new Date().toISOString();
      draft.chats.push({
        _id: uuidv4().replace(/-/g, '').slice(0, 24),
        userId: currentUser?._id || ids.farmer1,
        sessionId,
        role: 'user',
        content: message,
        createdAt,
        updatedAt: createdAt,
      });

      draft.chats.push({
        _id: uuidv4().replace(/-/g, '').slice(0, 24),
        userId: currentUser?._id || ids.farmer1,
        sessionId,
        role: 'model',
        content: generateChatReply(message, draft),
        createdAt: new Date(Date.now() + 1200).toISOString(),
        updatedAt: createdAt,
        feedbackRating: 0,
        isBookmarked: false,
      });

      return draft;
    });

    const sessionMessages = db.chats.filter((entry) => entry.sessionId === sessionId);
    return {
      sessionId,
      assistantMessage: sessionMessages[sessionMessages.length - 1],
      userMessage: sessionMessages[sessionMessages.length - 2],
      relatedProducts: db.products.filter((product) => matchSearch(product.name, message)).slice(0, 3),
    };
  },
  rate: (messageId, feedbackRating) => {
    updateLocalDb((draft) => {
      draft.chats = draft.chats.map((message) =>
        message._id === messageId ? { ...message, feedbackRating, updatedAt: new Date().toISOString() } : message,
      );
      return draft;
    });
    return { success: true };
  },
  bookmark: (messageId) => {
    updateLocalDb((draft) => {
      draft.chats = draft.chats.map((message) =>
        message._id === messageId ? { ...message, isBookmarked: !message.isBookmarked } : message,
      );
      return draft;
    });
    return { success: true };
  },
  removeSession: (sessionId) => {
    updateLocalDb((draft) => {
      draft.chats = draft.chats.filter((message) => message.sessionId !== sessionId);
      return draft;
    });
    return { success: true };
  },
};

export const localReports = {
  sales: ({ startDate, endDate } = {}) => {
    const db = getLocalDb();
    const start = startDate ? startOfDay(new Date(startDate)) : startOfDay(subDays(now, 30));
    const end = endDate ? endOfDay(new Date(endDate)) : endOfDay(now);
    const previousStart = subDays(start, differenceInCalendarDays(end, start) + 1);
    const previousEnd = subDays(start, 1);

    const sales = db.transactions.filter(
      (transaction) =>
        transaction.type === 'sale' &&
        isAfter(new Date(transaction.createdAt), start) &&
        isBefore(new Date(transaction.createdAt), end),
    );

    const previousSales = db.transactions.filter(
      (transaction) =>
        transaction.type === 'sale' &&
        isAfter(new Date(transaction.createdAt), previousStart) &&
        isBefore(new Date(transaction.createdAt), previousEnd),
    );

    const dailyRevenueMap = new Map();
    sales.forEach((sale) => {
      const key = format(new Date(sale.createdAt), 'dd MMM');
      dailyRevenueMap.set(key, (dailyRevenueMap.get(key) || 0) + sale.totalAmount);
    });

    const topProductsMap = new Map();
    sales.forEach((sale) => {
      const product = db.products.find((entry) => entry._id === sale.productId);
      if (!product) return;
      const current = topProductsMap.get(product._id) || {
        productId: product._id,
        name: product.name,
        revenue: 0,
        unitsSold: 0,
      };
      current.revenue += sale.totalAmount;
      current.unitsSold += sale.quantity;
      topProductsMap.set(product._id, current);
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const previousRevenue = previousSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    return {
      totalRevenue,
      totalUnitsSold: sales.reduce((sum, sale) => sum + sale.quantity, 0),
      totalTransactions: sales.length,
      avgTransactionValue: sales.length ? totalRevenue / sales.length : 0,
      revenueGrowth:
        previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : totalRevenue > 0 ? 100 : 0,
      dailyRevenue: Array.from(dailyRevenueMap.entries()).map(([date, revenue]) => ({ date, revenue })),
      topProducts: Array.from(topProductsMap.values()).sort((a, b) => b.revenue - a.revenue),
      byCategory: PRODUCT_CATEGORIES.map((category) => {
        const categoryProducts = db.products.filter((product) => product.category === category).map((product) => product._id);
        const categorySales = sales.filter((sale) => categoryProducts.includes(sale.productId));
        return {
          name: category,
          value: categorySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
          count: categorySales.length,
        };
      }).filter((entry) => entry.value > 0),
      monthlySales: Array.from({ length: 6 }, (_, index) => {
        const date = subDays(now, (5 - index) * 30);
        const label = format(date, 'MMM');
        const monthly = db.transactions.filter(
          (transaction) =>
            transaction.type === 'sale' && format(new Date(transaction.createdAt), 'MMM') === label,
        );
        return {
          month: label,
          revenue: monthly.reduce((sum, entry) => sum + entry.totalAmount, 0),
          transactions: monthly.length,
        };
      }),
    };
  },
  inventory: () => {
    const db = getLocalDb();
    const activeProducts = db.products.filter((product) => product.isActive !== false);
    const lowStockCount = activeProducts.filter((product) => product.quantity <= product.reorderLevel).length;
    const expiredCount = activeProducts.filter(
      (product) => product.expiryDate && isBefore(new Date(product.expiryDate), now),
    ).length;
    const expiringCount = activeProducts.filter(
      (product) => product.expiryDate && differenceInCalendarDays(new Date(product.expiryDate), now) <= 45,
    ).length;

    return {
      totalProducts: activeProducts.length,
      totalStockValue: activeProducts.reduce((sum, product) => sum + product.quantity * product.price, 0),
      totalQuantity: activeProducts.reduce((sum, product) => sum + product.quantity, 0),
      lowStockCount,
      expiredCount,
      expiringCount,
      totalFarmers: db.users.filter((user) => user.role === ROLES.FARMER).length,
      byCategory: PRODUCT_CATEGORIES.map((category) => {
        const items = activeProducts.filter((product) => product.category === category);
        return {
          name: category,
          value: items.length,
          count: items.length,
          quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        };
      }).filter((entry) => entry.count > 0),
      expiringSoon: activeProducts
        .filter((product) => product.expiryDate && differenceInCalendarDays(new Date(product.expiryDate), now) <= 45)
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
        .map((product) => populateProduct(db, product)),
    };
  },
  farmers: () => {
    const db = getLocalDb();
    const farmers = db.users.filter((user) => user.role === ROLES.FARMER);
    const monthlyActivity = Array.from({ length: 6 }, (_, index) => {
      const date = subDays(now, (5 - index) * 30);
      const month = format(date, 'MMM');
      const newFarmers = farmers.filter((farmer) => format(new Date(farmer.createdAt), 'MMM') === month).length;
      const activeFarmers = new Set(
        db.transactions
          .filter((transaction) => transaction.type === 'sale' && format(new Date(transaction.createdAt), 'MMM') === month)
          .map((transaction) => transaction.userId),
      ).size;
      return { month, newFarmers, activeFarmers };
    });

    const topBuyers = farmers
      .map((farmer) => {
        const purchases = db.transactions.filter((transaction) => transaction.userId === farmer._id && transaction.type === 'sale');
        return {
          ...farmer,
          purchases: purchases.length,
          totalSpent: purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);

    return {
      totalFarmers: farmers.length,
      activeThisMonth: monthlyActivity[monthlyActivity.length - 1]?.activeFarmers || 0,
      newThisMonth: monthlyActivity[monthlyActivity.length - 1]?.newFarmers || 0,
      monthlyActivity,
      topBuyers,
    };
  },
  chatbot: () => {
    const db = getLocalDb();
    const messages = db.chats;
    const sessions = new Set(messages.map((message) => message.sessionId));
    const uniqueUsers = new Set(messages.map((message) => message.userId));

    const dailyCounts = Array.from({ length: 7 }, (_, index) => {
      const date = subDays(now, 6 - index);
      const label = format(date, 'dd MMM');
      const count = messages.filter((message) => format(new Date(message.createdAt), 'dd MMM') === label).length;
      return {
        month: label,
        revenue: count,
        transactions: count,
      };
    });

    const topQuestions = messages
      .filter((message) => message.role === 'user')
      .slice(-5)
      .reverse()
      .map((message) => message.content);

    return {
      totalMessages: messages.length,
      uniqueUsers: uniqueUsers.size,
      averageMessagesPerSession: sessions.size ? messages.length / sessions.size : 0,
      dailyCounts,
      topQuestions,
    };
  },
  insights: () => {
    const inventory = localReports.inventory();
    const sales = localReports.sales();

    const insights = [
      {
        title: 'Restock Risk Building',
        description: `${inventory.lowStockCount} products are already below reorder level. Prioritise fast-moving seed and pesticide lines before peak planting demand.`,
      },
      {
        title: 'Expiry Exposure',
        description: `${inventory.expiringCount} products are expired or nearing expiry. Promote them early or adjust future buying volumes to reduce waste.`,
      },
      {
        title: 'Revenue Concentration',
        description: `Top-performing lines are generating most sales momentum. ${sales.topProducts[0]?.name || 'Your leading product'} is currently the strongest revenue driver.`,
      },
    ];

    if ((sales.revenueGrowth || 0) > 0) {
      insights.push({
        title: 'Positive Sales Trend',
        description: `Revenue is trending ${Math.abs(sales.revenueGrowth).toFixed(1)}% above the previous period. This is a good moment to double down on best sellers and farmer retention.`,
      });
    }

    return insights;
  },
};

export const resetLocalDb = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return ensureLocalDb();
};