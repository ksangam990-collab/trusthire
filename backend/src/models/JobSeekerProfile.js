const mongoose = require('mongoose');

const jobSeekerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: { type: String, trim: true, maxlength: 200 },
    summary: { type: String, trim: true, maxlength: 1000 },
    skills: [{ type: String, trim: true }],
    education: [
      {
        institution: { type: String, trim: true },
        degree: { type: String, trim: true },
        field: { type: String, trim: true },
        startYear: { type: Number },
        endYear: { type: Number },
        isCurrently: { type: Boolean, default: false },
      },
    ],
    experience: [
      {
        company: { type: String, trim: true },
        role: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
        isCurrently: { type: Boolean, default: false },
        description: { type: String, trim: true },
      },
    ],
    resumeUrl: { type: String },
    preferredLocations: [{ type: String, trim: true }],
    preferredRoles: [{ type: String, trim: true }],
    preferredJobType: {
      type: String,
      enum: ['fulltime', 'parttime', 'internship', 'contract', 'any'],
      default: 'any',
    },
    salaryExpectation: {
      min: { type: Number },
      max: { type: Number },
    },
    isOpenToWork: { type: Boolean, default: true },
    noticePeriod: {
      type: String,
      enum: ['immediate', '15days', '1month', '2months', '3months'],
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobListing' }],
    profileCompleteness: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Compute profile completeness before save
jobSeekerProfileSchema.pre('save', function (next) {
  let score = 0;
  if (this.headline) score += 10;
  if (this.summary) score += 10;
  if (this.skills?.length > 0) score += 15;
  if (this.education?.length > 0) score += 20;
  if (this.experience?.length > 0) score += 20;
  if (this.resumeUrl) score += 15;
  if (this.preferredLocations?.length > 0) score += 5;
  if (this.preferredRoles?.length > 0) score += 5;
  this.profileCompleteness = score;
  next();
});

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);
