const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  // Pricing Settings
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0,
      default: 15.99
    },
    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
      default: 2.50
    },
    expressFee: {
      type: Number,
      required: true,
      min: 0,
      default: 9.99
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },

  // Business Hours
  businessHours: {
    openingTime: {
      type: String,
      required: true,
      default: '08:00'
    },
    closingTime: {
      type: String,
      required: true,
      default: '22:00'
    },
    workingDays: [{
      type: String,
      enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    }]
  },

  // Service Settings
  serviceOptions: {
    sameDayDelivery: {
      type: Boolean,
      default: true
    },
    expressDelivery: {
      type: Boolean,
      default: true
    },
    cashOnDelivery: {
      type: Boolean,
      default: true
    },
    onlinePayment: {
      type: Boolean,
      default: true
    }
  },

  // Service Areas
  serviceAreas: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    zipCodes: [String],
    deliveryFee: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  }],

  // Notification Settings
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: true
    },
    orderUpdates: {
      type: Boolean,
      default: true
    },
    promotional: {
      type: Boolean,
      default: false
    }
  },

  // System Settings
  system: {
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    autoAssignDrivers: {
      type: Boolean,
      default: true
    },
    driverRadius: {
      type: Number, // in kilometers
      default: 10
    },
    orderTimeout: {
      type: Number, // in minutes
      default: 30
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
systemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);