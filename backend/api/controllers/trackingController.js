const Tracking = require('../models/tracking');
const Order = require('../models/order');

const getTracking = async (req, res) => {
  try {
    const tracking = await Tracking.findOne({ orderId: req.params.orderId })
      .populate('orderId');
    
    if (!tracking) {
      return res.status(404).json({ message: 'Tracking not found' });
    }

    // Verify the order belongs to the user
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      userId: req.userId 
    });

    if (!order) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTracking = async (req, res) => {
  try {
    const { step, status, completed } = req.body;
    
    const tracking = await Tracking.findOne({ orderId: req.params.orderId });
    
    if (!tracking) {
      return res.status(404).json({ message: 'Tracking not found' });
    }

    // Update the specific step in timeline
    const stepIndex = tracking.timeline.findIndex(item => item.step === step);
    if (stepIndex !== -1) {
      tracking.timeline[stepIndex].status = status;
      tracking.timeline[stepIndex].completed = completed;
      tracking.timeline[stepIndex].time = new Date();
      
      if (completed) {
        tracking.currentStep = step;
      }
    }

    await tracking.save();
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTracking, updateTracking };