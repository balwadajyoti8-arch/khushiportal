const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: [true, 'Note content cannot be empty'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
