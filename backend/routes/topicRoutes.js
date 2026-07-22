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
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTopics);
router.get('/:id', getTopic);

// Admin only routes
router.post('/', protect, admin, createTopic);
router.put('/:id', protect, admin, updateTopic);
router.delete('/:id', protect, admin, deleteTopic);
router.put('/:id/update-count', protect, admin, updateTopicCount);

module.exports = router;
