const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Question', 'MCQ', 'Experience'],
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionReference',
    },
    mcqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MCQ',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    experienceId: {
      type: String, // ID of the embedded experience inside Company
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
