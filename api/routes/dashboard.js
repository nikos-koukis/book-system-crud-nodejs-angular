const express = require('express');
const { dashboard } = require('../controllers/dashboard');
const { authenticate } = require('../middlewares/authentication');
const { authorize } = require('../middlewares/authorization');

const router = express.Router();

// Dashboard route - requires JWT token and checks user role
router.get('/', authenticate, authorize('user', 'admin'), dashboard);

module.exports = router;