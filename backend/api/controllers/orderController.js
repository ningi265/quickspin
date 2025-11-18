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
    const orderId = `ORD-${timestamp}${random}`;

    // Generate unique QR code data
    const qrCodeData = `QUICKSPIN_${orderId}_${timestamp}`;

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
        const qrFilename = `qr-${orderId}-${timestamp}.png`;
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
      orderId: orderId,
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

    // Prepare response
    const response = {
      ...order.toObject(),
      qrCodeData: qrCodeData,
      qrCodeImage: qrCodeImage
    };

    console.log('📦 Order created successfully with ID:', orderId);
    console.log('🔗 You can open the QR code image file to see the visual representation');
    
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    console.log('📦 Fetching orders for user:', req.userId);
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    console.log('✅ Found orders:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    }).populate('services.serviceId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const tracking = await Tracking.findOne({ orderId: order._id });
    
    res.json({ order, tracking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, progress } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status, progress },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
      .populate('userId', 'name phone address');

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

    console.log('✅ QR code verified successfully for order:', order.orderId);

    res.json({
      success: true,
      message: 'Pickup verified successfully',
      order: {
        orderId: order.orderId,
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
    
    const order = await Order.findOne({ orderId })
      .populate('userId', 'name phone')
      .select('orderId status progress pickupVerification createdAt');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
        progress: order.progress,
        pickupVerified: order.pickupVerification?.verified || false,
        verifiedAt: order.pickupVerification?.verifiedAt,
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
  getOrderStatus
};