const validateOrder = (req, res, next) => {
  const { services, pickupDate, pickupTimeSlot, location } = req.body;

  if (!services || services.length === 0) {
    return res.status(400).json({ message: 'At least one service is required' });
  }

  if (!pickupDate || !pickupTimeSlot) {
    return res.status(400).json({ message: 'Pickup date and time are required' });
  }

  if (!location || !location.address) {
    return res.status(400).json({ message: 'Location address is required' });
  }

  next();
};

module.exports = { validateOrder };