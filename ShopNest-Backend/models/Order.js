// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant_id: {
    type: String, // ID of the variant within the product
    default: null
  },
  name: {
    type: String,
    required: true
  },
  sku: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  product_data: {
    // Snapshot of product data at time of order
    description: String,
    image_url: String,
    weight: {
      value: Number,
      unit: String
    },
    attributes: {
      color: String,
      size: String,
      // Other variant attributes
      custom: Map
    }
  }
});

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  company: String,
  address_line_1: {
    type: String,
    required: true
  },
  address_line_2: String,
  city: {
    type: String,
    required: true
  },
  state: String,
  postal_code: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const shippingMethodSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  estimated_delivery_days: {
    min: Number,
    max: Number
  },
  carrier: String,
  tracking_url_template: String
});

const orderSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  order_number: {
    type: String,
    required: true,
    unique: true
  },
  
  // Customer information
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Can be null for guest orders
  },
  customer_email: {
    type: String,
    required: true,
    lowercase: true
  },
  is_guest: {
    type: Boolean,
    default: false
  },
  
  // Order items
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  discount_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  
  // Addresses
  billing_address: {
    type: addressSchema,
    required: true
  },
  shipping_address: addressSchema,
  different_shipping_address: {
    type: Boolean,
    default: false
  },
  
  // Shipping
  shipping_method: shippingMethodSchema,
  tracking_number: String,
  tracking_url: String,
  estimated_delivery_date: Date,
  actual_delivery_date: Date,
  
  // Payment
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded', 'partially_refunded', 'failed'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  payment_gateway: String,
  payment_gateway_transaction_id: String,
  
  // Order status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  fulfillment_status: {
    type: String,
    enum: ['unfulfilled', 'partially_fulfilled', 'fulfilled'],
    default: 'unfulfilled'
  },
  
  // Discounts and coupons
  coupon_code: String,
  coupon_discount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Notes and metadata
  notes: String,
  internal_notes: String, // Admin only notes
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin', 'api'],
    default: 'web'
  },
  
  // Timestamps for status changes
  status_history: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Refunds
  refunds: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    reason: String,
    refund_method: String,
    gateway_refund_id: String,
    processed_at: {
      type: Date,
      default: Date.now
    },
    processed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Analytics and marketing
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  referrer: String,
  
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
orderSchema.index({ tenant_id: 1, order_number: 1 }, { unique: true });
orderSchema.index({ tenant_id: 1, customer_id: 1 });
orderSchema.index({ tenant_id: 1, customer_email: 1 });
orderSchema.index({ tenant_id: 1, status: 1 });
orderSchema.index({ tenant_id: 1, payment_status: 1 });
orderSchema.index({ tenant_id: 1, created_at: -1 });
orderSchema.index({ tracking_number: 1 });

// Pre-save middleware
orderSchema.pre('save', function(next) {
  // Calculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.tax_amount + this.shipping_amount - this.discount_amount;
  
  // Set shipping address to billing address if not different
  if (!this.different_shipping_address) {
    this.shipping_address = this.billing_address;
  }
  
  // Add status change to history if status was modified
  if (this.isModified('status')) {
    this.status_history.push({
      status: this.status,
      timestamp: new Date(),
      updated_by: this.updated_by
    });
  }
  
  next();
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.order_number) {
    const count = await this.constructor.countDocuments({ tenant_id: this.tenant_id });
    const year = new Date().getFullYear();
    this.order_number = `ORD-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Instance methods
orderSchema.methods.getTotalQuantity = function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
};

orderSchema.methods.getTotalWeight = function() {
  return this.items.reduce((sum, item) => {
    const weight = item.product_data?.weight?.value || 0;
    return sum + (weight * item.quantity);
  }, 0);
};

orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

orderSchema.methods.canBeRefunded = function() {
  return ['delivered'].includes(this.status) && this.payment_status === 'paid';
};

orderSchema.methods.isFullyRefunded = function() {
  const totalRefunded = this.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  return totalRefunded >= this.total;
};

orderSchema.methods.getRemainingRefundableAmount = function() {
  const totalRefunded = this.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  return Math.max(0, this.total - totalRefunded);
};

orderSchema.methods.addRefund = function(refundData) {
  this.refunds.push(refundData);
  
  const totalRefunded = this.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  if (totalRefunded >= this.total) {
    this.payment_status = 'refunded';
    this.status = 'refunded';
  } else {
    this.payment_status = 'partially_refunded';
  }
  
  return this.save();
};

orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.updated_by = updatedBy;
  
  // Update fulfillment status based on order status
  if (['delivered'].includes(newStatus)) {
    this.fulfillment_status = 'fulfilled';
  } else if (['shipped'].includes(newStatus)) {
    this.fulfillment_status = 'partially_fulfilled';
  }
  
  // Set delivery date if delivered
  if (newStatus === 'delivered' && !this.actual_delivery_date) {
    this.actual_delivery_date = new Date();
  }
  
  return this.save();
};

orderSchema.methods.setTracking = function(trackingNumber, trackingUrl = null) {
  this.tracking_number = trackingNumber;
  if (trackingUrl) {
    this.tracking_url = trackingUrl;
  } else if (this.shipping_method?.tracking_url_template) {
    this.tracking_url = this.shipping_method.tracking_url_template.replace('{tracking_number}', trackingNumber);
  }
  
  // Auto-update status to shipped if not already
  if (!['shipped', 'delivered'].includes(this.status)) {
    this.status = 'shipped';
  }
  
  return this.save();
};

// Static methods
orderSchema.statics.findByTenant = function(tenantId, filters = {}) {
  return this.find({ tenant_id: tenantId, ...filters });
};

orderSchema.statics.findByCustomer = function(tenantId, customerId) {
  return this.find({ 
    tenant_id: tenantId, 
    customer_id: customerId 
  }).sort({ created_at: -1 });
};

orderSchema.statics.findByOrderNumber = function(tenantId, orderNumber) {
  return this.findOne({ 
    tenant_id: tenantId, 
    order_number: orderNumber 
  });
};

orderSchema.statics.getRevenueStats = function(tenantId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        tenant_id: mongoose.Types.ObjectId(tenantId),
        status: { $in: ['delivered', 'shipped'] },
        payment_status: 'paid',
        created_at: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total_revenue: { $sum: '$total' },
        total_orders: { $sum: 1 },
        average_order_value: { $avg: '$total' }
      }
    }
  ]);
};

// Virtual for display-friendly order number
orderSchema.virtual('display_number').get(function() {
  return this.order_number;
});

// Transform output
orderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    delete ret.internal_notes; // Don't expose internal notes to customers
    return ret;
  }
});

module.exports = mongoose.model('Order', orderSchema);