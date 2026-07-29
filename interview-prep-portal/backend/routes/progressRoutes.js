const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/analytics', protect, getAnalytics);

module.exports = router;
