const express = require('express');
const router = express.Router();
const {
  getMockInterviews,
  scheduleMockInterview,
  cancelMockInterview,
  rescheduleMockInterview,
} = require('../controllers/mockInterviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMockInterviews);
router.post('/', scheduleMockInterview);
router.put('/:id/cancel', cancelMockInterview);
router.put('/:id/reschedule', rescheduleMockInterview);

module.exports = router;
