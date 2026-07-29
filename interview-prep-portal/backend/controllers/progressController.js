const UserQuestionProgress = require('../models/UserQuestionProgress');
const QuestionReference = require('../models/QuestionReference');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// @desc    Get complete student analytics for dashboard
// @route   GET /api/progress/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user details for streaks
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Solve statistics
    const totalQuestions = await QuestionReference.countDocuments({ status: 'Active' });
    
    // Solved vs In Progress vs Not Started
    const solvedQuestions = await UserQuestionProgress.countDocuments({ userId, status: 'Solved' });
    const inProgressQuestions = await UserQuestionProgress.countDocuments({ userId, status: 'In Progress' });
    const bookmarkedQuestions = await UserQuestionProgress.countDocuments({ userId, isBookmarked: true });
    const revisionQuestions = await UserQuestionProgress.countDocuments({ userId, revisionRequired: true });

    // Difficulty wise progress
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const difficultyStats = await Promise.all(
      difficulties.map(async (diff) => {
        const total = await QuestionReference.countDocuments({ difficulty: diff, status: 'Active' });
        
        // Find progress records for this difficulty that are solved
        const progressRecords = await UserQuestionProgress.find({ userId, status: 'Solved' }).select('questionId');
        const solvedIds = progressRecords.map((r) => r.questionId);
        
        const solved = await QuestionReference.countDocuments({
          _id: { $in: solvedIds },
          difficulty: diff,
        });

        return {
          difficulty: diff,
          total,
          solved,
          percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
        };
      })
    );

    // Topic wise progress
    const topics = [
      'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs',
      'DP', 'Greedy', 'Binary Search', 'Recursion', 'Backtracking', 'Sorting',
      'Searching', 'Hashing', 'Math', 'Bit Manipulation', 'OOP', 'DBMS', 'OS', 'CN', 'Aptitude'
    ];

    const topicStats = await Promise.all(
      topics.map(async (topic) => {
        const total = await QuestionReference.countDocuments({ topic, status: 'Active' });
        
        const progressRecords = await UserQuestionProgress.find({ userId, status: 'Solved' }).select('questionId');
        const solvedIds = progressRecords.map((r) => r.questionId);
        
        const solved = await QuestionReference.countDocuments({
          _id: { $in: solvedIds },
          topic,
        });

        return {
          topic,
          total,
          solved,
          percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
        };
      })
    );

    // Activity Log - recent 10 events
    const recentActivity = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);

    // Weekly progress (Solved questions count per day in last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      last7Days.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: new Date(d),
      });
    }

    const weeklyProgress = await Promise.all(
      last7Days.map(async (day) => {
        const nextDay = new Date(day.fullDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const count = await UserQuestionProgress.countDocuments({
          userId,
          status: 'Solved',
          solvedAt: {
            $gte: day.fullDate,
            $lt: nextDay,
          },
        });

        return {
          day: day.date,
          solved: count,
        };
      })
    );

    // Monthly progress (last 6 months)
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6Months.push({
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
      });
    }

    const monthlyProgress = await Promise.all(
      last6Months.map(async (m) => {
        const start = new Date(m.year, m.monthNum, 1);
        const end = new Date(m.year, m.monthNum + 1, 1);

        const count = await UserQuestionProgress.countDocuments({
          userId,
          status: 'Solved',
          solvedAt: {
            $gte: start,
            $lt: end,
          },
        });

        return {
          month: m.monthName,
          solved: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        streak: user.streak,
        stats: {
          totalQuestions,
          solvedQuestions,
          inProgressQuestions,
          bookmarkedQuestions,
          revisionQuestions,
          completionPercentage: totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0,
        },
        difficultyStats,
        topicStats: topicStats.filter(t => t.total > 0), // only return topics with questions
        weeklyProgress,
        monthlyProgress,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};
