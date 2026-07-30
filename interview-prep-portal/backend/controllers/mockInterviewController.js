const MockInterview = require('../models/MockInterview');
const ActivityLog = require('../models/ActivityLog');
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const sendEmail = require('../config/email');
const { mentorInterviewRequestTemplate } = require('../utils/emailTemplates');

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
    const { date, time, type, mentorId, studentNotes } = req.body;

    if (!date || !time || !type) {
      res.status(400);
      throw new Error('Please provide date, time, and interview type');
    }

    // Find available mentors based on interview type and availability
    let selectedMentor = null;
    
    if (mentorId) {
      // If specific mentor is selected
      selectedMentor = await Mentor.findById(mentorId);
    } else {
      // Auto-select available mentor based on expertise
      selectedMentor = await Mentor.findOne({
        expertise: { $in: [type, 'All'] },
        isActive: true,
      }).sort({ rating: -1, totalInterviews: 1 });
    }

    if (!selectedMentor) {
      // Self-healing: if no mentors exist in DB, auto-create a default coordinator
      const mentorCount = await Mentor.countDocuments();
      if (mentorCount === 0) {
        console.log('No mentors found. Auto-creating default mock coordinator...');
        selectedMentor = await Mentor.create({
          name: 'System Mock Coordinator',
          email: 'coordinator@interviewportal.com',
          company: 'PrepPortal Group',
          designation: 'Technical Evaluator',
          expertise: ['Technical', 'HR', 'Behavioral', 'System Design', 'All'],
          experience: 5,
          isActive: true,
        });
      } else {
        res.status(404);
        throw new Error('No active mentor found matching this interview type');
      }
    }

    const interview = await MockInterview.create({
      userId: req.user.id,
      mentorId: selectedMentor._id,
      date,
      time,
      type,
      studentNotes: studentNotes || '',
    });

    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'Scheduled Interview',
      details: `Scheduled ${type} Interview on ${date} at ${time}`,
    });

    // Send email to mentor
    const user = await User.findById(req.user.id);
    const emailHtml = mentorInterviewRequestTemplate(
      user.name,
      user.email,
      date,
      time,
      type,
      studentNotes
    );

    await sendEmail({
      to: selectedMentor.email,
      subject: '🎓 New Mock Interview Request',
      html: emailHtml,
    });

    res.status(201).json({
      success: true,
      data: interview,
      message: 'Interview scheduled and notification sent to mentor',
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
