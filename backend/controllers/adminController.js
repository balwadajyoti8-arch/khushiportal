const QuestionReference = require('../models/QuestionReference');
const Company = require('../models/Company');
const MCQ = require('../models/MCQ');
const User = require('../models/User');
const MockInterview = require('../models/MockInterview');
const ActivityLog = require('../models/ActivityLog');

// ==========================================
// ADMIN DASHBOARD & ANALYTICS
// ==========================================

exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await QuestionReference.countDocuments();
    const activeQuestions = await QuestionReference.countDocuments({ status: 'Active' });
    const totalMCQs = await MCQ.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalInterviews = await MockInterview.countDocuments();

    // Recent activity log
    const recentActivities = await ActivityLog.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalQuestions,
        activeQuestions,
        totalMCQs,
        totalCompanies,
        totalInterviews,
      },
      recentActivities,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// USER MANAGEMENT
// ==========================================

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.role = role || user.role;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// QUESTION MANAGEMENT (CRUD & BULK)
// ==========================================

exports.createQuestion = async (req, res, next) => {
  try {
    const question = await QuestionReference.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await QuestionReference.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await QuestionReference.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    await question.deleteOne();
    res.status(200).json({ success: true, message: 'Question deleted' });
  } catch (error) {
    next(error);
  }
};

exports.bulkImportQuestions = async (req, res, next) => {
  try {
    const { questions } = req.body; // Array of question objects

    if (!questions || !Array.isArray(questions)) {
      res.status(400);
      throw new Error('Invalid format. Request body must contain a questions array.');
    }

    const inserted = await QuestionReference.insertMany(questions);
    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} questions`,
      count: inserted.length,
    });
  } catch (error) {
    next(error);
  }
};

exports.exportQuestions = async (req, res, next) => {
  try {
    const questions = await QuestionReference.find();
    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// COMPANY MANAGEMENT (CRUD)
// ==========================================

exports.createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    await company.deleteOne();
    res.status(200).json({ success: true, message: 'Company deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MCQ MANAGEMENT (CRUD)
// ==========================================

exports.createMCQ = async (req, res, next) => {
  try {
    const mcq = await MCQ.create(req.body);
    res.status(201).json({ success: true, data: mcq });
  } catch (error) {
    next(error);
  }
};

exports.updateMCQ = async (req, res, next) => {
  try {
    const mcq = await MCQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mcq) {
      res.status(404);
      throw new Error('MCQ not found');
    }

    res.status(200).json({ success: true, data: mcq });
  } catch (error) {
    next(error);
  }
};

exports.deleteMCQ = async (req, res, next) => {
  try {
    const mcq = await MCQ.findById(req.params.id);

    if (!mcq) {
      res.status(404);
      throw new Error('MCQ not found');
    }

    await mcq.deleteOne();
    res.status(200).json({ success: true, message: 'MCQ deleted' });
  } catch (error) {
    next(error);
  }
};
