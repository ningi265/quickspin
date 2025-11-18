const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number']
  },
  vehicle: {
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      trim: true,
      uppercase: true,
      unique: true
    },
    color: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      min: [1990, 'Vehicle year must be after 1990'],
      max: [new Date().getFullYear() + 1, 'Vehicle year cannot be in the future']
    }
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'offline', 'on-delivery'],
      message: 'Status must be active, offline, or on-delivery'
    },
    default: 'offline'
  },
  currentLocation: {
    address: {
      type: String,
      default: 'Not available'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  deliveries: {
    type: Number,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
driverSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get driver stats
driverSchema.statics.getStats = async function() {
  const totalDrivers = await this.countDocuments({ isActive: true });
  const activeDrivers = await this.countDocuments({ 
    isActive: true, 
    status: { $in: ['active', 'on-delivery'] } 
  });
  
  const totalDeliveriesResult = await this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: '$deliveries' } } }
  ]);
  
  return {
    totalDrivers,
    activeDrivers,
    totalDeliveries: totalDeliveriesResult[0]?.total || 0
  };
};

// Instance method to get formatted driver data
driverSchema.methods.toJSON = function() {
  const driver = this.toObject();
  delete driver.__v;
  return {
    id: driver._id,
    name: driver.name,
    email: driver.email,
    phone: driver.phone,
    vehicle: `${driver.vehicle.model} - ${driver.vehicle.licensePlate}`,
    status: driver.status,
    currentLocation: driver.currentLocation.address,
    rating: driver.rating,
    deliveries: driver.deliveries,
    vehicleDetails: driver.vehicle,
    isActive: driver.isActive,
    createdAt: driver.createdAt,
    updatedAt: driver.updatedAt
  };
};

module.exports = mongoose.model('Driver', driverSchema);