const mongoose = require('mongoose');

const questionReferenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a question title'],
      trim: true,
    },
    companies: {
      type: [String],
      required: [true, 'Please add target companies'],
      default: [],
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Please add a topic'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please specify difficulty'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    platform: {
      type: String,
      required: [true, 'Please specify platform'],
      enum: ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeStudio', 'InterviewBit', 'CodeChef'],
    },
    externalUrl: {
      type: String,
      required: [true, 'Please add the external question URL'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    frequentlyAsked: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No',
    },
    premiumBadge: {
      type: String,
      enum: ['Premium', 'Free'],
      default: 'Free',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search performance
questionReferenceSchema.index({ title: 'text', companies: 'text' });
questionReferenceSchema.index({ topic: 1 });

module.exports = mongoose.model('QuestionReference', questionReferenceSchema);
