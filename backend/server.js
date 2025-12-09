const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http'); // Add this
const socketio = require('socket.io'); // Add this
const connectDB = require('./api/config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketio(server, { // Initialize Socket.IO
  cors: {
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Enable both transports
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  // Join admin room
  socket.on('join-admin-room', () => {
    socket.join('admin-room');
    console.log('👑 Admin joined admin room:', socket.id);
  });
  
  // Join customer room (for specific customer updates)
  socket.on('join-customer-room', (customerId) => {
    socket.join(`customer-${customerId}`);
    console.log(`👤 Customer ${customerId} joined their room`);
  });
  
  // Join driver room (for specific driver updates)
  socket.on('join-driver-room', (driverId) => {
    socket.join(`driver-${driverId}`);
    console.log(`🚗 Driver ${driverId} joined their room`);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
  
  // Error handling
  socket.on('error', (error) => {
    console.error('🔌 Socket error:', error);
  });
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: '*', // Temporary for testing
  credentials: true
}));
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
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    socketClients: io.engine.clientsCount
  });
});

// Socket.IO test endpoint
app.get('/socket-test', (req, res) => {
  // Emit a test event to all connected clients
  io.emit('test-event', {
    message: 'Test message from server',
    timestamp: new Date().toISOString()
  });
  
  res.json({
    success: true,
    message: 'Test event emitted',
    clientCount: io.engine.clientsCount
  });
});

// Socket.IO admin test endpoint
app.post('/socket-test-admin', (req, res) => {
  const { message = 'Test notification' } = req.body;
  
  // Emit to admin room only
  io.to('admin-room').emit('test-admin-event', {
    type: 'TEST',
    message: message,
    timestamp: new Date().toISOString(),
    notificationId: `test-${Date.now()}`
  });
  
  res.json({
    success: true,
    message: 'Admin test event emitted',
    adminRoomMessage: message
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /socket-test',
      'POST /socket-test-admin',
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

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`🔌 Socket.IO server initialized`);
  console.log(`🌐 Accessible at http://localhost:${PORT}`);
  console.log(`🌐 Accessible at http://10.176.40.232:${PORT}`);
  console.log(`📡 WebSocket URL: ws://10.176.40.232:${PORT}`);
});