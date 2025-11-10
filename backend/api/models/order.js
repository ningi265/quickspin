const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'picked_up', 'in_progress', 'ready_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  pickupDate: {
    type: Date,
    required: true
  },
  pickupTimeSlot: {
    type: String,
    required: true
  },
  deliveryDate: {
    type: Date
  },
  estimatedDelivery: {
    type: String
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  specialInstructions: String,
  items: [{
    name: String,
    quantity: Number,
    weight: Number
  }],
  progress: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Fixed pre-save middleware
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderId) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      this.orderId = `ORD-${String(count + 1).padStart(3, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Order', orderSchema);