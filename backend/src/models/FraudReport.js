import mongoose from 'mongoose';

const fraudReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    reporterContact: {
      name: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' }
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: [true, 'Employer ID is required for reporting'],
      index: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobListing',
      default: null,
      index: true
    },
    fraudCategory: {
      type: String,
      required: [true, 'Fraud category is required'],
      enum: [
        'Registration Fee / Security Deposit',
        'Fake Offer Letter',
        'Identity Theft / Document Misuse',
        'Unpaid Trial Work',
        'Phishing / Impersonation',
        'Misleading Salary / Job Role',
        'Other Fraudulent Activity'
      ]
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    title: {
      type: String,
      required: [true, 'Report summary title is required'],
      trim: true,
      maxlength: [180, 'Title cannot exceed 180 characters']
    },
    description: {
      type: String,
      required: [true, 'Detailed incident description is required'],
      minlength: [30, 'Description must be at least 30 characters long']
    },
    amountDemanded: {
      type: Number,
      min: 0,
      default: 0
    },
    evidenceFiles: [
      {
        url: { type: String, required: true },
        fileType: { type: String },
        fileName: { type: String },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'investigating', 'verified', 'dismissed'],
      default: 'pending',
      index: true
    },
    adminNotes: {
      type: String,
      default: ''
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

fraudReportSchema.index({ status: 1, fraudCategory: 1, createdAt: -1 });

const FraudReport = mongoose.model('FraudReport', fraudReportSchema);
export default FraudReport;