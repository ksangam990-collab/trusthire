const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    keywords: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    jobType: {
      type: String,
      enum: ['fulltime', 'parttime', 'internship', 'contract', 'any'],
      default: 'any',
    },
    verifiedOnly: { type: Boolean, default: true },
    frequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily',
    },
    isActive: { type: Boolean, default: true },
    lastSentAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
