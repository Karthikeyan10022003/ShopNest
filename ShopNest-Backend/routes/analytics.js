// routes/analytics.js
const express = require('express');
const { query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { authorizePermissions } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private
router.get('/overview', [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period')
], authorizePermissions('read_analytics'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { period = '30d' } = req.query;
    
    // Calculate date range
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = periodDays[period];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    // Get overview metrics
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueGrowth,
      orderGrowth
    ] = await Promise.all([
      // Total revenue
      Order.aggregate([
        {
          $match: {
            tenant_id: req.tenantId,
            status: { $in: ['delivered', 'shipped'] },
            payment_status: 'paid',
            created_at: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]),

      // Total orders
      Order.countDocuments({
        tenant_id: req.tenantId,
        created_at: { $gte: startDate, $lte: endDate }
      }),

      // Total customers
      User.countDocuments({
        tenant_id: req.tenantId,
        role: 'customer',
        created_at: { $gte: startDate, $lte: endDate }
      }),

      // Total products
      Product.countDocuments({
        tenant_id: req.tenantId,
        status: 'active'
      }),

      // Revenue growth (previous period comparison)
      Order.aggregate([
        {
          $match: {
            tenant_id: req.tenantId,
            status: { $in: ['delivered', 'shipped'] },
            payment_status: 'paid',
            created_at: {
              $gte: new Date(Date.now() - 2 * days * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              period: {
                $cond: {
                  if: { $gte: ['$created_at', startDate] },
                  then: 'current',
                  else: 'previous'
                }
              }
            },
            total: { $sum: '$total' }
          }
        }
      ]),

      // Order growth
      Order.aggregate([
        {
          $match: {
            tenant_id: req.tenantId,
            created_at: {
              $gte: new Date(Date.now() - 2 * days * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              period: {
                $cond: {
                  if: { $gte: ['$created_at', startDate] },
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

    // Calculate growth percentages
    const currentRevenue = totalRevenue[0]?.total || 0;
    const previousRevenue = revenueGrowth.find(g => g._id.period === 'previous')?.total || 0;
    const revenueGrowthPercentage = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const currentOrders = orderGrowth.find(g => g._id.period === 'current')?.count || 0;
    const previousOrders = orderGrowth.find(g => g._id.period === 'previous')?.count || 0;
    const orderGrowthPercentage = previousOrders > 0 
      ? ((currentOrders - previousOrders) / previousOrders) * 100 
      : 0;

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? currentRevenue / totalOrders : 0;

    res.json({
      period,
      metrics: {
        total_revenue: Math.round(currentRevenue * 100) / 100,
        total_orders: totalOrders,
        total_customers: totalCustomers,
        total_products: totalProducts,
        average_order_value: Math.round(averageOrderValue * 100) / 100,
        revenue_growth: Math.round(revenueGrowthPercentage * 100) / 100,
        order_growth: Math.round(orderGrowthPercentage * 100) / 100
      }
    });

  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch analytics overview'
    });
  }
});

// @route   GET /api/analytics/sales-chart
// @desc    Get sales chart data
// @access  Private
router.get('/sales-chart', [
  query('period').optional().isIn(['7d', '30d', '90d']).withMessage('Invalid period'),
  query('group_by').optional().isIn(['day', 'week', 'month']).withMessage('Invalid group_by')
], authorizePermissions('read_analytics'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { period = '30d', group_by = 'day' } = req.query;
    
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    };
    
    const days = periodDays[period];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Build aggregation pipeline based on grouping
    let groupStage;
    if (group_by === 'day') {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' },
            day: { $dayOfMonth: '$created_at' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      };
    } else if (group_by === 'week') {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            week: { $week: '$created_at' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      };
    } else {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      };
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          tenant_id: req.tenantId,
          status: { $in: ['delivered', 'shipped'] },
          payment_status: 'paid',
          created_at: { $gte: startDate }
        }
      },
      groupStage,
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);

    // Format data for chart
    const chartData = salesData.map(item => {
      let date;
      if (group_by === 'day') {
        date = new Date(item._id.year, item._id.month - 1, item._id.day).toISOString().split('T')[0];
      } else if (group_by === 'week') {
        date = `${item._id.year}-W${item._id.week}`;
      } else {
        date = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      }

      return {
        date,
        revenue: Math.round(item.revenue * 100) / 100,
        orders: item.orders
      };
    });

    res.json({
      period,
      group_by,
      data: chartData
    });

  } catch (error) {
    console.error('Get sales chart error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch sales chart data'
    });
  }
});

// @route   GET /api/analytics/top-products
// @desc    Get top selling products
// @access  Private
router.get('/top-products', [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period')
], authorizePermissions('read_analytics'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { limit = 10, period = '30d' } = req.query;
    
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = periodDays[period];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const topProducts = await Order.aggregate([
      {
        $match: {
          tenant_id: req.tenantId,
          status: { $in: ['delivered', 'shipped'] },
          created_at: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product_id',
          product_name: { $first: '$items.name' },
          total_quantity: { $sum: '$items.quantity' },
          total_revenue: { $sum: '$items.total' },
          order_count: { $sum: 1 }
        }
      },
      { $sort: { total_quantity: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product_details'
        }
      },
      {
        $project: {
          product_id: '$_id',
          product_name: '$product_name',
          total_quantity: 1,
          total_revenue: { $round: ['$total_revenue', 2] },
          order_count: 1,
          price: { $arrayElemAt: ['$product_details.price', 0] },
          images: { $arrayElemAt: ['$product_details.images', 0] }
        }
      }
    ]);

    res.json({
      period,
      top_products: topProducts
    });

  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch top products'
    });
  }
});

// @route   GET /api/analytics/customer-insights
// @desc    Get customer analytics insights
// @access  Private
router.get('/customer-insights', [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period')
], authorizePermissions('read_analytics'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { period = '30d' } = req.query;
    
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = periodDays[period];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      customerSegments,
      newVsReturning,
      topCustomers
    ] = await Promise.all([
      // Customer segments by order value
      Order.aggregate([
        {
          $match: {
            tenant_id: req.tenantId,
            status: { $in: ['delivered', 'shipped'] },
            created_at: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$customer_id',
            total_spent: { $sum: '$total' },
            order_count: { $sum: 1 }
          }
        },
        {
          $bucket: {
            groupBy: '$total_spent',
            boundaries: [0, 100, 500, 1000, 5000, Infinity],
            default: 'Other',
            output: {
              count: { $sum: 1 },
              avg_order_value: { $avg: { $divide: ['$total_spent', '$order_count'] } }
            }
          }
        }
      ]),

      // New vs returning customers
      Order.aggregate([
        {
          $match: {
            tenant_id: req.tenantId,
            created_at: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$customer_id',
            first_order: { $min: '$created_at' },
            order_count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $gte: ['$first_order', startDate] },
                then: 'new',
                else: 'returning'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]),

      // Top customers by revenue
      Order.aggregate([
        {
          $match: {
            tenant_id: req.tenantId,
            status: { $in: ['delivered', 'shipped'] },
            created_at: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$customer_id',
            customer_email: { $first: '$customer_email' },
            total_spent: { $sum: '$total' },
            order_count: { $sum: 1 },
            avg_order_value: { $avg: '$total' }
          }
        },
        { $sort: { total_spent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'customer_details'
          }
        },
        {
          $project: {
            customer_email: 1,
            customer_name: { $arrayElemAt: ['$customer_details.name', 0] },
            total_spent: { $round: ['$total_spent', 2] },
            order_count: 1,
            avg_order_value: { $round: ['$avg_order_value', 2] }
          }
        }
      ])
    ]);

    res.json({
      period,
      customer_segments: customerSegments,
      new_vs_returning: newVsReturning,
      top_customers: topCustomers
    });

  } catch (error) {
    console.error('Get customer insights error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch customer insights'
    });
  }
});

module.exports = router;