const MockInterview = require('../models/MockInterview');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get user's mock interviews
// @route   GET /api/interviews
// @access  Private
exports.getMockInterviews = async (req, res, next) => {
  try {
    const interviews = await MockInterview.find({ userId: req.user.id }).sort({ date: 1, time: 1 });
    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule a new mock interview
// @route   POST /api/interviews
// @access  Private
exports.scheduleMockInterview = async (req, res, next) => {
  try {
    const { date, time, type } = req.body;

    if (!date || !time || !type) {
      res.status(400);
      throw new Error('Please provide date, time, and interview type');
    }

    const interview = await MockInterview.create({
      userId: req.user.id,
      date,
      time,
      type,
    });

    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'Scheduled Interview',
      details: `Scheduled ${type} Interview on ${date} at ${time}`,
    });

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a mock interview
// @route   PUT /api/interviews/:id/cancel
// @access  Private
exports.cancelMockInterview = async (req, res, next) => {
  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.user.id });

    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    interview.status = 'Cancelled';
    await interview.save();

    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'Cancelled Interview',
      details: `Cancelled scheduled ${interview.type} Interview`,
    });

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule a mock interview
// @route   PUT /api/interviews/:id/reschedule
// @access  Private
exports.rescheduleMockInterview = async (req, res, next) => {
  try {
    const { date, time } = req.body;
    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.user.id });

    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    interview.date = date || interview.date;
    interview.time = time || interview.time;
    interview.status = 'Scheduled'; // Reset status to Scheduled if it was cancelled
    await interview.save();

    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'Rescheduled Interview',
      details: `Rescheduled ${interview.type} Interview to ${interview.date} at ${interview.time}`,
    });

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};
