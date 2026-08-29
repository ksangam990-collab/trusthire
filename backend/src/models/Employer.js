const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name too long'],
      index: true,
    },
    cin: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true, // allow multiple nulls
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'failed', 'manual_review'],
      default: 'unverified',
    },
    verificationData: {
      registeredName: String,
      incorporationDate: Date,
      companyType: String,       // e.g. "Private Limited"
      registeredState: String,
      cin: String,
      gstin: String,
      verifiedAt: Date,
      verifiedVia: String,       // "cin" | "gstin" | "manual"
    },
    // Trust score: 0–100, computed from reports + registration age + activity
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    website: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    industry: { type: String, trim: true },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    },
    logoUrl: { type: String },
    totalListings: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    fraudReportCount: { type: Number, default: 0 },
    verifiedReportCount: { type: Number, default: 0 }, // admin-confirmed fraud
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String },
  },
  { timestamps: true }
);

// Auto-compute trust score before save
employerSchema.pre('save', function (next) {
  let score = 50;

  // Verified = +30
  if (this.verificationStatus === 'verified') score += 30;

  // Each admin-verified fraud report = -15
  score -= this.verifiedReportCount * 15;

  // Active without reports = small bonus
  if (this.totalListings > 5 && this.fraudReportCount === 0) score += 10;

  // Registered long ago (data from verificationData)
  if (this.verificationData?.incorporationDate) {
    const yearsOld =
      (Date.now() - new Date(this.verificationData.incorporationDate)) /
      (1000 * 60 * 60 * 24 * 365);
    if (yearsOld > 3) score += 10;
  }

  this.trustScore = Math.min(100, Math.max(0, Math.round(score)));
  next();
});

module.exports = mongoose.model('Employer', employerSchema);
