const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add mentor name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add mentor email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please add company name'],
    },
    designation: {
      type: String,
      required: [true, 'Please add designation'],
    },
    expertise: {
      type: [String],
      required: [true, 'Please add areas of expertise'],
      enum: ['Technical', 'HR', 'Behavioral', 'System Design', 'All'],
    },
    experience: {
      type: Number,
      required: [true, 'Please add years of experience'],
    },
    availability: {
      type: [{
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        timeSlots: [{
          start: String, // HH:MM format
          end: String,   // HH:MM format
        }]
      }],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalInterviews: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
mentorSchema.index({ name: 'text', company: 'text', expertise: 'text' });

module.exports = mongoose.model('Mentor', mentorSchema);
