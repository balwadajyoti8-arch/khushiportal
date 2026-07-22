const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: [true, 'Please add a date'],
    },
    time: {
      type: String, // format HH:MM
      required: [true, 'Please add a time'],
    },
    type: {
      type: String,
      required: [true, 'Please select interview type'],
      enum: ['Technical', 'HR', 'Behavioral', 'System Design'],
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    feedback: {
      type: String,
      default: '',
    },
    score: {
      type: Number, // out of 10 or 100
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
