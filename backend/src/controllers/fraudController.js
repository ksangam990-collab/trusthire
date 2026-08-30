const { z } = require('zod');
const mongoose = require('mongoose');
const FraudReport = require('../models/FraudReport');
const Employer = require('../models/Employer');
const JobListing = require('../models/JobListing');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendFraudReportConfirmation } = require('../services/emailService');

const REPORT_TYPES = [
  'asked_for_money',
  'fake_company',
  'identity_impersonation',
  'scam_interview',
  'misleading_job',
  'other',
];

// ── Submit Fraud Report ───────────────────────────────────────────────────────
exports.submitReport = async (req, res, next) => {
  try {
    const schema = z.object({
      employerId: z.string().min(1, 'Employer ID required'),
      jobId: z.string().optional(),
      reportType: z.enum(REPORT_TYPES),
      description: z
        .string()
        .min(50, 'Please describe what happened (min 50 characters)')
        .max(2000),
      isAnonymous: z
        .union([z.boolean(), z.string()])
        .transform((v) => v === true || v === 'true')
        .default(false),
    });

    const data = schema.parse(req.body);

    // Verify employer exists
    const employer = await Employer.findById(data.employerId);
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found.' });
    }

    // Upload evidence files if any
    const evidenceUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files.slice(0, 3)) {
        // max 3 files
        const result = await uploadToCloudinary(
          file.buffer,
          'fraud-evidence'
        );
        evidenceUrls.push(result.secure_url);
      }
    }

    const report = await FraudReport.create({
      reportedBy: req.user._id,
      employerId: data.employerId,
      jobId: data.jobId || undefined,
      reportType: data.reportType,
      description: data.description,
      isAnonymous: data.isAnonymous,
      evidenceUrls,
    });

    // Increment employer's fraud report count
    await Employer.findByIdAndUpdate(data.employerId, {
      $inc: { fraudReportCount: 1 },
    });

    // If job was specified, increment job's fraud count
    if (data.jobId) {
      await JobListing.findByIdAndUpdate(data.jobId, {
        $inc: { fraudReportCount: 1 },
      });
    }

    // Auto-suspend listing if ≥3 reports of same type on same job
    if (data.jobId) {
      const sameTypeCount = await FraudReport.countDocuments({
        jobId: data.jobId,
        reportType: data.reportType,
        status: { $in: ['pending', 'under_review', 'verified'] },
      });

      if (sameTypeCount >= 3) {
        await JobListing.findByIdAndUpdate(data.jobId, {
          status: 'suspended',
          isFlagged: true,
        });
      }
    }

    // Send confirmation email (non-blocking)
    sendFraudReportConfirmation(req.user).catch((err) =>
      console.error('Fraud report email failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Report submitted. Thank you for helping keep TrustHire safe.',
      reportId: report._id,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Public Fraud Summary for Employer ─────────────────────────────────────
exports.getEmployerFraudSummary = async (req, res, next) => {
  try {
    const { employerId } = req.params;

    if (!mongoose.isValidObjectId(employerId)) {
      return res.status(400).json({ success: false, message: 'Invalid employer ID.' });
    }

    const byType = await FraudReport.aggregate([
      {
        $match: {
          employerId: new mongoose.Types.ObjectId(employerId),
          status: { $in: ['pending', 'under_review', 'verified'] },
        },
      },
      { $group: { _id: '$reportType', count: { $sum: 1 } } },
    ]);

    const recentVerified = await FraudReport.find({
      employerId,
      status: 'verified',
    })
      .select('reportType createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    const total = byType.reduce((sum, r) => sum + r.count, 0);

    res.json({
      success: true,
      total,
      byType: Object.fromEntries(byType.map((r) => [r._id, r.count])),
      recentVerified,
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin: List All Reports ───────────────────────────────────────────────────
exports.getAllReports = async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const query = {};
    if (status !== 'all') query.status = status;

    const reports = await FraudReport.find(query)
      .populate('employerId', 'companyName verificationStatus')
      .populate('jobId', 'title')
      .populate({
        path: 'reportedBy',
        select: 'name email',
      })
      .select('+adminNotes +reviewedBy')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await FraudReport.countDocuments(query);

    res.json({ success: true, reports, total });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Review Report ──────────────────────────────────────────────────────
exports.reviewReport = async (req, res, next) => {
  try {
    const { status, adminNotes } = z.object({
      status: z.enum(['under_review', 'verified', 'dismissed']),
      adminNotes: z.string().max(1000).optional(),
    }).parse(req.body);

    const report = await FraudReport.findById(req.params.reportId).select('+adminNotes');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    const wasVerified = report.status === 'verified';
    report.status = status;
    report.adminNotes = adminNotes;
    report.reviewedBy = req.user._id;
    if (status !== 'pending') report.resolvedAt = new Date();
    await report.save();

    // If newly verified: increment employer's verified report count & recompute trust score
    if (status === 'verified' && !wasVerified) {
      const employer = await Employer.findById(report.employerId);
      if (employer) {
        employer.verifiedReportCount += 1;
        await employer.save(); // triggers trustScore recompute in pre-save
      }
    }

    // If dismissed: decrement employer total count
    if (status === 'dismissed' && !wasVerified) {
      await Employer.findByIdAndUpdate(report.employerId, {
        $inc: { fraudReportCount: -1 },
      });
    }

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};
