// routes/auth.js
const express = require('express');
const router = express.Router();

// Super simple mock users for testing
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@techstore.com',
    password: 'password123',
    role: 'tenant_owner'
  },
  {
    id: 2,
    name: 'Mike Johnson', 
    email: 'mike@example.com',
    password: 'password123',
    role: 'customer'
  }
];

// @route   POST /api/auth/login
// @desc    Login user - SUPER SIMPLE VERSION
// @access  Public
router.post('/login', (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Request body:', req.body);
  console.log('Email:', req.body.email);
  console.log('Password:', req.body.password);
  
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email);
  console.log('Found user:', user ? 'YES' : 'NO');
  
  if (!user) {
    console.log('❌ User not found');
    return res.status(401).json({
      error: 'User not found'
    });
  }
  
  // Check password
  console.log('Checking password...');
  console.log('User password:', user.password);
  console.log('Provided password:', password);
  console.log('Passwords match:', user.password === password);
  
  if (user.password !== password) {
    console.log('❌ Password mismatch');
    return res.status(401).json({
      error: 'Invalid password'
    });
  }
  
  console.log('✅ Login successful!');
  
  // Success
  res.json({
    message: 'Login successful',
    token: 'test-jwt-token-' + user.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', (req, res) => {
  res.json({
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@techstore.com',
      role: 'tenant_owner'
    }
  });
});

module.exports = router;