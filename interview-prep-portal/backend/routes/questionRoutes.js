const express = require('express');
const router = express.Router();
const { getQuestions, updateQuestionProgress } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getQuestions);
router.post('/:id/progress', updateQuestionProgress);

module.exports = router;
