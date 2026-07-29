const express = require('express');
const router = express.Router();
const { getMCQs, submitMCQTest } = require('../controllers/mcqController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMCQs);
router.post('/submit', submitMCQTest);

module.exports = router;
