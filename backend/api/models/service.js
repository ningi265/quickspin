const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  pricePerKg: {
    type: Number,
    required: true,
    min: 0
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
    type: Number, 
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);