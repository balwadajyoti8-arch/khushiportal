const express = require('express');
const router = express.Router();
const {
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  updateTopicCount,
} = require('../controllers/topicController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTopics);
router.get('/:id', getTopic);

// Admin only routes
router.post('/', protect, authorize('admin'), createTopic);
router.put('/:id', protect, authorize('admin'), updateTopic);
router.delete('/:id', protect, authorize('admin'), deleteTopic);
router.put('/:id/update-count', protect, authorize('admin'), updateTopicCount);

module.exports = router;
