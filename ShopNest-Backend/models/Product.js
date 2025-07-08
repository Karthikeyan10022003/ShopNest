// models/Product.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compare_at_price: {
    type: Number,
    min: 0
  },
  cost_price: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  weight: {
    value: { type: Number, min: 0 },
    unit: { type: String, enum: ['g', 'kg', 'lb', 'oz'], default: 'kg' }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, enum: ['cm', 'in'], default: 'cm' }
  },
  barcode: String,
  image_url: String,
  attributes: {
    color: String,
    size: String,
    material: String,
    // Dynamic attributes
    custom: Map
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

const productSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  short_description: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Product type and categorization
  product_type: {
    type: String,
    enum: ['simple', 'variable', 'grouped', 'external'],
    default: 'simple'
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  category_path: [String], // For breadcrumbs and hierarchy
  brand: {
    type: String,
    trim: true
  },
  tags: [String],
  
  // Pricing (for simple products)
  price: {
    type: Number,
    min: 0,
    required: function() {
      return this.product_type === 'simple';
    }
  },
  compare_at_price: {
    type: Number,
    min: 0
  },
  cost_price: {
    type: Number,
    min: 0
  },
  
  // Inventory (for simple products)
  sku: {
    type: String,
    trim: true,
    uppercase: true,
    sparse: true,
    unique: true
  },
  stock: {
    type: Number,
    min: 0,
    default: 0,
    required: function() {
      return this.product_type === 'simple';
    }
  },
  track_inventory: {
    type: Boolean,
    default: true
  },
  low_stock_threshold: {
    type: Number,
    min: 0,
    default: 5
  },
  
  // Variants (for variable products)
  variants: [variantSchema],
  
  // Images
  images: [{
    url: { type: String, required: true },
    alt_text: String,
    is_primary: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 }
  }],
  
  // Physical properties
  weight: {
    value: { type: Number, min: 0 },
    unit: { type: String, enum: ['g', 'kg', 'lb', 'oz'], default: 'kg' }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, enum: ['cm', 'in'], default: 'cm' }
  },
  
  // SEO
  seo: {
    meta_title: String,
    meta_description: String,
    meta_keywords: [String],
    canonical_url: String
  },
  
  // Shipping
  shipping: {
    is_physical: { type: Boolean, default: true },
    requires_shipping: { type: Boolean, default: true },
    shipping_class: String,
    free_shipping: { type: Boolean, default: false }
  },
  
  // Features and specifications
  features: [String],
  specifications: {
    type: Map,
    of: String
  },
  
  // Reviews and ratings
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  
  // Status and visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'password_protected'],
    default: 'public'
  },
  password: String, // For password protected products
  
  // Sales and marketing
  featured: { type: Boolean, default: false },
  on_sale: { type: Boolean, default: false },
  sale_start_date: Date,
  sale_end_date: Date,
  
  // Related products
  related_products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  upsell_products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cross_sell_products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Analytics
  views_count: { type: Number, default: 0 },
  sales_count: { type: Number, default: 0 },
  
  // Timestamps
  published_at: Date,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound indexes for multi-tenant isolation and performance
productSchema.index({ tenant_id: 1, status: 1 });
productSchema.index({ tenant_id: 1, slug: 1 }, { unique: true });
productSchema.index({ tenant_id: 1, sku: 1 }, { sparse: true });
productSchema.index({ tenant_id: 1, category_id: 1 });
productSchema.index({ tenant_id: 1, brand: 1 });
productSchema.index({ tenant_id: 1, featured: 1 });
productSchema.index({ tenant_id: 1, on_sale: 1 });
productSchema.index({ tenant_id: 1, price: 1 });
productSchema.index({ tenant_id: 1, 'rating.average': -1 });
productSchema.index({ tenant_id: 1, sales_count: -1 });
productSchema.index({ tenant_id: 1, created_at: -1 });

// Text search index
productSchema.index({
  name: 'text',
  description: 'text',
  short_description: 'text',
  brand: 'text',
  tags: 'text'
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  // Generate slug from name
  if (this.isModified('name')) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${this.tenant_id}`;
  }
  
  // Set published_at when status changes to active
  if (this.isModified('status') && this.status === 'active' && !this.published_at) {
    this.published_at = new Date();
  }
  
  // Update on_sale status based on price comparison
  if (this.compare_at_price && this.price < this.compare_at_price) {
    this.on_sale = true;
  } else {
    this.on_sale = false;
  }
  
  // Ensure at least one image is primary
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.is_primary);
    if (!hasPrimary) {
      this.images[0].is_primary = true;
    }
  }
  
  next();
});

// Instance methods
productSchema.methods.getPrimaryImage = function() {
  const primaryImage = this.images.find(img => img.is_primary);
  return primaryImage ? primaryImage.url : this.images[0]?.url;
};

productSchema.methods.getDiscountPercentage = function() {
  if (!this.compare_at_price || this.price >= this.compare_at_price) return 0;
  return Math.round(((this.compare_at_price - this.price) / this.compare_at_price) * 100);
};

productSchema.methods.isInStock = function() {
  if (this.product_type === 'simple') {
    return !this.track_inventory || this.stock > 0;
  }
  
  if (this.product_type === 'variable') {
    return this.variants.some(variant => 
      variant.status === 'active' && variant.stock > 0
    );
  }
  
  return true;
};

productSchema.methods.getTotalStock = function() {
  if (this.product_type === 'simple') {
    return this.stock;
  }
  
  if (this.product_type === 'variable') {
    return this.variants.reduce((total, variant) => {
      return total + (variant.status === 'active' ? variant.stock : 0);
    }, 0);
  }
  
  return 0;
};

productSchema.methods.getLowestPrice = function() {
  if (this.product_type === 'simple') {
    return this.price;
  }
  
  if (this.product_type === 'variable' && this.variants.length > 0) {
    const activePrices = this.variants
      .filter(v => v.status === 'active')
      .map(v => v.price);
    return Math.min(...activePrices);
  }
  
  return 0;
};

productSchema.methods.getHighestPrice = function() {
  if (this.product_type === 'simple') {
    return this.price;
  }
  
  if (this.product_type === 'variable' && this.variants.length > 0) {
    const activePrices = this.variants
      .filter(v => v.status === 'active')
      .map(v => v.price);
    return Math.max(...activePrices);
  }
  
  return 0;
};

productSchema.methods.updateRating = function(newRating) {
  // This would typically be called after a review is added/updated/deleted
  // For now, this is a placeholder - you'd calculate this from actual reviews
  return this.save();
};

productSchema.methods.incrementViews = function() {
  this.views_count += 1;
  return this.save();
};

productSchema.methods.incrementSales = function(quantity = 1) {
  this.sales_count += quantity;
  return this.save();
};

// Static methods
productSchema.statics.findByTenant = function(tenantId, filters = {}) {
  return this.find({ tenant_id: tenantId, ...filters });
};

productSchema.statics.findActiveByTenant = function(tenantId) {
  return this.find({ 
    tenant_id: tenantId, 
    status: 'active',
    visibility: 'public'
  });
};

productSchema.statics.findFeaturedByTenant = function(tenantId) {
  return this.find({ 
    tenant_id: tenantId, 
    status: 'active',
    featured: true 
  });
};

productSchema.statics.searchByTenant = function(tenantId, query, options = {}) {
  const searchQuery = {
    tenant_id: tenantId,
    status: 'active',
    $text: { $search: query }
  };
  
  let mongoQuery = this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
  
  if (options.limit) mongoQuery = mongoQuery.limit(options.limit);
  if (options.skip) mongoQuery = mongoQuery.skip(options.skip);
  
  return mongoQuery;
};

// Virtual for URL
productSchema.virtual('url').get(function() {
  return `/products/${this.slug}`;
});

// Virtual for price range (for variable products)
productSchema.virtual('price_range').get(function() {
  if (this.product_type === 'simple') {
    return { min: this.price, max: this.price };
  }
  
  if (this.product_type === 'variable' && this.variants.length > 0) {
    const activePrices = this.variants
      .filter(v => v.status === 'active')
      .map(v => v.price);
    return { 
      min: Math.min(...activePrices), 
      max: Math.max(...activePrices) 
    };
  }
  
  return { min: 0, max: 0 };
});

// Transform output
productSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    delete ret.password; // Don't expose password for protected products
    return ret;
  }
});

module.exports = mongoose.model('Product', productSchema);