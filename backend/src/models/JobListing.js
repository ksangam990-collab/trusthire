const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Title too long'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [5000, 'Description too long'],
    },
    responsibilities: { type: String, maxlength: 3000 },
    requirements: { type: String, maxlength: 3000 },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      isRemote: { type: Boolean, default: false },
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'INR' },
      isDisclosed: { type: Boolean, default: true },
    },
    jobType: {
      type: String,
      enum: ['fulltime', 'parttime', 'internship', 'contract', 'freelance'],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['fresher', '1-2', '2-5', '5-10', '10+'],
      default: 'fresher',
    },
    skills: [{ type: String, trim: true }],
    education: { type: String, trim: true }, // e.g. "B.Tech / B.E."
    openings: { type: Number, default: 1, min: 1 },
    applyMethod: {
      type: String,
      enum: ['platform', 'email', 'external'],
      default: 'platform',
    },
    applyEmail: { type: String },
    applyLink: { type: String },
    status: {
      type: String,
      enum: ['active', 'closed', 'suspended', 'draft'],
      default: 'active',
    },
    isFromVerifiedEmployer: { type: Boolean, default: false },
    applicationCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
    closesAt: { type: Date },
    // Fraud flags
    fraudReportCount: { type: Number, default: 0 },
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for full-text search
jobListingSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobListingSchema.index({ 'location.city': 1, status: 1 });
jobListingSchema.index({ jobType: 1, status: 1 });
jobListingSchema.index({ isFromVerifiedEmployer: 1, status: 1 });
jobListingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('JobListing', jobListingSchema);
