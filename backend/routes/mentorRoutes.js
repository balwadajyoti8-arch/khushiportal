const express = require('express');
const router = express.Router();
const {
  getMentors,
  getMentor,
  getMentorPendingRequests,
  getMentorScheduledInterviews,
  approveInterviewRequest,
  rejectInterviewRequest,
  completeInterview,
  createMentor,
  updateMentor,
  deleteMentor,
} = require('../controllers/mentorController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getMentors);
router.get('/:id', getMentor);

// Mentor specific routes (protected)
router.get('/:id/pending-requests', protect, getMentorPendingRequests);
router.get('/:id/scheduled-interviews', protect, getMentorScheduledInterviews);
router.put('/interviews/:id/approve', protect, approveInterviewRequest);
router.put('/interviews/:id/reject', protect, rejectInterviewRequest);
router.put('/interviews/:id/complete', protect, completeInterview);

// Admin only routes
router.post('/', protect, admin, createMentor);
router.put('/:id', protect, admin, updateMentor);
router.delete('/:id', protect, admin, deleteMentor);

module.exports = router;
