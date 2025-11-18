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
      password: hashedPassword,
      role: 'customer'
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


const getUsers = async (req, res) => {
  try {
    console.log('👥 Admin fetching users list');
    
    // Check if user is admin (you might want to add admin role to your user model)
     const requestingUser = await User.findById(req.userId);
     console.log(requestingUser.role);
     if (!requestingUser || requestingUser.role !== 'admin') {
       return res.status(403).json({ message: 'Access denied. Admin only.' });
     }

    const { 
      page = 1, 
      limit = 10, 
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc' 
    } = req.query;

    console.log('📋 Query parameters:', { page, limit, search, sortBy, sortOrder });

    // Build search filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    console.log('🔍 Executing database query...');
    
    // Get users with pagination
    const users = await User.find(filter)
      .select('-password') // Exclude password field
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limitNum);

    console.log(`✅ Found ${users.length} users out of ${totalUsers} total`);

    // Format response
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role || 'customer', // Default to customer if role doesn't exist
      memberSince: user.memberSince,
      isActive: user.isActive !== undefined ? user.isActive : true, // Default to active
      lastLogin: user.lastLogin,
      orderCount: user.orderCount || 0, // You might want to calculate this from orders
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json({
      success: true,
      users: formattedUsers,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
      },
      filters: {
        search,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('💥 Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching users', 
      error: error.message 
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    console.log('🔄 Updating user status:', { userId, status });

    // Validate status
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "active" or "inactive"'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user status
    user.isActive = status === 'active';
    await user.save();

    console.log('✅ User status updated successfully');

    res.json({
      success: true,
      message: `User status updated to ${status}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.isActive ? 'active' : 'inactive',
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('💥 Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status',
      error: error.message
    });
  }
};

module.exports = { register, login, getProfile, getUsers, updateUserStatus };