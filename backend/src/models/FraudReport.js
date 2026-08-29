const mongoose = require('mongoose');

const fraudReportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobListing',
    },
    reportType: {
      type: String,
      enum: [
        'asked_for_money',
        'fake_company',
        'identity_impersonation',
        'scam_interview',
        'misleading_job',
        'other',
      ],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe what happened'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [2000, 'Description max 2000 characters'],
    },
    evidenceUrls: [{ type: String }], // Cloudinary URLs
    isAnonymous: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'verified', 'dismissed'],
      default: 'pending',
    },
    adminNotes: { type: String, select: false }, // only admins see this
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      select: false,
    },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

fraudReportSchema.index({ employerId: 1, status: 1 });
fraudReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FraudReport', fraudReportSchema);
