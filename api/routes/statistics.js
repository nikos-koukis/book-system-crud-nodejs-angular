const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { authenticate } = require('../middlewares/authentication');
const mongoose = require('mongoose');


router.get('/', authenticate, async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ isCustomer: true });

    const totalBooks = await Book.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrdersCount = await Order.countDocuments({ status: 'Pending' });

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

router.get('/orders/count/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orderCount = await Order.countDocuments({ 'user.id': userId});

    res.json({ orderCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/total_price/:userId', authenticate, async (req, res) => {
  try {
      const userId = req.params.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID format.' });
      }

      const totalPrice = await Order.aggregate([
          { $match: { 'user.id': new mongoose.Types.ObjectId(userId) } },
          { $unwind: "$books" },
          {
              $lookup: {
                  from: 'books',
                  localField: 'books.id',
                  foreignField: '_id',
                  as: 'bookDetails'
              }
          },
          { $unwind: "$bookDetails" },
          {
              $group: {
                  _id: null,
                  totalPrice: { $sum: { $multiply: ["$books.quantity", "$bookDetails.price"] } }
              }
          }
      ]);

      res.json({ totalPrice: totalPrice.length > 0 ? totalPrice[0].totalPrice : 0 });
  } catch (error) {
      console.error('Error occurred while calculating total price:', error); // Log the error
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
