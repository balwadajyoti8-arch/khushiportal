const express = require('express');
const router = express.Router();
const { getBookmarks, toggleBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getBookmarks);
router.post('/toggle', toggleBookmark);

module.exports = router;
