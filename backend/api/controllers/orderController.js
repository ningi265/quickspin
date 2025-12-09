// orderController.js
const Order = require('../models/order');
const Service = require('../models/service');
const Tracking = require('../models/tracking');

// Try to require QRCode, but handle if it fails
let QRCode;
try {
  QRCode = require('qrcode');
  console.log('✅ QRCode package loaded successfully');
} catch (qrError) {
  console.log('⚠️ QRCode package not available, proceeding without QR generation');
  QRCode = null;
}

const createOrder = async (req, res) => {
  try {
    const {
      services,
      pickupDate,
      pickupTimeSlot,
      location,
      specialInstructions,
      items
    } = req.body;

    // Calculate total price
    let totalPrice = 0;
    const serviceDetails = await Service.find({ 
      _id: { $in: services.map(s => s.serviceId) } 
    });

    const orderServices = services.map(service => {
      const serviceInfo = serviceDetails.find(s => s._id.toString() === service.serviceId);
      const serviceTotal = serviceInfo.pricePerKg * service.quantity;
      totalPrice += serviceTotal;
      
      return {
        serviceId: service.serviceId,
        name: serviceInfo.name,
        price: serviceInfo.pricePerKg,
        quantity: service.quantity
      };
    });

    // Generate simple order ID
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${timestamp}${random}`;

    // Generate unique QR code data
    const qrCodeData = `QUICKSPIN_${orderNumber}_${timestamp}`;

    // Calculate delivery date
    const deliveryDate = new Date(pickupDate);
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    deliveryDate.setHours(14, 0, 0, 0);

    // Generate QR code image only if package is available
    let qrCodeImage = null;
    if (QRCode) {
      try {
        console.log('🔄 Generating QR code...');
        console.log('📊 QR Code Data:', qrCodeData);
        
        qrCodeImage = await QRCode.toDataURL(qrCodeData);
        
        console.log('✅ QR code generated successfully!');
        console.log('📏 QR Code Image Length:', qrCodeImage.length);
        
        // Save QR code as image file for testing
        const fs = require('fs');
        const path = require('path');
        
        // Remove the data URL prefix
        const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, "");
        
        // Create qr-codes directory if it doesn't exist
        const qrDir = path.join(__dirname, 'qr-codes');
        if (!fs.existsSync(qrDir)) {
          fs.mkdirSync(qrDir);
        }
        
        // Save QR code as PNG file
        const qrFilename = `qr-${orderNumber}-${timestamp}.png`;
        const qrFilePath = path.join(qrDir, qrFilename);
        fs.writeFileSync(qrFilePath, base64Data, 'base64');
        
        console.log('💾 QR Code saved as:', qrFilePath);
        console.log('📁 Absolute path:', path.resolve(qrFilePath));
        
      } catch (qrError) {
        console.error('❌ QR code generation failed:', qrError);
      }
    } else {
      console.log('⚠️ QR code generation skipped - QRCode package not available');
    }

    // Create order with QR code data
    const order = new Order({
      orderNumber: orderNumber,
      userId: req.userId,
      services: orderServices,
      totalPrice,
      pickupDate,
      pickupTimeSlot,
      deliveryDate,
      estimatedDelivery: `Tomorrow, 2:00 PM`,
      location,
      specialInstructions,
      items,
      progress: 25,
      qrCode: qrCodeData,
      qrCodeImage: qrCodeImage
    });

    await order.save();

    // Create tracking timeline
    const tracking = new Tracking({
      orderId: order._id,
      timeline: [
        { step: 'Order Placed', completed: true, time: new Date(), description: 'Order has been placed' },
        { step: 'Pickup Scheduled', completed: true, time: new Date(), description: 'Pickup has been scheduled' },
        { step: 'Items Collected', completed: false, description: 'Items will be collected from your location' },
        { step: 'In Processing', completed: false, description: 'Your laundry is being processed' },
        { step: 'Ready for Delivery', completed: false, description: 'Order is ready for delivery' },
        { step: 'Delivered', completed: false, description: 'Order has been delivered' }
      ],
      currentStep: 'order_placed'
    });

    await tracking.save();

    // Populate order with user info for notifications
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email phone')
      .lean();

    // EMIT REAL-TIME NOTIFICATION TO ADMIN - ADDED THIS SECTION
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('new-order', {
        type: 'NEW_ORDER',
        message: '📦 New order received!',
        order: {
          _id: order._id,
          orderNumber: orderNumber,
          orderId: orderNumber, // For compatibility
          userId: populatedOrder.userId,
          totalPrice: totalPrice,
          status: 'pending',
          pickupDate: pickupDate,
          deliveryDate: deliveryDate,
          location: location,
          services: orderServices,
          items: items,
          createdAt: new Date(),
          progress: 25
        },
        timestamp: new Date(),
        notificationId: `notif-${Date.now()}`
      });
      console.log('🔔 New order notification sent to admin room');
      
      // Also notify the specific customer about their order status
      io.to(`customer-${req.userId}`).emit('order-update', {
        type: 'ORDER_CREATED',
        message: 'Your order has been placed successfully!',
        order: {
          orderNumber: orderNumber,
          totalPrice: totalPrice,
          status: 'pending'
        },
        timestamp: new Date()
      });
      console.log(`👤 Order confirmation sent to customer: ${req.userId}`);
    }

    // Prepare response
    const response = {
      success: true,
      message: 'Order created successfully',
      order: {
        ...populatedOrder,
        orderId: orderNumber, // For compatibility
        qrCodeData: qrCodeData,
        qrCodeImage: qrCodeImage
      }
    };

    console.log('📦 Order created successfully with ID:', orderNumber);
    console.log('🔗 You can open the QR code image file to see the visual representation');
    
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

const getOrders = async (req, res) => {
  try {
    console.log('📦 Fetching orders for user:', req.userId);
    
    // Build query based on user role
    let query = {};
    
    // If not admin, only show user's orders
    if (req.user?.role !== 'admin') {
      query.userId = req.userId;
      console.log('👤 Showing user-specific orders');
    } else {
      console.log('👑 Admin: Showing ALL orders');
      // Admin sees all orders - no userId filter
    }
    
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Add search/filter
    if (req.query.search) {
      query.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'location.address': { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Get total count
    const total = await Order.countDocuments(query);
    
    // Fetch orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email phone')
      .populate('driverId', 'name phone vehicleModel');
    
    console.log(`✅ Found ${orders.length} orders (total: ${total})`);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
    
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      console.log('❌ Non-admin user attempted to access all orders. Role:', req.user?.role);
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }
    
    console.log('👑 Admin fetching ALL orders');
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    
    // Build query (no user filter)
    let query = {};
    
    // Add filters
    if (req.query.search) {
      query.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'location.address': { $regex: req.query.search, $options: 'i' } },
        { 'userId.name': { $regex: req.query.search, $options: 'i' } },
        { 'userId.email': { $regex: req.query.search, $options: 'i' } },
        { 'userId.phone': { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.driverId) {
      query.driverId = req.query.driverId;
    }
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }
    
    // Get total
    const total = await Order.countDocuments(query);
    
    // Fetch all orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email phone')
      .populate('driverId', 'name phone vehicleModel')
      .lean();
    
    console.log(`✅ Admin retrieved ${orders.length} orders out of ${total}`);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      filters: {
        search: req.query.search || '',
        status: req.query.status || 'all',
        dateRange: {
          start: req.query.startDate,
          end: req.query.endDate
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Admin get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // If not admin, check user ID
    if (req.user?.role !== 'admin') {
      query.userId = req.userId;
    }
    
    const order = await Order.findOne(query)
      .populate('userId', 'name email phone')
      .populate('services.serviceId');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    const tracking = await Tracking.findOne({ orderId: order._id });
    
    res.json({
      success: true,
      order,
      tracking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, progress, driverId } = req.body;
    
    let query = { _id: req.params.id };
    let updateData = {};
    
    // Build update data
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (driverId !== undefined) updateData.driverId = driverId;
    
    // If not admin, check user ID
    if (req.user?.role !== 'admin') {
      query.userId = req.userId;
    }
    
    const order = await Order.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    ).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // EMIT REAL-TIME UPDATE NOTIFICATION - ADDED THIS SECTION
    const io = req.app.get('io');
    if (io) {
      // Notify admin about order status update
      io.to('admin-room').emit('order-status-updated', {
        type: 'ORDER_STATUS_UPDATED',
        message: `Order #${order.orderNumber} status updated to ${status}`,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: status,
          progress: progress,
          driverId: driverId,
          updatedAt: new Date()
        },
        timestamp: new Date(),
        notificationId: `status-${Date.now()}`
      });
      
      // Notify the customer about their order status update
      if (order.userId && order.userId._id) {
        io.to(`customer-${order.userId._id}`).emit('order-status-update', {
          type: 'ORDER_STATUS_CHANGED',
          message: `Your order #${order.orderNumber} status has been updated`,
          status: status,
          progress: progress,
          timestamp: new Date()
        });
      }
      
      // Notify driver if assigned
      if (driverId) {
        io.to(`driver-${driverId}`).emit('order-assigned', {
          type: 'ORDER_ASSIGNED',
          message: `New order assigned to you: #${order.orderNumber}`,
          order: {
            _id: order._id,
            orderNumber: order.orderNumber,
            location: order.location,
            customer: order.userId
          },
          timestamp: new Date()
        });
      }
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// QR Code verification controller
const verifyQRCode = async (req, res) => {
  try {
    const { qrData } = req.body; // Change from qrCodeData to qrData
    const driverId = req.userId;

    console.log('🔍 Verifying QR code:', qrData);

    if (!qrData) {
      return res.status(400).json({ 
        success: false,
        message: 'QR code data is required' 
      });
    }

    // Find order by QR code
    const order = await Order.findOne({ qrCode: qrData })
      .populate('userId', 'name phone address')
      .populate('driverId', 'name phone vehicleModel');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid QR code or order not found' 
      });
    }

    // Check if already verified
    if (order.pickupVerification && order.pickupVerification.verified) {
      return res.status(400).json({ 
        success: false,
        message: 'QR code already used' 
      });
    }

    // Update order status and verification
    order.status = 'picked_up';
    order.progress = 50;
    order.pickupVerification = {
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: driverId
    };

    await order.save();

    // Update tracking
    const tracking = await Tracking.findOne({ orderId: order._id });
    if (tracking) {
      const collectedStep = tracking.timeline.find(step => step.step === 'Items Collected');
      if (collectedStep) {
        collectedStep.completed = true;
        collectedStep.time = new Date();
        collectedStep.description = `Items collected by driver at ${new Date().toLocaleString()}`;
      }
      tracking.currentStep = 'items_collected';
      await tracking.save();
    }

    // EMIT REAL-TIME QR VERIFICATION NOTIFICATION - ADDED THIS SECTION
    const io = req.app.get('io');
    if (io) {
      // Notify admin about QR verification
      io.to('admin-room').emit('qr-verified', {
        type: 'QR_VERIFIED',
        message: `Order #${order.orderNumber} picked up successfully`,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: 'picked_up',
          driver: order.driverId,
          verifiedAt: new Date()
        },
        timestamp: new Date(),
        notificationId: `qr-${Date.now()}`
      });
      
      // Notify the customer about pickup
      if (order.userId && order.userId._id) {
        io.to(`customer-${order.userId._id}`).emit('order-picked-up', {
          type: 'ORDER_PICKED_UP',
          message: `Your order #${order.orderNumber} has been picked up`,
          driver: order.driverId,
          timestamp: new Date()
        });
      }
    }

    console.log('✅ QR code verified successfully for order:', order.orderNumber);

    res.json({
      success: true,
      message: 'Pickup verified successfully',
      order: {
        orderNumber: order.orderNumber,
        customerName: order.userId.name,
        customerAddress: order.userId.address,
        customerPhone: order.userId.phone,
        services: order.services
      }
    });
  } catch (error) {
    console.error('❌ QR verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderNumber: orderId })
      .populate('userId', 'name phone')
      .populate('driverId', 'name phone vehicleModel')
      .select('orderNumber status progress pickupVerification createdAt driverId');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        progress: order.progress,
        pickupVerified: order.pickupVerification?.verified || false,
        verifiedAt: order.pickupVerification?.verifiedAt,
        driver: order.driverId,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Order status check error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  verifyQRCode,
  getOrderStatus,
  getAllOrders
};