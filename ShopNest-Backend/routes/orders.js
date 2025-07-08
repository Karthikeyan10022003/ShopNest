// routes/orders.js
const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { authorizePermissions } = require('../middleware/auth');
const { checkTenantLimits } = require('../middleware/tenant');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders for tenant
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
  query('payment_status').optional().isIn(['pending', 'paid', 'partially_paid', 'refunded', 'partially_refunded', 'failed']).withMessage('Invalid payment status')
], authorizePermissions('read_orders'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      status,
      payment_status,
      customer_email,
      order_number,
      date_from,
      date_to,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    // Build filter query
    const filter = { tenant_id: req.tenantId };
    
    if (status) filter.status = status;
    if (payment_status) filter.payment_status = payment_status;
    if (customer_email) filter.customer_email = new RegExp(customer_email, 'i');
    if (order_number) filter.order_number = new RegExp(order_number, 'i');
    
    // Date range filter
    if (date_from || date_to) {
      filter.created_at = {};
      if (date_from) filter.created_at.$gte = new Date(date_from);
      if (date_to) filter.created_at.$lte = new Date(date_to);
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('customer_id', 'name email')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      orders,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: total,
        items_per_page: parseInt(limit),
        has_next_page: parseInt(page) < totalPages,
        has_prev_page: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', authorizePermissions('read_orders'), async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      tenant_id: req.tenantId
    })
    .populate('customer_id', 'name email phone')
    .populate('items.product_id', 'name images');

    if (!order) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Order not found'
      });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'Invalid order ID format'
      });
    }
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch order'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', 
  checkTenantLimits('orders'),
  authorizePermissions('write_orders'),
  [
    body('customer_email').isEmail().withMessage('Valid email is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.product_id').isMongoId().withMessage('Valid product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('billing_address').notEmpty().withMessage('Billing address is required'),
    body('payment_method').isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash_on_delivery']).withMessage('Invalid payment method')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const orderData = {
        ...req.body,
        tenant_id: req.tenantId
      };

      // Calculate totals
      orderData.subtotal = orderData.items.reduce((sum, item) => {
        item.total = item.quantity * item.price;
        return sum + item.total;
      }, 0);

      const order = new Order(orderData);
      await order.save();

      // Update tenant usage
      await req.tenant.incrementUsage('orders');

      // Populate references for response
      await order.populate('customer_id', 'name email');

      res.status(201).json({
        message: 'Order created successfully',
        order
      });

    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create order'
      });
    }
  }
);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', 
  authorizePermissions('write_orders'),
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
    body('note').optional().trim().isLength({ max: 500 }).withMessage('Note too long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const order = await Order.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId
      });

      if (!order) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Order not found'
        });
      }

      await order.updateStatus(req.body.status, req.body.note, req.user._id);

      res.json({
        message: 'Order status updated successfully',
        order: {
          _id: order._id,
          status: order.status,
          updated_at: order.updated_at
        }
      });

    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update order status'
      });
    }
  }
);

// @route   PUT /api/orders/:id/tracking
// @desc    Update order tracking
// @access  Private
router.put('/:id/tracking',
  authorizePermissions('write_orders'),
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('tracking_number').notEmpty().withMessage('Tracking number is required'),
    body('tracking_url').optional().isURL().withMessage('Invalid tracking URL')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const order = await Order.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId
      });

      if (!order) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Order not found'
        });
      }

      await order.setTracking(req.body.tracking_number, req.body.tracking_url);

      res.json({
        message: 'Tracking information updated successfully',
        tracking: {
          tracking_number: order.tracking_number,
          tracking_url: order.tracking_url,
          status: order.status
        }
      });

    } catch (error) {
      console.error('Update tracking error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update tracking information'
      });
    }
  }
);

// @route   POST /api/orders/:id/refund
// @desc    Process order refund
// @access  Private
router.post('/:id/refund',
  authorizePermissions('write_orders'),
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('amount').isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
    body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason too long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const order = await Order.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId
      });

      if (!order) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Order not found'
        });
      }

      if (!order.canBeRefunded()) {
        return res.status(400).json({
          error: 'Cannot refund',
          message: 'Order cannot be refunded in its current state'
        });
      }

      const refundAmount = parseFloat(req.body.amount);
      const remainingAmount = order.getRemainingRefundableAmount();

      if (refundAmount > remainingAmount) {
        return res.status(400).json({
          error: 'Invalid amount',
          message: `Refund amount exceeds remaining refundable amount of $${remainingAmount}`
        });
      }

      const refundData = {
        amount: refundAmount,
        reason: req.body.reason || 'Customer requested refund',
        processed_by: req.user._id
      };

      await order.addRefund(refundData);

      res.json({
        message: 'Refund processed successfully',
        refund: refundData,
        order_status: order.status,
        payment_status: order.payment_status
      });

    } catch (error) {
      console.error('Process refund error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process refund'
      });
    }
  }
);

// @route   DELETE /api/orders/:id
// @desc    Delete order (admin only)
// @access  Private
router.delete('/:id', authorizePermissions('delete_orders'), async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      tenant_id: req.tenantId
    });

    if (!order) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Order not found'
      });
    }

    // Only allow deletion of cancelled or pending orders
    if (!['cancelled', 'pending'].includes(order.status)) {
      return res.status(400).json({
        error: 'Cannot delete',
        message: 'Only cancelled or pending orders can be deleted'
      });
    }

    await Order.deleteOne({ _id: order._id });

    // Update tenant usage
    await req.tenant.decrementUsage('orders');

    res.json({
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'Invalid order ID format'
      });
    }
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete order'
    });
  }
});

module.exports = router;