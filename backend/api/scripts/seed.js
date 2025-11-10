const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars from the root directory
dotenv.config({ path: path.join(__dirname, '../..', '.env') });

const services = [
  {
    name: "Wash",
    description: "Professional washing",
    pricePerKg: 800,
    icon: "shirt",
    available: true,
    estimatedTime: 24
  },
  {
    name: "Dry",
    description: "Quick drying", 
    pricePerKg: 400,
    icon: "sunny",
    available: true,
    estimatedTime: 12
  },
  {
    name: "Iron",
    description: "Professional ironing",
    pricePerKg: 600,
    icon: "flame", 
    available: true,
    estimatedTime: 6
  },
  {
    name: "Fold",
    description: "Neat folding",
    pricePerKg: 200,
    icon: "layers",
    available: true, 
    estimatedTime: 2
  },
  {
    name: "Wash & Fold",
    description: "Complete wash and fold service",
    pricePerKg: 2500,
    icon: "shirt",
    available: true,
    estimatedTime: 24
  },
  {
    name: "Dry Cleaning",
    description: "Professional dry cleaning",
    pricePerKg: 5000, 
    icon: "sparkles",
    available: true,
    estimatedTime: 48
  }
];

const seedServices = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://brianmtonga592:TXrlxC13moNMMIOh@lostandfound1.f6vrf.mongodb.net/laundry_service?retryWrites=true&w=majority&appName=lostandfound1";
    
    console.log('Connecting to MongoDB...');
    console.log('MongoURI:', mongoUri ? 'Found' : 'Not found');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB');

    // Check if Service model exists, if not create it
    let Service;
    try {
      Service = mongoose.model('Service');
    } catch (error) {
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
          type: Number,
          required: true
        }
      }, {
        timestamps: true
      });
      
      Service = mongoose.model('Service', serviceSchema);
    }

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new services
    const createdServices = await Service.insertMany(services);
    console.log('✅ Created ' + createdServices.length + ' services');

    // Display created services with their IDs
    console.log('\n📦 Services created:');
    createdServices.forEach(service => {
      console.log('   - ' + service.name + ' (ID: ' + service._id + ') - MWK ' + service.pricePerKg + '/kg');
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error.message);
    process.exit(1);
  }
};

seedServices();