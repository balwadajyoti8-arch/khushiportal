const mongoose = require('mongoose');

const userQuestionProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionReference',
      required: true,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Solved'],
      default: 'Not Started',
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    revisionRequired: {
      type: Boolean,
      default: false,
    },
    solvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for faster lookup
userQuestionProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('UserQuestionProgress', userQuestionProgressSchema);
