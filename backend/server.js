const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./api/config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', require('./api/routes/authRoutes'));
app.use('/api/orders', require('./api/routes/ordersRoutes'));
app.use('/api/services', require('./api/routes/servicesRoutes'));
app.use('/api/tracking', require('./api/routes/trackingRoutes'));
app.use('/api/drivers', require('./api/routes/drivers'));
app.use('/api/system-settings', require('./api/routes/systemSettings'));
app.use('/api/statistics', require('./api/routes/statisticsRoutes'));

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'QuickSpin Laundry Service API', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      orders: '/api/orders',
      services: '/api/services',
      tracking: '/api/tracking'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler - FIXED VERSION
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'GET /api/orders',
      'POST /api/orders',
      'GET /api/orders/:id',
      'GET /api/services',
      'GET /api/tracking/:orderId'
    ]
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});