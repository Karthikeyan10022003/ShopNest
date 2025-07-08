// routes/customers.js
const express = require('express');
// const { query, param, validationResult } = require('express-validator');
const { query, param, body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { authorizePermissions } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers for tenant
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
  query('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
], authorizePermissions('read_customers'), async (req, res) => {
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
      search,
      status,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    // Build filter query
    const filter = { 
      tenant_id: req.tenantId,
      role: 'customer'
    };
    
    if (status) filter.status = status;
    
    // Text search
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [customers, total] = await Promise.all([
      User.find(filter)
        .select('-password -email_verification_token -password_reset_token')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      customers,
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
    console.error('Get customers error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch customers'
    });
  }
});

// @route   GET /api/customers/:id
// @desc    Get single customer
// @access  Private
router.get('/:id', authorizePermissions('read_customers'), async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      tenant_id: req.tenantId,
      role: 'customer'
    }).select('-password -email_verification_token -password_reset_token');

    if (!customer) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Customer not found'
      });
    }

    // Get customer's order statistics
    const orderStats = await Order.aggregate([
      {
        $match: {
          tenant_id: req.tenantId,
          customer_id: customer._id
        }
      },
      {
        $group: {
          _id: null,
          total_orders: { $sum: 1 },
          total_spent: { $sum: '$total' },
          avg_order_value: { $avg: '$total' },
          last_order_date: { $max: '$created_at' }
        }
      }
    ]);

    const stats = orderStats[0] || {
      total_orders: 0,
      total_spent: 0,
      avg_order_value: 0,
      last_order_date: null
    };

    res.json({ 
      customer: {
        ...customer.toObject(),
        order_stats: stats
      }
    });

  } catch (error) {
    console.error('Get customer error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'Invalid customer ID format'
      });
    }
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch customer'
    });
  }
});

// @route   GET /api/customers/:id/orders
// @desc    Get customer's orders
// @access  Private
router.get('/:id/orders', [
  param('id').isMongoId().withMessage('Invalid customer ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], authorizePermissions('read_orders'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { page = 1, limit = 10 } = req.query;

    // Verify customer exists
    const customer = await User.findOne({
      _id: req.params.id,
      tenant_id: req.tenantId,
      role: 'customer'
    });

    if (!customer) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Customer not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find({
        tenant_id: req.tenantId,
        customer_id: customer._id
      })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
      Order.countDocuments({
        tenant_id: req.tenantId,
        customer_id: customer._id
      })
    ]);

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
    console.error('Get customer orders error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch customer orders'
    });
  }
});

// @route   PUT /api/customers/:id/status
// @desc    Update customer status
// @access  Private
router.put('/:id/status', 
  authorizePermissions('write_customers'),
  [
    param('id').isMongoId().withMessage('Invalid customer ID'),
    body('status').isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
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

      const customer = await User.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId,
        role: 'customer'
      });

      if (!customer) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Customer not found'
        });
      }

      customer.status = req.body.status;
      await customer.save();

      res.json({
        message: 'Customer status updated successfully',
        customer: {
          _id: customer._id,
          status: customer.status,
          updated_at: customer.updated_at
        }
      });

    } catch (error) {
      console.error('Update customer status error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update customer status'
      });
    }
  }
);

// @route   GET /api/customers/analytics/overview
// @desc    Get customer analytics overview
// @access  Private
router.get('/analytics/overview', authorizePermissions('read_analytics'), async (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    // Build date filter
    const dateFilter = { tenant_id: req.tenantId, role: 'customer' };
    if (date_from || date_to) {
      dateFilter.created_at = {};
      if (date_from) dateFilter.created_at.$gte = new Date(date_from);
      if (date_to) dateFilter.created_at.$lte = new Date(date_to);
    }

    const [
      totalCustomers,
      newCustomers,
      activeCustomers,
      customerGrowth
    ] = await Promise.all([
      // Total customers
      User.countDocuments({ tenant_id: req.tenantId, role: 'customer' }),
      
      // New customers in date range
      User.countDocuments(dateFilter),
      
      // Active customers (with orders in last 30 days)
      User.countDocuments({
        tenant_id: req.tenantId,
        role: 'customer',
        last_active: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      
      // Customer growth (previous period comparison)
      User.aggregate([
        {
          $match: {
            tenant_id: req.tenantId,
            role: 'customer',
            created_at: {
              $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // Last 60 days
            }
          }
        },
        {
          $group: {
            _id: {
              period: {
                $cond: {
                  if: { $gte: ['$created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  then: 'current',
                  else: 'previous'
                }
              }
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Calculate growth percentage
    const currentPeriod = customerGrowth.find(g => g._id.period === 'current')?.count || 0;
    const previousPeriod = customerGrowth.find(g => g._id.period === 'previous')?.count || 0;
    const growthPercentage = previousPeriod > 0 
      ? ((currentPeriod - previousPeriod) / previousPeriod) * 100 
      : 0;

    res.json({
      total_customers: totalCustomers,
      new_customers: newCustomers,
      active_customers: activeCustomers,
      growth_percentage: Math.round(growthPercentage * 100) / 100,
      retention_rate: totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0
    });

  } catch (error) {
    console.error('Get customer analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch customer analytics'
    });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer (admin only, with data cleanup)
// @access  Private
router.delete('/:id', authorizePermissions('delete_customers'), async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      tenant_id: req.tenantId,
      role: 'customer'
    });

    if (!customer) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Customer not found'
      });
    }

    // Check if customer has orders
    const orderCount = await Order.countDocuments({
      tenant_id: req.tenantId,
      customer_id: customer._id
    });

    if (orderCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete',
        message: 'Customer has existing orders and cannot be deleted. Consider deactivating instead.',
        orders_count: orderCount
      });
    }

    await User.deleteOne({ _id: customer._id });

    // Update tenant usage
    await req.tenant.decrementUsage('users');

    res.json({
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Delete customer error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'Invalid customer ID format'
      });
    }
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete customer'
    });
  }
});

module.exports = router;