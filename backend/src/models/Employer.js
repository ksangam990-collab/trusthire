import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters']
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    industry: {
      type: String,
      trim: true,
      default: 'Information Technology'
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: '11-50'
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    location: {
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      country: { type: String, trim: true, default: 'India' },
      address: { type: String, trim: true, default: '' }
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected', 'suspended'],
      default: 'unverified'
    },
    cin: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    verificationDate: {
      type: Date
    },
    trustScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 40
    },
    scoreBreakdown: {
      legalVerification: { type: Number, default: 0 },
      domainVerified: { type: Number, default: 0 },
      companyAge: { type: Number, default: 0 },
      cleanRecordBonus: { type: Number, default: 0 },
      fraudPenalty: { type: Number, default: 0 }
    },
    totalSubmittedReports: {
      type: Number,
      default: 0,
      min: 0
    },
    verifiedFraudReports: {
      type: Number,
      default: 0,
      min: 0
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    suspensionReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

employerSchema.index({ companyName: 'text', industry: 'text' });
employerSchema.index({ verificationStatus: 1, trustScore: -1 });

const Employer = mongoose.model('Employer', employerSchema);
export default Employer;