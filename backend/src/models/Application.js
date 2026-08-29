const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobListing',
      required: true,
      index: true,
    },
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
      index: true,
    },
    resumeUrl: { type: String }, // snapshot at time of application
    coverNote: {
      type: String,
      trim: true,
      maxlength: [1000, 'Cover note max 1000 characters'],
    },
    status: {
      type: String,
      enum: ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
    },
    employerNote: { type: String, trim: true }, // internal note by employer
    appliedAt: { type: Date, default: Date.now },
    viewedAt: { type: Date },
    statusUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
