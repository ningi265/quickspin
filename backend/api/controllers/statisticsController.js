const Order = require('../models/order');
const Driver = require('../models/drivers');

const getQuickStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingPickups = await Order.countDocuments({ status: 'pending' });
    const activeDrivers = await Driver.countDocuments({ status: 'active' });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const revenueToday = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lte: endOfToday
          },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    const quickStats = [
      { label: 'Total Orders', value: totalOrders.toString(), icon: 'cart' },
      { label: 'Pending Pickups', value: pendingPickups.toString(), icon: 'time' },
      { label: 'Active Drivers', value: activeDrivers.toString(), icon: 'car' },
      { label: 'Revenue Today', value: `$${revenueToday.length > 0 ? revenueToday[0].total.toFixed(2) : '0.00'}`, icon: 'cash' }
    ];

    res.json(quickStats);
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getQuickStats,
};
