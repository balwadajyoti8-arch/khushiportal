const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please add a question text'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Please add options'],
      validate: [opts => opts.length >= 2, 'Must have at least 2 options'],
    },
    correctOption: {
      type: Number,
      required: [true, 'Please specify the index of the correct option'],
    },
    topic: {
      type: String,
      required: [true, 'Please specify a topic'],
      trim: true,
    },
    companies: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      required: [true, 'Please specify difficulty'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MCQ', mcqSchema);
