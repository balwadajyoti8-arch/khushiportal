const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyDetails,
  addInterviewExperience,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCompanies);
router.get('/:name', getCompanyDetails);
router.post('/:name/experiences', addInterviewExperience);

module.exports = router;
