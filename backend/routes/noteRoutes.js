const express = require('express');
const router = express.Router();
const {
  getNote,
  getAllNotes,
  createOrUpdateNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllNotes);
router.get('/question/:questionId', getNote);
router.post('/question/:questionId', createOrUpdateNote);
router.delete('/:id', deleteNote);

module.exports = router;
