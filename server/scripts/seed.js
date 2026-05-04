require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Transaction = require('../models/Transaction');

console.log('DEBUG: MONGO_URI is currently set to:', process.env.MONGO_URI);

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...\n');

    // Clear collections
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Supplier.deleteMany({}),
      Transaction.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data\n');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@agrovet.co.ke',
        password: 'Admin@1234',
        role: 'admin',
        phone: '+254712345678',
        location: 'Nairobi',
        isActive: true,
        isVerified: true
      },
      {
        name: 'Jane Wanjiku',
        email: 'staff@agrovet.co.ke',
        password: 'Staff@1234',
        role: 'staff',
        phone: '+254712345679',
        location: 'Nairobi',
        isActive: true,
        isVerified: true
      },
      {
        name: 'John Kamau',
        email: 'farmer1@gmail.com',
        password: 'Farmer@1234',
        role: 'farmer',
        phone: '+254712345680',
        location: 'Kiambu County',
        isActive: true,
        isVerified: true
      },
      {
        name: 'Grace Achieng',
        email: 'farmer2@gmail.com',
        password: 'Farmer@1234',
        role: 'farmer',
        phone: '+254712345681',
        location: 'Kisii County',
        isActive: true,
        isVerified: true
      },
      {
        name: 'Peter Mutua',
        email: 'farmer3@gmail.com',
        password: 'Farmer@1234',
        role: 'farmer',
        phone: '+254712345682',
        location: 'Makueni County',
        isActive: true,
        isVerified: true
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // Create suppliers
    const suppliers = await Supplier.create([
      {
        name: 'AgroInput Kenya Ltd',
        contactPerson: 'Mr. Kipchoge',
        email: 'sales@agroinputkenya.com',
        phone: '+254712000001',
        address: '100 Industrial Area, Nairobi',
        county: 'Nairobi',
        isActive: true,
        notes: 'Leading distributor of seeds and fertilisers'
      },
      {
        name: 'KenyaVet Supplies',
        contactPerson: 'Dr. Kariuki',
        email: 'info@kenyavetsupplies.com',
        phone: '+254712000002',
        address: 'Parklands, Nairobi',
        county: 'Nairobi',
        isActive: true,
        notes: 'Veterinary medicines and vaccines'
      },
      {
        name: 'Afri-Seeds Ltd',
        contactPerson: 'Ms. Njoki',
        email: 'contact@afriseeds.com',
        phone: '+254712000003',
        address: 'Ruiru, Kiambu County',
        county: 'Kiambu',
        isActive: true,
        notes: 'Premium seeds and agricultural inputs'
      }
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers\n`);

    // Create products with mix of stock levels and expiry dates
    const today = new Date();
    const future = (days) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    const past = (days) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    const products = await Product.create([
      // Seeds
      {
        name: 'Duma 43 Maize Seeds',
        sku: 'SEED-DUMA43',
        category: 'seeds',
        description: 'Premium maize hybrid resistant to drought',
        price: 450,
        unit: 'kg',
        quantity: 5,
        reorderLevel: 10,
        supplierId: suppliers[0]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      {
        name: 'IITA Soybean Seeds',
        sku: 'SEED-IITA',
        category: 'seeds',
        price: 850,
        unit: 'kg',
        quantity: 25,
        reorderLevel: 10,
        supplierId: suppliers[2]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      // Fertilisers
      {
        name: 'CAN Fertiliser 50kg',
        sku: 'FERT-CAN50',
        category: 'fertiliser',
        price: 2500,
        unit: 'bag',
        quantity: 50,
        reorderLevel: 20,
        supplierId: suppliers[0]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      {
        name: 'DAP Fertiliser 50kg',
        sku: 'FERT-DAP50',
        category: 'fertiliser',
        price: 3200,
        unit: 'bag',
        quantity: 8,
        reorderLevel: 15,
        supplierId: suppliers[0]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      // Pesticides
      {
        name: 'Duduthrin 1.8EC',
        sku: 'PEST-DUDU1.8',
        category: 'pesticide',
        price: 850,
        unit: 'litre',
        quantity: 35,
        reorderLevel: 10,
        expiryDate: future(120),
        supplierId: suppliers[0]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      {
        name: 'Coragen 20SC',
        sku: 'PEST-CORAGEN',
        category: 'pesticide',
        price: 1200,
        unit: 'litre',
        quantity: 2,
        reorderLevel: 5,
        expiryDate: future(45),
        supplierId: suppliers[0]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      // Animal Feed
      {
        name: 'Unga Starter Chick Mash 50kg',
        sku: 'FEED-CHICK50',
        category: 'animal_feed',
        price: 2800,
        unit: 'bag',
        quantity: 18,
        reorderLevel: 5,
        supplierId: suppliers[0]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      // Veterinary Medicine
      {
        name: 'Tetracycline HCl Injectable',
        sku: 'VET-TETRA',
        category: 'veterinary_medicine',
        price: 450,
        unit: 'vial',
        quantity: 12,
        reorderLevel: 5,
        expiryDate: future(300),
        supplierId: suppliers[1]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      {
        name: 'Ivermectin 1%',
        sku: 'VET-IVER1',
        category: 'veterinary_medicine',
        price: 650,
        unit: 'litre',
        quantity: 3,
        reorderLevel: 2,
        expiryDate: past(10),
        supplierId: suppliers[1]._id,
        addedBy: users[1]._id,
        isActive: true
      },
      // Equipment
      {
        name: 'Knapsack Sprayer 16L',
        sku: 'EQUIP-SPRAY16',
        category: 'equipment',
        price: 1500,
        unit: 'piece',
        quantity: 7,
        reorderLevel: 3,
        supplierId: suppliers[0]._id,
        addedBy: users[1]._id,
        isActive: true
      }
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // Create transactions
    const transactions = await Transaction.create([
      {
        type: 'sale',
        productId: products[0]._id,
        userId: users[2]._id,
        performedBy: users[1]._id,
        quantity: 2,
        unitPrice: 450,
        previousStock: 7,
        newStock: 5
      },
      {
        type: 'restock',
        productId: products[2]._id,
        userId: users[1]._id,
        performedBy: users[1]._id,
        quantity: 30,
        unitPrice: 2500,
        previousStock: 20,
        newStock: 50
      },
      {
        type: 'sale',
        productId: products[4]._id,
        userId: users[3]._id,
        performedBy: users[1]._id,
        quantity: 3,
        unitPrice: 850,
        previousStock: 38,
        newStock: 35
      },
      {
        type: 'sale',
        productId: products[6]._id,
        userId: users[4]._id,
        performedBy: users[1]._id,
        quantity: 2,
        unitPrice: 2800,
        previousStock: 20,
        newStock: 18
      }
    ]);
    console.log(`✅ Created ${transactions.length} transactions\n`);

    // Print summary
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          🌿 DATABASE SEEDING COMPLETE 🌿              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📊 SEEDED DATA SUMMARY:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Suppliers: ${suppliers.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Transactions: ${transactions.length}\n`);

    console.log('👤 DEFAULT LOGIN CREDENTIALS:');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ Role        │ Email                 │ Password        │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│ Admin       │ admin@agrovet.co.ke   │ Admin@1234      │');
    console.log('│ Staff       │ staff@agrovet.co.ke   │ Staff@1234      │');
    console.log('│ Farmer #1   │ farmer1@gmail.com     │ Farmer@1234     │');
    console.log('│ Farmer #2   │ farmer2@gmail.com     │ Farmer@1234     │');
    console.log('│ Farmer #3   │ farmer3@gmail.com     │ Farmer@1234     │');
    console.log('└─────────────────────────────────────────────────────┘\n');

    console.log('🚀 Next steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Test login: curl -X POST http://localhost:5000/api/v1/auth/login \\');
    console.log('      -H "Content-Type: application/json" \\');
    console.log('      -d \'{"email":"admin@agrovet.co.ke","password":"Admin@1234"}\'\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
