import mongoose from 'mongoose';

const jobListingSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    responsibilities: [
      {
        type: String,
        trim: true
      }
    ],
    requirements: [
      {
        type: String,
        trim: true
      }
    ],
    skills: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      default: 'Full-time'
    },
    workplaceType: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site'
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Manager', 'Executive'],
      default: 'Entry Level'
    },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true, default: '' },
      country: { type: String, trim: true, default: 'India' }
    },
    salary: {
      min: { type: Number, min: 0, default: 0 },
      max: { type: Number, min: 0, default: 0 },
      currency: { type: String, default: 'INR' },
      isNegotiable: { type: Boolean, default: false }
    },
    openings: {
      type: Number,
      default: 1,
      min: 1
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'suspended'],
      default: 'active',
      index: true
    },
    trustVerificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'under_review', 'flagged'],
      default: 'pending',
      index: true
    },
    isFromVerifiedEmployer: {
      type: Boolean,
      default: false,
      index: true
    },
    employerTrustScore: {
      type: Number,
      default: 40,
      min: 0,
      max: 100
    },
    verifiedFraudCount: {
      type: Number,
      default: 0,
      min: 0
    },
    applicationCount: {
      type: Number,
      default: 0,
      min: 0
    },
    deadline: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

jobListingSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobListingSchema.index({ status: 1, isFromVerifiedEmployer: 1, createdAt: -1 });

const JobListing = mongoose.model('JobListing', jobListingSchema);
export default JobListing;