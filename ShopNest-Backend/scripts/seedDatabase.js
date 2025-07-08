// scripts/seedDatabase.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Tenant.deleteMany({});
    await Product.deleteMany({});

    // Create sample tenants
    console.log('🏢 Creating sample tenants...');
    
    const techStoreTenant = new Tenant({
      name: 'TechStore Pro',
      subdomain: 'techstore',
      plan: 'pro',
      status: 'active',
      currency: 'USD',
      branding: {
        primary_color: '#3B82F6',
        secondary_color: '#8B5CF6'
      },
      settings: {
        tagline: 'Premium E-commerce Platform',
        welcome_message: 'Experience the future of e-commerce management',
        contact_email: 'contact@techstore.com',
        features: {
          reviews_enabled: true,
          wishlist_enabled: true,
          coupons_enabled: true,
          inventory_tracking: true
        }
      },
      billing: {
        subscription_status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    const fashionHubTenant = new Tenant({
      name: 'Fashion Hub',
      subdomain: 'fashionhub',
      plan: 'basic',
      status: 'active',
      currency: 'EUR',
      branding: {
        primary_color: '#EC4899',
        secondary_color: '#8B5CF6'
      },
      settings: {
        tagline: 'Fashion Forward',
        welcome_message: 'Discover the latest fashion trends',
        contact_email: 'contact@fashionhub.com'
      }
    });

    await techStoreTenant.save();
    await fashionHubTenant.save();

    // Create sample users
    console.log('👥 Creating sample users...');
    
    // TechStore owner
    const techStoreOwner = new User({
      name: 'John Doe',
      email: 'john@techstore.com',
      password: await bcrypt.hash('password123', 12),
      role: 'tenant_owner',
      tenant_id: techStoreTenant._id,
      status: 'active',
      email_verified: true
    });

    // TechStore admin
    const techStoreAdmin = new User({
      name: 'Jane Smith',
      email: 'jane@techstore.com',
      password: await bcrypt.hash('password123', 12),
      role: 'tenant_admin',
      tenant_id: techStoreTenant._id,
      status: 'active',
      email_verified: true,
      permissions: ['read_products', 'write_products', 'read_orders', 'write_orders', 'read_customers']
    });

    // Sample customer
    const customer = new User({
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'customer',
      tenant_id: techStoreTenant._id,
      status: 'active',
      email_verified: true,
      customer_data: {
        addresses: [{
          type: 'home',
          is_default: true,
          name: 'Mike Johnson',
          address_line_1: '123 Main Street',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'USA'
        }],
        total_orders: 0,
        total_spent: 0,
        loyalty_points: 100
      }
    });

    // Fashion Hub owner
    const fashionHubOwner = new User({
      name: 'Sarah Wilson',
      email: 'sarah@fashionhub.com',
      password: await bcrypt.hash('password123', 12),
      role: 'tenant_owner',
      tenant_id: fashionHubTenant._id,
      status: 'active',
      email_verified: true
    });

    await techStoreOwner.save();
    await techStoreAdmin.save();
    await customer.save();
    await fashionHubOwner.save();

    // Update tenant owner IDs
    techStoreTenant.owner_id = techStoreOwner._id;
    fashionHubTenant.owner_id = fashionHubOwner._id;
    await techStoreTenant.save();
    await fashionHubTenant.save();

    // Create sample products for TechStore
    console.log('📦 Creating sample products...');
    
    const sampleProducts = [
      {
        tenant_id: techStoreTenant._id,
        name: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with Pro camera system, A17 Pro chip, and titanium design.',
        short_description: 'Premium smartphone with advanced features',
        product_type: 'variable',
        price: 1199.99,
        compare_at_price: 1299.99,
        sku: 'IPHONE15PM',
        stock: 45,
        brand: 'Apple',
        tags: ['smartphone', 'premium', 'apple'],
        images: [{
          url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
          alt_text: 'iPhone 15 Pro Max',
          is_primary: true
        }],
        features: ['A17 Pro Chip', '48MP Camera', '5G Ready', 'Face ID', '128GB Storage'],
        specifications: new Map([
          ['Display', '6.7-inch Super Retina XDR'],
          ['Processor', 'A17 Pro chip'],
          ['Storage', '128GB'],
          ['Camera', '48MP Main + 12MP Ultra Wide'],
          ['Battery', 'Up to 29 hours video playback'],
          ['OS', 'iOS 17']
        ]),
        rating: { average: 4.8, count: 2324 },
        status: 'active',
        featured: true,
        created_by: techStoreOwner._id,
        variants: [
          {
            name: '128GB',
            sku: 'IPHONE15PM-128',
            price: 1199.99,
            stock: 15,
            attributes: { storage: '128GB', color: 'Natural Titanium' }
          },
          {
            name: '256GB',
            sku: 'IPHONE15PM-256',
            price: 1299.99,
            stock: 20,
            attributes: { storage: '256GB', color: 'Natural Titanium' }
          },
          {
            name: '512GB',
            sku: 'IPHONE15PM-512',
            price: 1499.99,
            stock: 10,
            attributes: { storage: '512GB', color: 'Natural Titanium' }
          }
        ]
      },
      {
        tenant_id: techStoreTenant._id,
        name: 'MacBook Pro 14-inch M3',
        description: 'Supercharged by M3 chip. Built for Apple Intelligence. Up to 22 hours of battery life.',
        product_type: 'simple',
        price: 1999.99,
        compare_at_price: 2199.99,
        sku: 'MBP14M3',
        stock: 23,
        brand: 'Apple',
        tags: ['laptop', 'professional', 'apple'],
        images: [{
          url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
          alt_text: 'MacBook Pro 14-inch',
          is_primary: true
        }],
        features: ['M3 Chip', '14-inch Liquid Retina XDR', '16GB RAM', '512GB SSD', 'Touch ID'],
        rating: { average: 4.9, count: 1156 },
        status: 'active',
        featured: true,
        created_by: techStoreOwner._id
      },
      {
        tenant_id: techStoreTenant._id,
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise canceling with new lightweight design.',
        product_type: 'simple',
        price: 349.99,
        compare_at_price: 399.99,
        sku: 'SONYWH1000XM5',
        stock: 67,
        brand: 'Sony',
        tags: ['headphones', 'noise-canceling', 'wireless'],
        images: [{
          url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
          alt_text: 'Sony WH-1000XM5 Headphones',
          is_primary: true
        }],
        features: ['Active Noise Canceling', '30-hour battery', 'Quick Charge', 'Touch Controls'],
        rating: { average: 4.7, count: 889 },
        status: 'active',
        created_by: techStoreOwner._id
      },
      {
        tenant_id: techStoreTenant._id,
        name: 'PlayStation 5 Console',
        description: 'Play has no limits with the PlayStation 5 console.',
        product_type: 'simple',
        price: 499.99,
        sku: 'PS5CONSOLE',
        stock: 12,
        brand: 'Sony',
        tags: ['gaming', 'console', 'playstation'],
        images: [{
          url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
          alt_text: 'PlayStation 5 Console',
          is_primary: true
        }],
        features: ['Ultra-high speed SSD', '4K Gaming', 'Ray Tracing', 'DualSense Controller'],
        rating: { average: 4.8, count: 3456 },
        status: 'active',
        featured: true,
        created_by: techStoreOwner._id
      },
      {
        tenant_id: techStoreTenant._id,
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Ultimate smartphone with S Pen and advanced AI features.',
        product_type: 'simple',
        price: 1199.99,
        sku: 'GALAXYS24ULTRA',
        stock: 28,
        brand: 'Samsung',
        tags: ['smartphone', 'android', 'premium'],
        images: [{
          url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
          alt_text: 'Samsung Galaxy S24 Ultra',
          is_primary: true
        }],
        features: ['S Pen', '200MP Camera', '5G', 'AI Features', '256GB Storage'],
        rating: { average: 4.6, count: 1892 },
        status: 'active',
        created_by: techStoreOwner._id
      }
    ];

    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }

    // Update tenant usage
    await Tenant.findByIdAndUpdate(techStoreTenant._id, {
      'usage.products_count': sampleProducts.length,
      'usage.users_count': 3
    });

    await Tenant.findByIdAndUpdate(fashionHubTenant._id, {
      'usage.users_count': 1
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('TechStore Owner: john@techstore.com / password123');
    console.log('TechStore Admin: jane@techstore.com / password123');
    console.log('Customer: mike@example.com / password123');
    console.log('Fashion Hub Owner: sarah@fashionhub.com / password123');
    console.log('\n🏢 Sample Tenants:');
    console.log('TechStore: techstore.localhost:3000 (or ?tenant=techstore)');
    console.log('Fashion Hub: fashionhub.localhost:3000 (or ?tenant=fashionhub)');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
  process.exit(0);
};

runSeeder();