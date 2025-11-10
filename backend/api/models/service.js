const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  estimatedTime: {
    type: Number, // in hours
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);