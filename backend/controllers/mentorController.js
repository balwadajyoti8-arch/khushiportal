const Mentor = require('../models/Mentor');
const MockInterview = require('../models/MockInterview');
const User = require('../models/User');
const sendEmail = require('../config/email');
const {
  mentorInterviewRequestTemplate,
  studentInterviewScheduledTemplate,
  studentInterviewRejectedTemplate,
} = require('../utils/emailTemplates');

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
exports.getMentors = async (req, res, next) => {
  try {
    const { expertise, company, search } = req.query;
    
    const query = { isActive: true };
    
    if (expertise) {
      query.expertise = { $in: [expertise] };
    }
    
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    
    const mentors = await Mentor.find(query).sort({ rating: -1, totalInterviews: -1 });
    
    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mentor
// @route   GET /api/mentors/:id
// @access  Public
exports.getMentor = async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mentor's pending interview requests
// @route   GET /api/mentors/:id/pending-requests
// @access  Private/Mentor
exports.getMentorPendingRequests = async (req, res, next) => {
  try {
    const mentorId = req.params.id;
    
    const pendingRequests = await MockInterview.find({
      mentorId,
      status: 'Pending',
    }).populate('userId', 'name email college branch');
    
    res.status(200).json({
      success: true,
      count: pendingRequests.length,
      data: pendingRequests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mentor's scheduled interviews
// @route   GET /api/mentors/:id/scheduled-interviews
// @access  Private/Mentor
exports.getMentorScheduledInterviews = async (req, res, next) => {
  try {
    const mentorId = req.params.id;
    
    const scheduledInterviews = await MockInterview.find({
      mentorId,
      status: { $in: ['Approved', 'Scheduled'] },
    }).populate('userId', 'name email college branch');
    
    res.status(200).json({
      success: true,
      count: scheduledInterviews.length,
      data: scheduledInterviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve interview request
// @route   PUT /api/mentors/interviews/:id/approve
// @access  Private/Mentor
exports.approveInterviewRequest = async (req, res, next) => {
  try {
    const interview = await MockInterview.findById(req.params.id).populate('userId').populate('mentorId');
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview request not found',
      });
    }
    
    if (interview.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Interview request is not in pending status',
      });
    }
    
    const { meetingLink } = req.body;
    
    interview.status = 'Approved';
    interview.meetingLink = meetingLink || '';
    await interview.save();
    
    // Update mentor stats
    const mentor = await Mentor.findById(interview.mentorId);
    mentor.totalInterviews += 1;
    await mentor.save();
    
    // Send email to student
    const emailHtml = studentInterviewScheduledTemplate(
      mentor.name,
      mentor.company,
      interview.date,
      interview.time,
      interview.type,
      interview.meetingLink
    );
    
    await sendEmail({
      to: interview.userId.email,
      subject: '✅ Your Mock Interview Has Been Scheduled',
      html: emailHtml,
    });
    
    res.status(200).json({
      success: true,
      data: interview,
      message: 'Interview approved and confirmation email sent to student',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject interview request
// @route   PUT /api/mentors/interviews/:id/reject
// @access  Private/Mentor
exports.rejectInterviewRequest = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const interview = await MockInterview.findById(req.params.id).populate('userId').populate('mentorId');
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview request not found',
      });
    }
    
    if (interview.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Interview request is not in pending status',
      });
    }
    
    interview.status = 'Rejected';
    interview.rejectionReason = rejectionReason || '';
    await interview.save();
    
    // Send email to student
    const emailHtml = studentInterviewRejectedTemplate(
      interview.mentorId.name,
      interview.rejectionReason
    );
    
    await sendEmail({
      to: interview.userId.email,
      subject: '❌ Your Mock Interview Request Has Been Rejected',
      html: emailHtml,
    });
    
    res.status(200).json({
      success: true,
      data: interview,
      message: 'Interview rejected and notification sent to student',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete interview and provide feedback
// @route   PUT /api/mentors/interviews/:id/complete
// @access  Private/Mentor
exports.completeInterview = async (req, res, next) => {
  try {
    const { feedback, score } = req.body;
    const interview = await MockInterview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }
    
    if (interview.status !== 'Approved' && interview.status !== 'Scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Interview is not in approved or scheduled status',
      });
    }
    
    interview.status = 'Completed';
    interview.feedback = feedback || '';
    interview.score = score || 0;
    await interview.save();
    
    res.status(200).json({
      success: true,
      data: interview,
      message: 'Interview completed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new mentor (Admin only)
// @route   POST /api/mentors
// @access  Private/Admin
exports.createMentor = async (req, res, next) => {
  try {
    const mentor = await Mentor.create(req.body);
    
    res.status(201).json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update mentor (Admin only)
// @route   PUT /api/mentors/:id
// @access  Private/Admin
exports.updateMentor = async (req, res, next) => {
  try {
    let mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }
    
    mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete mentor (Admin only)
// @route   DELETE /api/mentors/:id
// @access  Private/Admin
exports.deleteMentor = async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }
    
    // Check if mentor has pending or scheduled interviews
    const activeInterviews = await MockInterview.countDocuments({
      mentorId: req.params.id,
      status: { $in: ['Pending', 'Approved', 'Scheduled'] },
    });
    
    if (activeInterviews > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete mentor with ${activeInterviews} active interviews`,
      });
    }
    
    await mentor.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Mentor deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
