// routes/tenants.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Tenant = require('../models/Tenant');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tenants/resolve/subdomain/:subdomain
// @desc    Resolve tenant by subdomain
// @access  Public
router.get('/resolve/subdomain/:subdomain', [
  param('subdomain').isLength({ min: 3, max: 50 }).withMessage('Invalid subdomain')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { subdomain } = req.params;
    
    const tenant = await Tenant.findBySubdomain(subdomain)
      .select('-integrations -billing.stripe_secret_key'); // Don't expose sensitive data

    if (!tenant) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'No tenant found with this subdomain'
      });
    }

    // Check if tenant is accessible
    if (!tenant.canAccess()) {
      return res.status(403).json({
        error: 'Tenant not accessible',
        message: 'Tenant account is not active or subscription expired'
      });
    }

    res.json({ tenant });

  } catch (error) {
    console.error('Resolve tenant by subdomain error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to resolve tenant'
    });
  }
});

// @route   GET /api/tenants/resolve/domain/:domain
// @desc    Resolve tenant by custom domain
// @access  Public
router.get('/resolve/domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    const tenant = await Tenant.findByCustomDomain(domain)
      .select('-integrations -billing.stripe_secret_key');

    if (!tenant) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'No tenant found with this domain'
      });
    }

    if (!tenant.canAccess()) {
      return res.status(403).json({
        error: 'Tenant not accessible',
        message: 'Tenant account is not active or subscription expired'
      });
    }

    res.json({ tenant });

  } catch (error) {
    console.error('Resolve tenant by domain error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to resolve tenant'
    });
  }
});

// @route   GET /api/tenants/:id
// @desc    Get tenant by ID
// @access  Private
router.get('/:id', authenticateToken, [
  param('id').isMongoId().withMessage('Invalid tenant ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const tenant = await Tenant.findById(req.params.id)
      .populate('owner_id', 'name email')
      .select('-integrations -billing.stripe_secret_key');

    if (!tenant) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'Tenant not found'
      });
    }

    // Check if user can access this tenant
    if (req.user.role !== 'super_admin' && 
        !req.user.tenant_id.equals(tenant._id) && 
        req.user.role !== 'tenant_owner') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to access this tenant'
      });
    }

    res.json({ tenant });

  } catch (error) {
    console.error('Get tenant error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'Invalid tenant ID format'
      });
    }
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch tenant'
    });
  }
});

// @route   PUT /api/tenants/:id
// @desc    Update tenant
// @access  Private (Tenant Owner only)
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('tenant_owner', 'super_admin'),
  [
    param('id').isMongoId().withMessage('Invalid tenant ID'),
    body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
    body('custom_domain').optional().trim().isLength({ max: 255 }).withMessage('Domain too long'),
    body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR']).withMessage('Invalid currency'),
    body('timezone').optional().trim().isLength({ max: 50 }).withMessage('Invalid timezone')
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

      const tenant = await Tenant.findById(req.params.id);

      if (!tenant) {
        return res.status(404).json({
          error: 'Tenant not found',
          message: 'Tenant not found'
        });
      }

      // Check permissions
      if (req.user.role !== 'super_admin' && 
          (!req.user.tenant_id.equals(tenant._id) || req.user.role !== 'tenant_owner')) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to update this tenant'
        });
      }

      // Update allowed fields
      const allowedUpdates = [
        'name', 'custom_domain', 'currency', 'timezone',
        'branding', 'settings'
      ];

      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          if (field === 'branding' || field === 'settings') {
            // Merge objects instead of replacing
            tenant[field] = { ...tenant[field], ...req.body[field] };
          } else {
            tenant[field] = req.body[field];
          }
        }
      });

      await tenant.save();

      // Return updated tenant without sensitive data
      const updatedTenant = await Tenant.findById(tenant._id)
        .select('-integrations -billing.stripe_secret_key');

      res.json({
        message: 'Tenant updated successfully',
        tenant: updatedTenant
      });

    } catch (error) {
      console.error('Update tenant error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Invalid tenant ID format'
        });
      }

      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          error: 'Duplicate value',
          message: `${field} already exists`
        });
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update tenant'
      });
    }
  }
);

// @route   GET /api/tenants/:id/settings
// @desc    Get tenant settings
// @access  Private
router.get('/:id/settings', 
  authenticateToken,
  [param('id').isMongoId().withMessage('Invalid tenant ID')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const tenant = await Tenant.findById(req.params.id)
        .select('settings branding limits usage');

      if (!tenant) {
        return res.status(404).json({
          error: 'Tenant not found',
          message: 'Tenant not found'
        });
      }

      // Check permissions
      if (req.user.role !== 'super_admin' && 
          !req.user.tenant_id.equals(tenant._id)) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to access this tenant'
        });
      }

      res.json({
        settings: tenant.settings,
        branding: tenant.branding,
        limits: tenant.limits,
        usage: tenant.usage
      });

    } catch (error) {
      console.error('Get tenant settings error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch tenant settings'
      });
    }
  }
);

// @route   PUT /api/tenants/:id/settings
// @desc    Update tenant settings
// @access  Private (Tenant Admin/Owner)
router.put('/:id/settings',
  authenticateToken,
  authorizeRoles('tenant_owner', 'tenant_admin', 'super_admin'),
  [param('id').isMongoId().withMessage('Invalid tenant ID')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const tenant = await Tenant.findById(req.params.id);

      if (!tenant) {
        return res.status(404).json({
          error: 'Tenant not found',
          message: 'Tenant not found'
        });
      }

      // Check permissions
      if (req.user.role !== 'super_admin' && 
          !req.user.tenant_id.equals(tenant._id)) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to update this tenant'
        });
      }

      // Update settings and branding
      if (req.body.settings) {
        tenant.settings = { ...tenant.settings, ...req.body.settings };
      }

      if (req.body.branding) {
        tenant.branding = { ...tenant.branding, ...req.body.branding };
      }

      await tenant.save();

      res.json({
        message: 'Settings updated successfully',
        settings: tenant.settings,
        branding: tenant.branding
      });

    } catch (error) {
      console.error('Update tenant settings error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update settings'
      });
    }
  }
);

// @route   GET /api/tenants/:id/usage
// @desc    Get tenant usage statistics
// @access  Private
router.get('/:id/usage',
  authenticateToken,
  [param('id').isMongoId().withMessage('Invalid tenant ID')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const tenant = await Tenant.findById(req.params.id)
        .select('usage limits plan');

      if (!tenant) {
        return res.status(404).json({
          error: 'Tenant not found',
          message: 'Tenant not found'
        });
      }

      // Check permissions
      if (req.user.role !== 'super_admin' && 
          !req.user.tenant_id.equals(tenant._id)) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to access this tenant'
        });
      }

      // Calculate usage percentages
      const usageStats = {
        products: {
          current: tenant.usage.products_count,
          limit: tenant.limits.max_products,
          percentage: Math.round((tenant.usage.products_count / tenant.limits.max_products) * 100)
        },
        orders: {
          current: tenant.usage.orders_count,
          limit: tenant.limits.max_orders,
          percentage: Math.round((tenant.usage.orders_count / tenant.limits.max_orders) * 100)
        },
        storage: {
          current: tenant.usage.storage_used_mb,
          limit: tenant.limits.max_storage_mb,
          percentage: Math.round((tenant.usage.storage_used_mb / tenant.limits.max_storage_mb) * 100)
        },
        users: {
          current: tenant.usage.users_count,
          limit: tenant.limits.max_users,
          percentage: Math.round((tenant.usage.users_count / tenant.limits.max_users) * 100)
        }
      };

      res.json({
        plan: tenant.plan,
        usage: usageStats
      });

    } catch (error) {
      console.error('Get tenant usage error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch usage statistics'
      });
    }
  }
);

module.exports = router;