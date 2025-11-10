const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// authController.js - Updated register function with detailed logging
const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;

    console.log('📝 Registration attempt received');
    console.log('📦 Request body:', { 
      name: name || 'missing', 
      email: email || 'missing', 
      phoneNumber: phoneNumber || 'missing', 
      address: address || 'missing', 
      password: password ? '***' : 'missing' 
    });

    // Validate required fields
    if (!name || !email || !phoneNumber || !address || !password) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!phoneNumber) missingFields.push('phoneNumber');
      if (!address) missingFields.push('address');
      if (!password) missingFields.push('password');
      
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('❌ Password too short:', password.length, 'characters');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    console.log('🔍 Checking if user exists...');
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log('✅ No existing user found');

    console.log('🔐 Hashing password...');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ Password hashed successfully');

    console.log('👤 Creating new user...');
    // Create user
    const user = new User({
      name,
      email,
      phoneNumber,
      address,
      password: hashedPassword
    });

    console.log('💾 Saving user to database...');
    await user.save();
    console.log('✅ User saved successfully with ID:', user._id);

    console.log('🎫 Generating JWT token...');
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    console.log('✅ Token generated successfully');

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      memberSince: user.memberSince
    };

    console.log('✅ Registration successful for:', user.email);
    console.log('📤 Sending response with user data');

    res.status(201).json({
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('💥 Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('❌ MongoDB validation errors:', validationErrors);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    if (error.code === 11000) {
      console.log('❌ MongoDB duplicate key error');
      return res.status(400).json({ message: 'User already exists' });
    }

    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};

// authController.js - Updated login function with better logging
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', { email, password: password ? '***' : 'missing' });

    // Check if email and password are provided
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for user:', user.email);
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        memberSince: user.memberSince
      }
    });
  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getProfile };