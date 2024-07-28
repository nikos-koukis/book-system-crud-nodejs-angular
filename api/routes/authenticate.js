const express = require('express');
const { authenticate } = require('../middlewares/authentication'); // Import your authentication middleware
const router = express.Router();

// /authenticate POST endpoint to check authentication
router.post('/', authenticate, (req, res) => {
    // If the authentication middleware allows access, we can return user info or a success message
    res.json({
        message: 'Authenticated successfully',
        user: {
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
        },
    });
});

module.exports = router;
