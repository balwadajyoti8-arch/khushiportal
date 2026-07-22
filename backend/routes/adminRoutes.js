const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkImportQuestions,
  exportQuestions,
  createCompany,
  updateCompany,
  deleteCompany,
  createMCQ,
  updateMCQ,
  deleteMCQ,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Lock down all routes to Admins only
router.use(protect);
router.use(authorize('admin'));

// Stats
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Question Management
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/questions/bulk', bulkImportQuestions);
router.get('/questions/export', exportQuestions);

// Company Management
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

// MCQ Management
router.post('/mcqs', createMCQ);
router.put('/mcqs/:id', updateMCQ);
router.delete('/mcqs/:id', deleteMCQ);

module.exports = router;
