// routes/products.js
const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { authorizePermissions } = require('../middleware/auth');
const { checkTenantLimits } = require('../middleware/tenant');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Product name is required and must not exceed 200 characters'),
  body('description').optional().isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
  body('price').optional().isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category_id').optional().isMongoId().withMessage('Invalid category ID'),
  body('status').optional().isIn(['active', 'inactive', 'draft', 'archived']).withMessage('Invalid status')
];

// @route   GET /api/products
// @desc    Get all products for tenant
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['active', 'inactive', 'draft', 'archived']).withMessage('Invalid status'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
  query('category_id').optional().isMongoId().withMessage('Invalid category ID'),
  query('sort').optional().isIn(['name', 'price', 'created_at', 'sales_count', 'rating.average']).withMessage('Invalid sort field')
], authorizePermissions('read_products'), async (req, res) => {
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
      search,
      category_id,
      brand,
      min_price,
      max_price,
      featured,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    // Build filter query
    const filter = { tenant_id: req.tenantId };
    
    if (status) filter.status = status;
    if (category_id) filter.category_id = category_id;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (featured !== undefined) filter.featured = featured === 'true';
    
    // Price range filter
    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = parseFloat(min_price);
      if (max_price) filter.price.$lte = parseFloat(max_price);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    if (search) {
      sortObj.score = { $meta: 'textScore' };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category_id', 'name')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      products,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: total,
        items_per_page: parseInt(limit),
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private
router.get('/:id', authorizePermissions('read_products'), async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      tenant_id: req.tenantId
    })
    .populate('category_id', 'name')
    .populate('related_products', 'name price images')
    .populate('created_by', 'name')
    .populate('updated_by', 'name');

    if (!product) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Product not found'
      });
    }

    // Increment views count (async, don't wait)
    product.incrementViews().catch(err => 
      console.error('Failed to increment views:', err)
    );

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'Invalid product ID format'
      });
    }
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch product'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private
router.post('/', 
  checkTenantLimits('products'),
  authorizePermissions('write_products'),
  productValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const productData = {
        ...req.body,
        tenant_id: req.tenantId,
        created_by: req.user._id
      };

      // Handle SKU uniqueness within tenant
      if (productData.sku) {
        const existingProduct = await Product.findOne({
          tenant_id: req.tenantId,
          sku: productData.sku
        });
        
        if (existingProduct) {
          return res.status(400).json({
            error: 'Validation failed',
            message: 'SKU already exists'
          });
        }
      }

      const product = new Product(productData);
      await product.save();

      // Update tenant usage
      await req.tenant.incrementUsage('products');

      // Populate references for response
      await product.populate('category_id', 'name');
      await product.populate('created_by', 'name');

      res.status(201).json({
        message: 'Product created successfully',
        product
      });

    } catch (error) {
      console.error('Create product error:', error);
      
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          error: 'Duplicate value',
          message: `${field} already exists`
        });
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create product'
      });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', 
  authorizePermissions('write_products'),
  productValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const product = await Product.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId
      });

      if (!product) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Product not found'
        });
      }

      // Handle SKU uniqueness within tenant
      if (req.body.sku && req.body.sku !== product.sku) {
        const existingProduct = await Product.findOne({
          tenant_id: req.tenantId,
          sku: req.body.sku,
          _id: { $ne: product._id }
        });
        
        if (existingProduct) {
          return res.status(400).json({
            error: 'Validation failed',
            message: 'SKU already exists'
          });
        }
      }

      // Update product
      Object.assign(product, req.body);
      product.updated_by = req.user._id;
      await product.save();

      // Populate references for response
      await product.populate('category_id', 'name');
      await product.populate('updated_by', 'name');

      res.json({
        message: 'Product updated successfully',
        product
      });

    } catch (error) {
      console.error('Update product error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Invalid product ID format'
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
        message: 'Failed to update product'
      });
    }
  }
);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private
router.delete('/:id', authorizePermissions('delete_products'), async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      tenant_id: req.tenantId
    });

    if (!product) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Product not found'
      });
    }

    // Check if product has orders (you might want to prevent deletion)
    // const hasOrders = await Order.exists({ 'items.product_id': product._id });
    // if (hasOrders) {
    //   return res.status(400).json({
    //     error: 'Cannot delete',
    //     message: 'Product has associated orders and cannot be deleted'
    //   });
    // }

    await Product.deleteOne({ _id: product._id });

    // Update tenant usage
    await req.tenant.decrementUsage('products');

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete product'
    });
  }
});

// @route   PATCH /api/products/:id/status
// @desc    Update product status
// @access  Private
router.patch('/:id/status', 
  authorizePermissions('write_products'),
  [body('status').isIn(['active', 'inactive', 'draft', 'archived']).withMessage('Invalid status')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const product = await Product.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId
      });

      if (!product) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Product not found'
        });
      }

      product.status = req.body.status;
      product.updated_by = req.user._id;
      await product.save();

      res.json({
        message: 'Product status updated successfully',
        product: {
          _id: product._id,
          status: product.status
        }
      });

    } catch (error) {
      console.error('Update product status error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update product status'
      });
    }
  }
);

// @route   POST /api/products/:id/variants
// @desc    Add product variant
// @access  Private
router.post('/:id/variants', 
  authorizePermissions('write_products'),
  [
    body('name').trim().notEmpty().withMessage('Variant name is required'),
    body('sku').trim().notEmpty().withMessage('Variant SKU is required'),
    body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
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

      const product = await Product.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId
      });

      if (!product) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Product not found'
        });
      }

      // Check if SKU already exists in variants
      const existingSku = product.variants.find(v => v.sku === req.body.sku.toUpperCase());
      if (existingSku) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Variant SKU already exists'
        });
      }

      // Check global SKU uniqueness within tenant
      const existingProduct = await Product.findOne({
        tenant_id: req.tenantId,
        $or: [
          { sku: req.body.sku.toUpperCase() },
          { 'variants.sku': req.body.sku.toUpperCase() }
        ]
      });

      if (existingProduct) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'SKU already exists in another product'
        });
      }

      // Add variant
      product.variants.push(req.body);
      product.product_type = 'variable';
      product.updated_by = req.user._id;
      await product.save();

      res.status(201).json({
        message: 'Product variant added successfully',
        variant: product.variants[product.variants.length - 1]
      });

    } catch (error) {
      console.error('Add product variant error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to add product variant'
      });
    }
  }
);

// @route   PUT /api/products/:id/variants/:variantId
// @desc    Update product variant
// @access  Private
router.put('/:id/variants/:variantId', 
  authorizePermissions('write_products'),
  async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId
      });

      if (!product) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Product not found'
        });
      }

      const variant = product.variants.id(req.params.variantId);
      if (!variant) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Variant not found'
        });
      }

      // Check SKU uniqueness if being updated
      if (req.body.sku && req.body.sku !== variant.sku) {
        const existingSku = product.variants.find(v => 
          v._id.toString() !== req.params.variantId && v.sku === req.body.sku.toUpperCase()
        );
        if (existingSku) {
          return res.status(400).json({
            error: 'Validation failed',
            message: 'Variant SKU already exists'
          });
        }
      }

      // Update variant
      Object.assign(variant, req.body);
      product.updated_by = req.user._id;
      await product.save();

      res.json({
        message: 'Product variant updated successfully',
        variant
      });

    } catch (error) {
      console.error('Update product variant error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update product variant'
      });
    }
  }
);

// @route   DELETE /api/products/:id/variants/:variantId
// @desc    Delete product variant
// @access  Private
router.delete('/:id/variants/:variantId', 
  authorizePermissions('delete_products'),
  async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
        tenant_id: req.tenantId
      });

      if (!product) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Product not found'
        });
      }

      const variant = product.variants.id(req.params.variantId);
      if (!variant) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Variant not found'
        });
      }

      // Remove variant
      product.variants.pull(req.params.variantId);
      
      // If no variants left, change back to simple product
      if (product.variants.length === 0) {
        product.product_type = 'simple';
      }
      
      product.updated_by = req.user._id;
      await product.save();

      res.json({
        message: 'Product variant deleted successfully'
      });

    } catch (error) {
      console.error('Delete product variant error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to delete product variant'
      });
    }
  }
);

// @route   GET /api/products/:id/related
// @desc    Get related products
// @access  Private
router.get('/:id/related', authorizePermissions('read_products'), async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      tenant_id: req.tenantId
    });

    if (!product) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Product not found'
      });
    }

    // Get related products by category if no explicit relations
    let relatedProducts = [];
    
    if (product.related_products.length > 0) {
      relatedProducts = await Product.find({
        _id: { $in: product.related_products },
        tenant_id: req.tenantId,
        status: 'active'
      }).select('name price images rating').limit(8);
    } else if (product.category_id) {
      relatedProducts = await Product.find({
        category_id: product.category_id,
        tenant_id: req.tenantId,
        status: 'active',
        _id: { $ne: product._id }
      }).select('name price images rating').limit(8);
    }

    res.json({
      related_products: relatedProducts
    });

  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch related products'
    });
  }
});

// @route   POST /api/products/bulk-import
// @desc    Bulk import products
// @access  Private
router.post('/bulk-import', 
  authorizePermissions('write_products'),
  async (req, res) => {
    try {
      const { products } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Products array is required'
        });
      }

      // Check tenant limits
      const currentCount = await Product.countDocuments({ tenant_id: req.tenantId });
      if (currentCount + products.length > req.tenant.limits.max_products) {
        return res.status(403).json({
          error: 'Limit exceeded',
          message: 'Bulk import would exceed product limit for your plan'
        });
      }

      const results = {
        success: [],
        errors: []
      };

      for (let i = 0; i < products.length; i++) {
        try {
          const productData = {
            ...products[i],
            tenant_id: req.tenantId,
            created_by: req.user._id
          };

          const product = new Product(productData);
          await product.save();
          
          results.success.push({
            index: i,
            product_id: product._id,
            name: product.name
          });

        } catch (error) {
          results.errors.push({
            index: i,
            error: error.message,
            product: products[i]
          });
        }
      }

      // Update tenant usage for successful imports
      if (results.success.length > 0) {
        await req.tenant.incrementUsage('products', results.success.length);
      }

      res.json({
        message: `Bulk import completed. ${results.success.length} products imported, ${results.errors.length} errors.`,
        results
      });

    } catch (error) {
      console.error('Bulk import error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Bulk import failed'
      });
    }
  }
);

module.exports = router;