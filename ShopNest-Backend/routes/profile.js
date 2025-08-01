// routes/profile.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -password_reset_token -password_reset_expires -email_verification_token -email_verification_expires')
      .populate('tenant_id', 'name domain');

    if (!user) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    res.json({
      message: 'Profile retrieved successfully',
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve profile'
    });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', 
  authenticateToken,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    
    body('date_of_birth')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid date'),
    
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    
    body('website')
      .optional()
      .isURL()
      .withMessage('Please provide a valid website URL'),
    
    body('address.street')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Street address too long'),
    
    body('address.city')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('City name too long'),
    
    body('address.state')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('State name too long'),
    
    body('address.zipCode')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('ZIP code too long'),
    
    body('address.country')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Country name too long'),
    
    body('preferences.language')
      .optional()
      .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'])
      .withMessage('Invalid language'),
    
    body('preferences.currency')
      .optional()
      .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR'])
      .withMessage('Invalid currency'),
    
    body('preferences.timezone')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Invalid timezone')
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

      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({
          error: 'Not found',
          message: 'User not found'
        });
      }

      // Check if email is being changed and if it's already taken
      if (req.body.email && req.body.email !== user.email) {
        const existingUser = await User.findOne({ 
          email: req.body.email,
          _id: { $ne: user._id }
        });
        
        if (existingUser) {
          return res.status(400).json({
            error: 'Email already exists',
            message: 'This email is already registered to another account'
          });
        }
        
        // If email is changed, mark as unverified
        user.email_verified = false;
      }

      // Update basic fields
      const allowedFields = [
        'name', 'email', 'phone', 'date_of_birth', 
        'bio', 'website', 'avatar'
      ];
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      // Update nested objects
      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }

      if (req.body.preferences) {
        user.profile = user.profile || {};
        user.profile.preferences = { 
          ...user.profile.preferences, 
          ...req.body.preferences 
        };
      }

      await user.save();

      // Return updated user without sensitive data
      const updatedUser = await User.findById(user._id)
        .select('-password -password_reset_token -password_reset_expires -email_verification_token -email_verification_expires');

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });

    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          error: 'Duplicate value',
          message: 'Email already exists'
        });
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update profile'
      });
    }
  }
);

// @route   PUT /api/profile/password
// @desc    Change user password
// @access  Private
router.put('/password',
  authenticateToken,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one letter and one number'),
    
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match new password');
        }
        return true;
      })
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

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id).select('+password');
      
      if (!user) {
        return res.status(404).json({
          error: 'Not found',
          message: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: 'Invalid password',
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.password = hashedNewPassword;
      await user.save();

      res.json({
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to change password'
      });
    }
  }
);

// @route   POST /api/profile/avatar
// @desc    Upload profile avatar
// @access  Private
router.post('/avatar',
  authenticateToken,
  async (req, res) => {
    try {
      // This would typically use multer middleware for file upload
      // and cloudinary for image processing
      
      const { avatar } = req.body; // Base64 image data

      if (!avatar) {
        return res.status(400).json({
          error: 'No avatar provided',
          message: 'Please provide an avatar image'
        });
      }

      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({
          error: 'Not found',
          message: 'User not found'
        });
      }

      // In a real implementation, you would:
      // 1. Validate image format and size
      // 2. Upload to cloud storage (Cloudinary, AWS S3, etc.)
      // 3. Get the uploaded image URL
      // 4. Save the URL to user.avatar

      user.avatar = avatar; // For demo purposes, saving base64 directly
      await user.save();

      res.json({
        message: 'Avatar uploaded successfully',
        avatar: user.avatar
      });

    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to upload avatar'
      });
    }
  }
);

// @route   DELETE /api/profile/avatar
// @desc    Delete profile avatar
// @access  Private
router.delete('/avatar', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    user.avatar = null;
    await user.save();

    res.json({
      message: 'Avatar deleted successfully'
    });

  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete avatar'
    });
  }
});

// @route   GET /api/profile/stats
// @desc    Get user stats (orders, spending, etc.)
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const Order = require('../models/Order');
    
    const stats = await Order.aggregate([
      {
        $match: {
          customer_id: req.user._id,
          tenant_id: req.user.tenant_id
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    const userStats = stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0
    };

    // Get wishlist count (if you have a wishlist model)
    // const wishlistCount = await Wishlist.countDocuments({ user_id: req.user._id });

    res.json({
      message: 'User stats retrieved successfully',
      stats: {
        ...userStats,
        wishlistItems: 0 // wishlistCount
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user stats'
    });
  }
});

module.exports = router;