const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  timeline: [{
    step: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'in_progress'],
      default: 'pending'
    },
    completed: {
      type: Boolean,
      default: false
    },
    time: Date,
    description: String
  }],
  currentStep: {
    type: String,
    default: 'order_placed'
  },
  deliveryAgent: {
    name: String,
    phone: String,
    vehicle: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tracking', trackingSchema);