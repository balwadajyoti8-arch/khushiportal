const Company = require('../models/Company');
const QuestionReference = require('../models/QuestionReference');
const MCQ = require('../models/MCQ');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().select('name logo description tags');
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company details & question statistics
// @route   GET /api/companies/:name
// @access  Private
exports.getCompanyDetails = async (req, res, next) => {
  try {
    const companyName = req.params.name;
    const company = await Company.findOne({ name: { $regex: new RegExp(`^${companyName}$`, 'i') } });

    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    // Dynamic stats aggregation from QuestionReferences
    const totalQuestions = await QuestionReference.countDocuments({ companies: company.name, status: 'Active' });
    const easyQuestions = await QuestionReference.countDocuments({ companies: company.name, difficulty: 'Easy', status: 'Active' });
    const mediumQuestions = await QuestionReference.countDocuments({ companies: company.name, difficulty: 'Medium', status: 'Active' });
    const hardQuestions = await QuestionReference.countDocuments({ companies: company.name, difficulty: 'Hard', status: 'Active' });

    // Dynamic MCQ count
    const totalMCQs = await MCQ.countDocuments({ companies: company.name });

    res.status(200).json({
      success: true,
      data: {
        ...company.toObject(),
        stats: {
          totalQuestions,
          easyQuestions,
          mediumQuestions,
          hardQuestions,
          totalMCQs,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add interview experience to a company
// @route   POST /api/companies/:name/experiences
// @access  Private
exports.addInterviewExperience = async (req, res, next) => {
  try {
    const companyName = req.params.name;
    const { title, role, year, content, status } = req.body;

    const company = await Company.findOne({ name: { $regex: new RegExp(`^${companyName}$`, 'i') } });
    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    const newExperience = {
      title,
      author: req.user.name,
      role,
      year,
      content,
      status,
      createdAt: new Date(),
    };

    company.interviewExperiences.unshift(newExperience);
    await company.save();

    res.status(201).json({
      success: true,
      data: company.interviewExperiences[0],
    });
  } catch (error) {
    next(error);
  }
};
