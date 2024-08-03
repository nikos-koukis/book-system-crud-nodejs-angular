const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { authenticate } = require('../middlewares/authentication');


router.get('/', authenticate, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();

    const totalBooks = await Book.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });

    res.json({
      totalCustomers,
      totalBooks,
      totalOrders,
      pendingOrders: pendingOrdersCount, // Add pending orders count to the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
