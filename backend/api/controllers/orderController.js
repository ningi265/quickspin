const Order = require('../models/order');
const Service = require('../models/service');
const Tracking = require('../models/tracking');

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

    // Calculate estimated delivery (next day 2:00 PM)
    const deliveryDate = new Date(pickupDate);
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    deliveryDate.setHours(14, 0, 0, 0);

    // Generate simple order ID
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderId = `ORD-${timestamp}${random}`;

    // Generate unique QR code data
    const qrCodeData = `LAUNDRY_ORDER_${orderId}_${Date.now()}`;

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
      progress: 25, // Starting progress
      qrCode: qrCodeData // Store QR code data
    });

    await order.save();

    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

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

    // Return order with QR code
    res.status(201).json({
      ...order.toObject(),
      qrCodeImage
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getOrders = async (req, res) => {
  try {
    console.log('📦 Fetching orders for user:', req.userId)
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    console.log('✅ Found orders:', orders.length)
    res.json(orders);
  } catch (error) {
    console.error('❌ Get orders error:', error)
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


const verifyQRCode = async (req, res) => {
  try {
    const { qrCodeData } = req.body;
    const driverId = req.userId; // Assuming driver is authenticated

    // Find order by QR code
    const order = await Order.findOne({ qrCode: qrCodeData })
      .populate('userId', 'name phone address');

    if (!order) {
      return res.status(404).json({ message: 'Invalid QR code or order not found' });
    }

    // Check if already verified
    if (order.pickupVerification.verified) {
      return res.status(400).json({ message: 'QR code already used' });
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
    console.error('QR verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, verifyQRCode };