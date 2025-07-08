// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['super_admin', 'tenant_owner', 'tenant_admin', 'tenant_user', 'customer'],
    default: 'customer'
  },
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: function() {
      return this.role !== 'super_admin';
    }
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  date_of_birth: Date,
  
  // Profile information
  profile: {
    bio: String,
    website: String,
    location: String,
    preferences: {
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' },
      currency: { type: String, default: 'USD' },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true }
      }
    }
  },
  
  // Authentication
  email_verified: {
    type: Boolean,
    default: false
  },
  email_verification_token: String,
  email_verification_expires: Date,
  password_reset_token: String,
  password_reset_expires: Date,
  
  // Status and permissions
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  permissions: [{
    type: String,
    enum: [
      'read_products', 'write_products', 'delete_products',
      'read_orders', 'write_orders', 'delete_orders',
      'read_customers', 'write_customers', 'delete_customers',
      'read_analytics', 'write_analytics',
      'read_settings', 'write_settings',
      'manage_users', 'manage_billing'
    ]
  }],
  
  // Activity tracking
  last_login: Date,
  login_count: { type: Number, default: 0 },
  last_active: Date,
  
  // Customer-specific fields
  customer_data: {
    addresses: [{
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
      },
      is_default: { type: Boolean, default: false },
      name: String,
      phone: String,
      address_line_1: { type: String, required: true },
      address_line_2: String,
      city: { type: String, required: true },
      state: String,
      postal_code: { type: String, required: true },
      country: { type: String, required: true }
    }],
    payment_methods: [{
      type: {
        type: String,
        enum: ['card', 'paypal', 'bank_transfer'],
        default: 'card'
      },
      is_default: { type: Boolean, default: false },
      provider: String, // stripe, paypal, etc.
      provider_id: String, // payment method ID from provider
      last_four: String,
      expiry_month: Number,
      expiry_year: Number,
      brand: String // visa, mastercard, etc.
    }],
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    total_orders: { type: Number, default: 0 },
    total_spent: { type: Number, default: 0 },
    loyalty_points: { type: Number, default: 0 },
    customer_since: { type: Date, default: Date.now }
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

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ tenant_id: 1, role: 1 });
userSchema.index({ email_verification_token: 1 });
userSchema.index({ password_reset_token: 1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password only if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.password_reset_expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.email_verification_token = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.email_verification_expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

userSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin' || this.role === 'tenant_owner') {
    return true;
  }
  return this.permissions.includes(permission);
};

userSchema.methods.addAddress = function(addressData) {
  // If this is the first address or marked as default, make it default
  if (this.customer_data.addresses.length === 0 || addressData.is_default) {
    this.customer_data.addresses.forEach(addr => addr.is_default = false);
    addressData.is_default = true;
  }
  
  this.customer_data.addresses.push(addressData);
  return this.save();
};

userSchema.methods.addToWishlist = function(productId) {
  if (!this.customer_data.wishlist.includes(productId)) {
    this.customer_data.wishlist.push(productId);
    return this.save();
  }
  return Promise.resolve(this);
};

userSchema.methods.removeFromWishlist = function(productId) {
  this.customer_data.wishlist = this.customer_data.wishlist.filter(
    id => !id.equals(productId)
  );
  return this.save();
};

userSchema.methods.updateActivity = function() {
  this.last_active = new Date();
  return this.save();
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByTenant = function(tenantId, role = null) {
  const query = { tenant_id: tenantId };
  if (role) query.role = role;
  return this.find(query);
};

// Virtual for full name (if needed in the future)
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Transform output
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.email_verification_token;
    delete ret.password_reset_token;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);