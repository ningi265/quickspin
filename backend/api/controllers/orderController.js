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
      progress: 25 // Starting progress
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

    res.status(201).json(order);
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

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };