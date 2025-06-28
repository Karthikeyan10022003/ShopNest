// Enhanced Mock API Data for Complete E-commerce Platform
export const mockData = {
  stores: [
    { 
      id: 1, 
      name: 'TechStore Pro', 
      domain: 'techstore.myshop.com', 
      status: 'active',
      theme: 'modern',
      revenue: 2145230,
      orders: 12834,
      customers: 45256,
      products: 2189,
      growth: 12.5,
      currency: 'USD',
      timezone: 'UTC'
    }
  ],
  
  categories: [
    { id: 1, name: 'Electronics', icon: '📱', parentId: null, productsCount: 450 },
    { id: 2, name: 'Smartphones', icon: '📱', parentId: 1, productsCount: 120 },
    { id: 3, name: 'Laptops', icon: '💻', parentId: 1, productsCount: 80 },
    { id: 4, name: 'Headphones', icon: '🎧', parentId: 1, productsCount: 95 },
    { id: 5, name: 'Gaming', icon: '🎮', parentId: 1, productsCount: 155 },
    { id: 6, name: 'Fashion', icon: '👕', parentId: null, productsCount: 890 },
    { id: 7, name: 'Men\'s Clothing', icon: '👔', parentId: 6, productsCount: 320 },
    { id: 8, name: 'Women\'s Clothing', icon: '👗', parentId: 6, productsCount: 450 },
    { id: 9, name: 'Accessories', icon: '⌚', parentId: 6, productsCount: 120 },
    { id: 10, name: 'Home & Kitchen', icon: '🏠', parentId: null, productsCount: 650 },
    { id: 11, name: 'Books', icon: '📚', parentId: null, productsCount: 299 }
  ],

  brands: [
    { id: 1, name: 'Apple', logo: '🍎', verified: true },
    { id: 2, name: 'Samsung', logo: '📱', verified: true },
    { id: 3, name: 'Sony', logo: '🔊', verified: true },
    { id: 4, name: 'Nike', logo: '✔️', verified: true },
    { id: 5, name: 'Adidas', logo: '👟', verified: true },
    { id: 6, name: 'Dell', logo: '💻', verified: true },
    { id: 7, name: 'HP', logo: '🖥️', verified: true },
    { id: 8, name: 'Generic', logo: '🏷️', verified: false }
  ],

  products: [
    // Electronics
    { 
      id: 1, 
      name: 'iPhone 15 Pro Max', 
      price: 1199.99, 
      originalPrice: 1299.99,
      stock: 45, 
      category: 'Smartphones', 
      categoryId: 2,
      brandId: 1,
      brand: 'Apple',
      status: 'active', 
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop', 
      images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop'],
      rating: 4.8, 
      reviews: 2324,
      description: 'Latest iPhone with Pro camera system, A17 Pro chip, and titanium design.',
      features: ['A17 Pro Chip', '48MP Camera', '5G Ready', 'Face ID', '128GB Storage'],
      specifications: {
        'Display': '6.7-inch Super Retina XDR',
        'Processor': 'A17 Pro chip',
        'Storage': '128GB',
        'Camera': '48MP Main + 12MP Ultra Wide',
        'Battery': 'Up to 29 hours video playback',
        'OS': 'iOS 17'
      },
      variants: [
        { id: 1, name: '128GB', price: 1199.99, stock: 45 },
        { id: 2, name: '256GB', price: 1299.99, stock: 32 },
        { id: 3, name: '512GB', price: 1499.99, stock: 18 }
      ],
      colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
      tags: ['premium', 'flagship', 'new-arrival'],
      weight: '221g',
      dimensions: '159.9 × 76.7 × 8.25 mm',
      warranty: '1 Year',
      returnable: true,
      freeShipping: true,
      fastDelivery: true,
      discount: 8
    },
    { 
      id: 2, 
      name: 'MacBook Pro 14-inch M3', 
      price: 1999.99, 
      originalPrice: 2199.99,
      stock: 23, 
      category: 'Laptops', 
      categoryId: 3,
      brandId: 1,
      brand: 'Apple',
      status: 'active', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 
      rating: 4.9, 
      reviews: 1156,
      description: 'Supercharged by M3 chip. Built for Apple Intelligence. Up to 22 hours of battery life.',
      features: ['M3 Chip', '14-inch Liquid Retina XDR', '16GB RAM', '512GB SSD', 'Touch ID'],
      specifications: {
        'Display': '14.2-inch Liquid Retina XDR',
        'Processor': 'Apple M3 chip',
        'Memory': '16GB unified memory',
        'Storage': '512GB SSD',
        'Graphics': '10-core GPU',
        'Battery': 'Up to 22 hours'
      },
      variants: [
        { id: 1, name: '512GB SSD', price: 1999.99, stock: 23 },
        { id: 2, name: '1TB SSD', price: 2399.99, stock: 15 }
      ],
      colors: ['Space Gray', 'Silver'],
      tags: ['professional', 'creative', 'premium'],
      weight: '1.55kg',
      warranty: '1 Year',
      returnable: true,
      freeShipping: true,
      fastDelivery: false,
      discount: 9
    },
    { 
      id: 3, 
      name: 'Sony WH-1000XM5 Headphones', 
      price: 349.99, 
      originalPrice: 399.99,
      stock: 67, 
      category: 'Headphones', 
      categoryId: 4,
      brandId: 3,
      brand: 'Sony',
      status: 'active', 
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', 
      rating: 4.7, 
      reviews: 889,
      description: 'Industry-leading noise canceling with new lightweight design.',
      features: ['Active Noise Canceling', '30-hour battery', 'Quick Charge', 'Touch Controls'],
      specifications: {
        'Driver': '30mm',
        'Frequency Response': '4Hz-40kHz',
        'Battery Life': '30 hours with ANC',
        'Charging': 'USB-C Quick Charge',
        'Weight': '250g',
        'Connectivity': 'Bluetooth 5.2'
      },
      colors: ['Black', 'Silver'],
      tags: ['noise-canceling', 'wireless', 'premium'],
      warranty: '2 Years',
      returnable: true,
      freeShipping: true,
      fastDelivery: true,
      discount: 12
    },
    // Gaming
    { 
      id: 4, 
      name: 'PlayStation 5 Console', 
      price: 499.99, 
      originalPrice: 499.99,
      stock: 12, 
      category: 'Gaming', 
      categoryId: 5,
      brandId: 3,
      brand: 'Sony',
      status: 'active', 
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop', 
      rating: 4.8, 
      reviews: 3456,
      description: 'Play has no limits with the PlayStation 5 console.',
      features: ['Ultra-high speed SSD', '4K Gaming', 'Ray Tracing', 'DualSense Controller'],
      specifications: {
        'CPU': 'AMD Zen 2',
        'GPU': 'AMD RDNA 2',
        'Memory': '16GB GDDR6',
        'Storage': '825GB SSD',
        'Optical Drive': '4K Blu-ray',
        'Resolution': 'Up to 4K at 120fps'
      },
      tags: ['gaming', 'console', 'next-gen'],
      warranty: '1 Year',
      returnable: true,
      freeShipping: true,
      fastDelivery: false,
      discount: 0
    },
    // Fashion
    { 
      id: 5, 
      name: 'Nike Air Force 1 \'07', 
      price: 90.00, 
      originalPrice: 110.00,
      stock: 156, 
      category: 'Men\'s Clothing', 
      categoryId: 7,
      brandId: 4,
      brand: 'Nike',
      status: 'active', 
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 
      rating: 4.6, 
      reviews: 2145,
      description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball OG.',
      features: ['Leather Upper', 'Air-Sole Unit', 'Rubber Outsole', 'Classic Design'],
      sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
      colors: ['White', 'Black', 'Red', 'Blue'],
      tags: ['classic', 'basketball', 'lifestyle'],
      warranty: '2 Years',
      returnable: true,
      freeShipping: false,
      fastDelivery: true,
      discount: 18
    }
  ],

  orders: [
    { 
      id: '#ORD-2024-001', 
      customer: 'John Doe', 
      customerEmail: 'john@example.com',
      total: 1549.98, 
      status: 'delivered', 
      paymentStatus: 'paid',
      date: '2025-01-22', 
      deliveryDate: '2025-01-25',
      items: [
        { productId: 1, quantity: 1, price: 1199.99, name: 'iPhone 15 Pro Max' },
        { productId: 3, quantity: 1, price: 349.99, name: 'Sony WH-1000XM5 Headphones' }
      ],
      priority: 'high',
      shippingAddress: {
        name: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      trackingNumber: 'TRK123456789',
      paymentMethod: 'Credit Card',
      notes: 'Handle with care'
    },
    { 
      id: '#ORD-2024-002', 
      customer: 'Jane Smith', 
      customerEmail: 'jane@example.com',
      total: 2089.99, 
      status: 'processing', 
      paymentStatus: 'paid',
      date: '2025-01-22', 
      items: [
        { productId: 2, quantity: 1, price: 1999.99, name: 'MacBook Pro 14-inch M3' },
        { productId: 5, quantity: 1, price: 90.00, name: 'Nike Air Force 1' }
      ],
      priority: 'medium',
      shippingAddress: {
        name: 'Jane Smith',
        phone: '+1987654321',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      }
    }
  ],

  customers: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      joinDate: '2024-01-15',
      totalOrders: 5,
      totalSpent: 3245.67,
      status: 'active',
      tier: 'gold',
      addresses: [
        {
          id: 1,
          type: 'home',
          name: 'John Doe',
          phone: '+1234567890',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true
        }
      ],
      preferences: {
        newsletter: true,
        smsUpdates: false,
        language: 'en',
        currency: 'USD'
      }
    }
  ],

  reviews: [
    {
      id: 1,
      productId: 1,
      customerId: 1,
      customerName: 'John Doe',
      rating: 5,
      title: 'Amazing phone!',
      comment: 'The camera quality is outstanding and the battery life is impressive.',
      date: '2025-01-20',
      helpful: 15,
      verified: true,
      images: []
    }
  ],

  coupons: [
    {
      id: 1,
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrderValue: 100,
      maxDiscount: 50,
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      usageLimit: 1000,
      usedCount: 245,
      status: 'active',
      description: 'Welcome discount for new customers'
    },
    {
      id: 2,
      code: 'FLAT50',
      type: 'fixed',
      value: 50,
      minOrderValue: 200,
      validFrom: '2025-01-01',
      validUntil: '2025-06-30',
      usageLimit: 500,
      usedCount: 89,
      status: 'active',
      description: 'Flat $50 off on orders above $200'
    }
  ],

  notifications: [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD-2024-003 has been placed',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'PlayStation 5 Console is running low on stock (12 left)',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      priority: 'medium'
    }
  ],

  salesData: [
    { date: '2025-01-15', revenue: 12450, orders: 25, customers: 18 },
    { date: '2025-01-16', revenue: 15630, orders: 32, customers: 24 },
    { date: '2025-01-17', revenue: 18920, orders: 28, customers: 22 },
    { date: '2025-01-18', revenue: 22100, orders: 35, customers: 28 },
    { date: '2025-01-19', revenue: 19800, orders: 30, customers: 25 },
    { date: '2025-01-20', revenue: 25400, orders: 42, customers: 35 },
    { date: '2025-01-21', revenue: 28600, orders: 45, customers: 38 },
    { date: '2025-01-22', revenue: 31200, orders: 48, customers: 40 }
  ]
};

// Enhanced API functions
export const authAPI = {
  login: async (email, role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            email,
            name: role === 'admin' ? 'Admin User' : 'Customer User',
            role,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
          }
        });
      }, 1500);
    });
  }
};

export const productsAPI = {
  getAll: () => mockData.products,
  getById: (id) => mockData.products.find(p => p.id === id),
  getByCategory: (categoryId) => mockData.products.filter(p => p.categoryId === categoryId),
  search: (query) => mockData.products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase())
  ),
  create: (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...mockData.products.map(p => p.id)) + 1,
      rating: 0,
      reviews: 0,
      status: 'active'
    };
    mockData.products.push(newProduct);
    return newProduct;
  },
  update: (id, updates) => {
    const index = mockData.products.findIndex(p => p.id === id);
    if (index > -1) {
      mockData.products[index] = { ...mockData.products[index], ...updates };
      return mockData.products[index];
    }
    return null;
  },
  delete: (id) => {
    const index = mockData.products.findIndex(p => p.id === id);
    if (index > -1) {
      mockData.products.splice(index, 1);
      return true;
    }
    return false;
  }
};

export const ordersAPI = {
  getAll: () => mockData.orders,
  getById: (id) => mockData.orders.find(o => o.id === id),
  create: (order) => {
    const newOrder = {
      ...order,
      id: '#ORD-2024-' + String(mockData.orders.length + 1).padStart(3, '0'),
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      paymentStatus: 'paid'
    };
    mockData.orders.unshift(newOrder);
    return newOrder;
  },
  updateStatus: (id, status) => {
    const order = mockData.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }
};

export const categoriesAPI = {
  getAll: () => mockData.categories,
  getById: (id) => mockData.categories.find(c => c.id === id),
  getChildren: (parentId) => mockData.categories.filter(c => c.parentId === parentId),
  getParents: () => mockData.categories.filter(c => c.parentId === null)
};

export const brandsAPI = {
  getAll: () => mockData.brands,
  getById: (id) => mockData.brands.find(b => b.id === id)
};

export const reviewsAPI = {
  getByProduct: (productId) => mockData.reviews.filter(r => r.productId === productId),
  create: (review) => {
    const newReview = {
      ...review,
      id: Math.max(...mockData.reviews.map(r => r.id)) + 1,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: true
    };
    mockData.reviews.push(newReview);
    return newReview;
  }
};

export const couponsAPI = {
  getAll: () => mockData.coupons,
  validate: (code, orderValue) => {
    const coupon = mockData.coupons.find(c => c.code === code && c.status === 'active');
    if (!coupon) return { valid: false, message: 'Invalid coupon code' };
    if (orderValue < coupon.minOrderValue) {
      return { valid: false, message: `Minimum order value should be $${coupon.minOrderValue}` };
    }
    return { valid: true, coupon };
  }
};

export const analyticsAPI = {
  getSalesData: (period = '7d') => mockData.salesData,
  getTopProducts: (limit = 5) => {
    return mockData.products
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, limit);
  },
  getRevenueMetrics: () => ({
    totalRevenue: mockData.salesData.reduce((sum, day) => sum + day.revenue, 0),
    totalOrders: mockData.salesData.reduce((sum, day) => sum + day.orders, 0),
    averageOrderValue: mockData.salesData.reduce((sum, day) => sum + day.revenue, 0) / 
                      mockData.salesData.reduce((sum, day) => sum + day.orders, 0),
    conversionRate: 3.2
  })
};