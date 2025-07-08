// models/Tenant.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true,
    maxlength: [100, 'Tenant name cannot exceed 100 characters']
  },
  subdomain: {
    type: String,
    required: [true, 'Subdomain is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'],
    minlength: [3, 'Subdomain must be at least 3 characters'],
    maxlength: [50, 'Subdomain cannot exceed 50 characters']
  },
  custom_domain: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'pro', 'enterprise'],
    default: 'basic'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'trial', 'cancelled'],
    default: 'trial'
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Plan limits
  limits: {
    max_products: {
      type: Number,
      default: function() {
        switch(this.plan) {
          case 'basic': return 100;
          case 'pro': return 1000;
          case 'enterprise': return 10000;
          default: return 10; // trial
        }
      }
    },
    max_orders: {
      type: Number,
      default: function() {
        switch(this.plan) {
          case 'basic': return 1000;
          case 'pro': return 10000;
          case 'enterprise': return 100000;
          default: return 50; // trial
        }
      }
    },
    max_storage_mb: {
      type: Number,
      default: function() {
        switch(this.plan) {
          case 'basic': return 1024;
          case 'pro': return 5120;
          case 'enterprise': return 20480;
          default: return 100; // trial
        }
      }
    },
    max_users: {
      type: Number,
      default: function() {
        switch(this.plan) {
          case 'basic': return 3;
          case 'pro': return 10;
          case 'enterprise': return 50;
          default: return 1; // trial
        }
      }
    }
  },
  
  // Current usage
  usage: {
    products_count: { type: Number, default: 0 },
    orders_count: { type: Number, default: 0 },
    storage_used_mb: { type: Number, default: 0 },
    users_count: { type: Number, default: 1 }
  },
  
  // Branding and customization
  branding: {
    logo_url: String,
    favicon_url: String,
    primary_color: { type: String, default: '#3B82F6' },
    secondary_color: { type: String, default: '#8B5CF6' },
    font_family: { type: String, default: 'Inter' }
  },
  
  // Settings
  settings: {
    tagline: String,
    welcome_message: String,
    contact_email: String,
    support_email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postal_code: String
    },
    social_links: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String
    },
    seo: {
      meta_title: String,
      meta_description: String,
      keywords: [String]
    },
    features: {
      reviews_enabled: { type: Boolean, default: true },
      wishlist_enabled: { type: Boolean, default: true },
      coupons_enabled: { type: Boolean, default: true },
      inventory_tracking: { type: Boolean, default: true },
      multi_currency: { type: Boolean, default: false },
      tax_calculation: { type: Boolean, default: true }
    }
  },
  
  // Billing information
  billing: {
    stripe_customer_id: String,
    subscription_id: String,
    subscription_status: {
      type: String,
      enum: ['active', 'past_due', 'canceled', 'unpaid'],
      default: 'active'
    },
    current_period_start: Date,
    current_period_end: Date,
    trial_end: Date
  },
  
  // API and integrations
  integrations: {
    stripe_publishable_key: String,
    stripe_secret_key: String,
    google_analytics_id: String,
    facebook_pixel_id: String,
    mailchimp_api_key: String,
    smtp_settings: {
      host: String,
      port: Number,
      secure: Boolean,
      user: String,
      password: String
    }
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
tenantSchema.index({ subdomain: 1 });
tenantSchema.index({ custom_domain: 1 });
tenantSchema.index({ owner_id: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ 'billing.subscription_status': 1 });

// Pre-save middleware
tenantSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.subdomain) {
    this.subdomain = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Instance methods
tenantSchema.methods.isWithinLimits = function(resource) {
  const usage = this.usage[`${resource}_count`];
  const limit = this.limits[`max_${resource}`];
  return usage < limit;
};

tenantSchema.methods.incrementUsage = function(resource, amount = 1) {
  this.usage[`${resource}_count`] += amount;
  return this.save();
};

tenantSchema.methods.decrementUsage = function(resource, amount = 1) {
  this.usage[`${resource}_count`] = Math.max(0, this.usage[`${resource}_count`] - amount);
  return this.save();
};

tenantSchema.methods.isTrialExpired = function() {
  return this.billing.trial_end && new Date() > this.billing.trial_end;
};

tenantSchema.methods.isSubscriptionActive = function() {
  return this.billing.subscription_status === 'active';
};

tenantSchema.methods.canAccess = function() {
  return this.status === 'active' && 
         (this.isSubscriptionActive() || !this.isTrialExpired());
};

// Static methods
tenantSchema.statics.findBySubdomain = function(subdomain) {
  return this.findOne({ subdomain: subdomain.toLowerCase() });
};

tenantSchema.statics.findByCustomDomain = function(domain) {
  return this.findOne({ custom_domain: domain.toLowerCase() });
};

tenantSchema.statics.findByDomain = function(hostname) {
  // First try custom domain
  return this.findByCustomDomain(hostname)
    .then(tenant => {
      if (tenant) return tenant;
      
      // Then try subdomain
      const subdomain = hostname.split('.')[0];
      return this.findBySubdomain(subdomain);
    });
};

// Virtual for full domain
tenantSchema.virtual('domain').get(function() {
  return this.custom_domain || `${this.subdomain}.yourdomain.com`;
});

// Transform output
tenantSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.integrations; // Don't expose sensitive data
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Tenant', tenantSchema);