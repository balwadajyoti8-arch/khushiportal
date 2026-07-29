const QuestionReference = require('../models/QuestionReference');
const UserQuestionProgress = require('../models/UserQuestionProgress');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// @desc    Get all question references with filters & user progress
// @route   GET /api/questions
// @access  Private (or Public, but Private preferred to merge user progress)
exports.getQuestions = async (req, res, next) => {
  try {
    const {
      search,
      company,
      topic,
      difficulty,
      platform,
      status, // Not Started, In Progress, Solved
      bookmarked,
      favorite,
      revision,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Apply Active Status Filter by default for students
    if (req.user && req.user.role !== 'admin') {
      query.status = 'Active';
    }

    // Filters
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (company) {
      query.companies = { $in: [company] };
    }
    if (topic) {
      query.topic = topic;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (platform) {
      query.platform = platform;
    }

    // Execute paginated question retrieval
    const skip = (page - 1) * limit;
    
    // Sort
    let sortQuery = { createdAt: -1 };
    if (sort === 'title_asc') sortQuery = { title: 1 };
    if (sort === 'title_desc') sortQuery = { title: -1 };
    if (sort === 'difficulty_asc') {
      // Custom mapping: Easy, Medium, Hard (we'll fetch all and sort in memory if needed, or query sorting)
      sortQuery = { difficulty: 1 }; // alphabetical: Easy, Hard, Medium - close enough or custom in memory
    }

    // If filtering by user progress fields (status, bookmarked, favorite, revision),
    // we need to find matching questionIds from UserQuestionProgress first.
    let progressFilterQuestionIds = null;
    
    if (status || bookmarked === 'true' || favorite === 'true' || revision === 'true') {
      const progressQuery = { userId: req.user.id };
      
      if (status) {
        progressQuery.status = status;
      }
      if (bookmarked === 'true') {
        progressQuery.isBookmarked = true;
      }
      if (favorite === 'true') {
        progressQuery.isFavorite = true;
      }
      if (revision === 'true') {
        progressQuery.revisionRequired = true;
      }

      const progressRecords = await UserQuestionProgress.find(progressQuery).select('questionId');
      progressFilterQuestionIds = progressRecords.map((r) => r.questionId);

      // If we filtered but found no progress matching, the result should be empty.
      query._id = { $in: progressFilterQuestionIds };
    }

    const total = await QuestionReference.countDocuments(query);
    const questions = await QuestionReference.find(query)
      .populate('topic', 'name color icon')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    // Merge User Progress
    const questionIds = questions.map((q) => q._id);
    const progressList = await UserQuestionProgress.find({
      userId: req.user.id,
      questionId: { $in: questionIds },
    });

    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.questionId.toString()] = p;
    });

    const questionsWithProgress = questions.map((q) => {
      const prog = progressMap[q._id.toString()] || {
        status: 'Not Started',
        isBookmarked: false,
        isFavorite: false,
        revisionRequired: false,
      };
      return {
        ...q.toObject(),
        userProgress: {
          status: prog.status,
          isBookmarked: prog.isBookmarked,
          isFavorite: prog.isFavorite,
          revisionRequired: prog.revisionRequired,
        },
      };
    });

    res.status(200).json({
      success: true,
      count: questionsWithProgress.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: questionsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update single question user progress
// @route   POST /api/questions/:id/progress
// @access  Private
exports.updateQuestionProgress = async (req, res, next) => {
  try {
    const questionId = req.params.id;
    const { status, isBookmarked, isFavorite, revisionRequired } = req.body;

    const question = await QuestionReference.findById(questionId);
    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    let progress = await UserQuestionProgress.findOne({
      userId: req.user.id,
      questionId,
    });

    const prevStatus = progress ? progress.status : 'Not Started';

    if (!progress) {
      progress = new UserQuestionProgress({
        userId: req.user.id,
        questionId,
      });
    }

    if (status !== undefined) {
      progress.status = status;
      if (status === 'Solved') {
        progress.solvedAt = new Date();
      }
    }
    if (isBookmarked !== undefined) progress.isBookmarked = isBookmarked;
    if (isFavorite !== undefined) progress.isFavorite = isFavorite;
    if (revisionRequired !== undefined) progress.revisionRequired = revisionRequired;

    await progress.save();

    // Create Activity Log & Manage Streak if status changed to 'Solved'
    if (status === 'Solved' && prevStatus !== 'Solved') {
      await ActivityLog.create({
        userId: req.user.id,
        actionType: 'Solved Question',
        details: `Solved: "${question.title}" (${question.difficulty})`,
      });

      // Update Streak
      const user = await User.findById(req.user.id);
      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastSolved = user.streak.lastSolvedDate 
          ? new Date(user.streak.lastSolvedDate) 
          : null;

        if (lastSolved) {
          lastSolved.setHours(0, 0, 0, 0);
          const diffTime = Math.abs(today - lastSolved);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Solved yesterday, increment streak
            user.streak.current += 1;
            if (user.streak.current > user.streak.longest) {
              user.streak.longest = user.streak.current;
            }
          } else if (diffDays > 1) {
            // Streak broken, reset
            user.streak.current = 1;
          }
          // If diffDays === 0, user already solved a question today, keep streak same
        } else {
          // First time solving
          user.streak.current = 1;
          user.streak.longest = 1;
        }

        user.streak.lastSolvedDate = new Date();
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
