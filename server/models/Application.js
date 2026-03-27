const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    jobLink: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    interviewRounds: [
      {
        roundType: {
          type: String,
          default: 'Technical',
        },
        date: {
          type: Date,
          required: true,
        },
        notes: {
          type: String,
          default: '',
        },
        emailNotified: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
