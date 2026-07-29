const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a company name'],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    tags: {
      type: [String],
      default: [],
    },
    preparationTips: {
      type: [String],
      default: [],
    },
    interviewExperiences: [
      {
        title: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
        year: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ['Offered', 'Rejected'],
          default: 'Offered',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
