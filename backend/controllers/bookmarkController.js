const Bookmark = require('../models/Bookmark');
const UserQuestionProgress = require('../models/UserQuestionProgress');
const QuestionReference = require('../models/QuestionReference');
const MCQ = require('../models/MCQ');
const Company = require('../models/Company');

// @desc    Get all user bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id })
      .populate('questionId', 'title topic difficulty platform externalUrl')
      .populate('mcqId', 'question options correctOption topic explanation difficulty')
      .populate('companyId', 'name logo description');

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark for an item
// @route   POST /api/bookmarks/toggle
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { itemType, itemId, companyId, experienceId } = req.body; // itemType: 'Question', 'MCQ', 'Experience'

    if (!itemType || !itemId) {
      res.status(400);
      throw new Error('Please provide itemType and itemId');
    }

    let query = { userId: req.user.id, itemType };
    let bookmarkData = { userId: req.user.id, itemType };

    if (itemType === 'Question') {
      query.questionId = itemId;
      bookmarkData.questionId = itemId;
    } else if (itemType === 'MCQ') {
      query.mcqId = itemId;
      bookmarkData.mcqId = itemId;
    } else if (itemType === 'Experience') {
      if (!companyId) {
        res.status(400);
        throw new Error('Company ID is required for bookmarking experiences');
      }
      query.experienceId = itemId;
      bookmarkData.experienceId = itemId;
      bookmarkData.companyId = companyId;
    } else {
      res.status(400);
      throw new Error('Invalid item type');
    }

    const existingBookmark = await Bookmark.findOne(query);

    if (existingBookmark) {
      // Remove bookmark
      await existingBookmark.deleteOne();

      // Synchronize with UserQuestionProgress if it's a question
      if (itemType === 'Question') {
        await UserQuestionProgress.findOneAndUpdate(
          { userId: req.user.id, questionId: itemId },
          { isBookmarked: false },
          { upsert: true }
        );
      }

      res.status(200).json({
        success: true,
        bookmarked: false,
        message: 'Bookmark removed',
      });
    } else {
      // Create bookmark
      const bookmark = await Bookmark.create(bookmarkData);

      // Synchronize with UserQuestionProgress if it's a question
      if (itemType === 'Question') {
        await UserQuestionProgress.findOneAndUpdate(
          { userId: req.user.id, questionId: itemId },
          { isBookmarked: true },
          { upsert: true }
        );
      }

      res.status(201).json({
        success: true,
        bookmarked: true,
        data: bookmark,
        message: 'Bookmark added',
      });
    }
  } catch (error) {
    next(error);
  }
};
