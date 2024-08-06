const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next(); // Allow admin user to proceed
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};

// Get all customers for the admin (based on user's role)
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const customers = await User.find({ isCustomer: true });
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err.message });
    }
});


router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params; // Get the user ID from the request parameters

    try {
        // Find the user by ID
        const user = await User.findById(id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Handle user not found
        }

        // Check if the user's role is 'user'
        if (user.role !== 'user') {
            return res.status(403).json({ message: 'You can only update users with the role of "user"' }); // Handle unauthorized role
        }

        // Proceed to update the isCustomer field
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isCustomer: true }, // Set isCustomer to true
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        // Return the updated user information
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message }); // Handle errors
    }
});

module.exports = router;
