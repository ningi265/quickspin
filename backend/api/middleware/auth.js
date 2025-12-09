const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Add this import

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Fetch user from database - THIS IS THE KEY CHANGE
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user info to request
    req.userId = decoded.userId;
    req.user = user; // Add this line
    req.userRole = user.role; // Add this line
    
    console.log('🔐 Authenticated user:', {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    });
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;