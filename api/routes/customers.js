const express = require('express');
const Customer = require('../models/Customer'); // Import Customer model
const { authenticate } = require('../middlewares/authentication'); // Import authenticate middleware
const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next(); // Allow admin user to proceed
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};

// Create a new customer (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    const { name, email, phone } = req.body;
    
    try {
        const newCustomer = new Customer({ name, email, phone, user: req.user._id });
        await newCustomer.save();
        res.status(201).json(newCustomer); // Respond with the created customer
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all customers for the admin (based on user's role)
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const customers = await Customer.find({ user: req.user._id }); // Fetch customers for the logged-in admin
        res.json(customers); // Respond with the list of customers
    } catch (error) {
        console.error('Error retrieving customers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a customer by ID (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params; // Get customer ID from URL
    const { name, email, phone } = req.body;

    try {
        const customer = await Customer.findByIdAndUpdate(
            id,
            { name, email, phone },
            { new: true } // Return the updated document
        );
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        
        res.json(customer); // Respond with the updated customer
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a customer by ID (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params; // Get customer ID from URL

    try {
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        res.json({ message: 'Customer deleted successfully.' }); // Success message on deletion
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
