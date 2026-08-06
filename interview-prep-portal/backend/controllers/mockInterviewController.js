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
    console.log('Schedule interview request received:', req.body);
    
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      console.log('User not authenticated');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { date, time, type, mentorId, studentNotes } = req.body;

    if (!date || !time || !type) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide date, time, and interview type'
      });
    }

    // Find available mentors based on interview type and availability
    let selectedMentor = null;
    
    if (mentorId) {
      // If specific mentor is selected
      console.log('Looking for specific mentor:', mentorId);
      selectedMentor = await Mentor.findById(mentorId);
    } else {
      // Auto-select available mentor based on expertise
      console.log('Auto-selecting mentor for type:', type);
      selectedMentor = await Mentor.findOne({
        expertise: { $in: [type, 'All'] },
        isActive: true,
      }).sort({ rating: -1, totalInterviews: 1 });
    }

    console.log('Selected mentor:', selectedMentor ? selectedMentor.name : 'None');

    if (!selectedMentor) {
      // Self-healing: if no mentors exist in DB, auto-create a default coordinator
      const mentorCount = await Mentor.countDocuments();
      console.log('No mentor found. Total mentors in DB:', mentorCount);
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
        console.log('Mentors exist but none match criteria');
        return res.status(404).json({
          success: false,
          message: 'No active mentor found matching this interview type'
        });
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

    console.log('Interview created successfully:', interview._id);

    // Create activity log (non-critical, don't fail if this errors)
    try {
      await ActivityLog.create({
        userId: req.user.id,
        actionType: 'Scheduled Interview',
        details: `Scheduled ${type} Interview on ${date} at ${time}`,
      });
    } catch (logError) {
      console.error('Failed to create activity log:', logError.message);
    }

    // Send email to mentor (non-critical, fire and forget)
    // Don't await to prevent blocking the response
    setImmediate(async () => {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          console.log('Preparing email to mentor:', selectedMentor.email);
          console.log('From user:', user.name, user.email);
          const emailHtml = mentorInterviewRequestTemplate(
            user.name,
            user.email,
            date,
            time,
            type,
            studentNotes
          );

          const emailResult = await sendEmail({
            to: selectedMentor.email,
            subject: '🎓 New Mock Interview Request',
            html: emailHtml,
          });

          if (emailResult.success) {
            console.log('Email sent successfully to mentor:', selectedMentor.email);
          } else {
            console.error('Email sending failed:', emailResult.error);
          }
        } else {
          console.error('User not found for email sending');
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError.message);
      }
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.user.id });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    interview.status = 'Cancelled';
    await interview.save();

    // Create activity log (non-critical)
    try {
      await ActivityLog.create({
        userId: req.user.id,
        actionType: 'Cancelled Interview',
        details: `Cancelled scheduled ${interview.type} Interview`,
      });
    } catch (logError) {
      console.error('Failed to create activity log:', logError.message);
    }

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
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { date, time } = req.body;
    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.user.id });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    interview.date = date || interview.date;
    interview.time = time || interview.time;
    interview.status = 'Scheduled'; // Reset status to Scheduled if it was cancelled
    await interview.save();

    // Create activity log (non-critical)
    try {
      await ActivityLog.create({
        userId: req.user.id,
        actionType: 'Rescheduled Interview',
        details: `Rescheduled ${interview.type} Interview to ${interview.date} at ${interview.time}`,
      });
    } catch (logError) {
      console.error('Failed to create activity log:', logError.message);
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};
