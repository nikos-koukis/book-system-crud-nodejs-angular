const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User'); // Import the User model
const Book = require('../models/Book'); // Import the Book model
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();


const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next(); // Allow admin user to proceed
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};

router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('user.id').populate('books.id');

        // Respond with the list of orders
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving orders', details: error.message });
    }
});

router.post('/', authenticate, async (req, res) => {
    const { userId, books } = req.body; // books should include { bookId, quantity }

    try {
        // Check if user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Gather the book IDs and quantities
        const bookIds = books.map(book => book.bookId);
        const bookQuantities = books.map(book => book.quantity);

        // Check if all books exist and collect stock information
        const booksInDb = await Book.find({ _id: { $in: bookIds } });

        // Check for missing books
        const missingBooks = bookIds.filter(id => !booksInDb.find(book => book._id.equals(id)));
        if (missingBooks.length > 0) {
            return res.status(404).json({ error: 'Some books not found', missingBooks });
        }

        // Check stock for each book
        const insufficientStockBooks = [];
        for (let i = 0; i < booksInDb.length; i++) {
            const book = booksInDb[i];
            const requestedQuantity = bookQuantities[i];

            if (book.stock < requestedQuantity) {
                insufficientStockBooks.push({
                    id: book._id,
                    title: book.title,
                    availableStock: book.stock,
                    requestedQuantity: requestedQuantity
                });
            }
        }

        // If any book has insufficient stock
        if (insufficientStockBooks.length > 0) {
            return res.status(400).json({ 
                error: 'Insufficient stock for some books',
                insufficientStockBooks 
            });
        }

        // Create the order if user and stock checks pass
        const order = new Order({
            user: { id: userId },
            books: books.map(book => ({
                id: book.bookId,
                quantity: book.quantity
            })),
            status: 'Pending'
        });

        await order.save();

        // Optionally update the stock for each book (if needed)
        await Promise.all(books.map(async (book) => {
            await Book.findByIdAndUpdate(book.bookId, {
                $inc: { stock: -book.quantity } // Decrease the stock by the ordered quantity
            });
        }));

        // Create a response object
        const responseOrder = {
            user: {
                id: order.user.id
            },
            books: order.books.map(book => ({
                id: book.id,
                quantity: book.quantity
            })),
            status: order.status,
            _id: order._id,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };

        res.status(201).json({ message: 'Order created successfully', order: responseOrder });
    } catch (error) {
        res.status(500).json({ error: 'Error creating order', details: error.message });
    }
});


router.put('/:orderId/status', authenticate, isAdmin, async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body; // Expect a JSON body with { "status": "Completed" or "Cancelled" }

    try {
        // Fetch the order
        const order = await Order.findById(orderId);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // If the status is 'Pending', allow update to Completed or Cancelled
        if (order.status === 'Pending') {
            if (status === 'Cancelled') {
                // If the status is 'Cancelled', update stock
                for (const book of order.books) {
                    await Book.findByIdAndUpdate(book.id, {
                        $inc: { stock: book.quantity } // Increment the stock by the quantity ordered
                    });
                }
            } else if (status === 'Completed') {
                // Update to 'Completed' without any additional actions
            } else {
                // If the status is neither 'Completed' nor 'Cancelled', return an error
                return res.status(400).json({ error: 'Invalid status' });
            }
        } else if (order.status === 'Cancelled' || order.status === 'Completed') {
            // If already in 'Cancelled' or 'Completed', disallow updates
            return res.status(400).json({ error: `Order status cannot be updated once set to '${order.status}'.` });
        } else {
            // If the status is anything else that is unexpected
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Update the order status
        order.status = status;
        await order.save();

        // Respond with the updated order
        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ error: 'Error updating order status', details: error.message });
    }
});

router.get('/:orderId', authenticate, async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId)
            .populate('user.id')
            .populate('books.id');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving order', details: error.message });
    }
});

router.delete('/:orderId', authenticate, isAdmin, async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update stock for each book in the order
        for (const book of order.books) {
            await Book.findByIdAndUpdate(book.id, {
                $inc: { stock: book.quantity }
            });
        }

        await Order.findByIdAndDelete(orderId);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order', details: error.message });
    }
});

router.get('/orders/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all orders associated with the specified userId
        const orders = await Order.find({ 'user.id': userId })
            .populate('user.id')
            .populate('books.id');

        // Check if any orders are found
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        // Respond with the list of orders
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving orders', details: error.message });
    }
});

module.exports = router;
