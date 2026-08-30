const { z } = require('zod');
const Employer = require('../models/Employer');
const FraudReport = require('../models/FraudReport');
const { verifyCompanyEmail, verifyRegistrationNumber } = require('../services/verificationService');
// ── Verify Employer (CIN or GSTIN) ────────────────────────────────────────────
exports.verifyEmployer = async (req, res, next) => {
  try {
    const schema = z.object({
      cin: z.string().optional(),
      gstin: z.string().optional(),
    }).refine((d) => d.cin || d.gstin, {
      message: 'Provide either CIN or GSTIN for verification.',
    });

    const { cin, gstin } = schema.parse(req.body);

    const employer = await Employer.findOne({ userId: req.user._id });
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    }

    if (employer.verificationStatus === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Your company is already verified.',
        data: employer.verificationData,
      });
    }

    let result;
    if (cin) {
      result = await verifyCIN(cin);
    } else {
      result = await verifyGSTIN(gstin);
    }

    if (!result.success) {
      employer.verificationStatus = 'failed';
      await employer.save();
      return res.status(422).json({
        success: false,
        message: result.error,
        verificationStatus: 'failed',
      });
    }

    // Update employer with verified data
    employer.verificationStatus = 'verified';
    employer.cin = cin || employer.cin;
    employer.gstin = gstin || employer.gstin;
    employer.verificationData = result.data;
    await employer.save();

    res.json({
      success: true,
      message: 'Company verified successfully!',
      verificationStatus: 'verified',
      verificationData: result.data,
      trustScore: employer.trustScore,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get My Employer Profile ───────────────────────────────────────────────────
exports.getMyProfile = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ userId: req.user._id }).populate(
      'userId',
      'name email phone'
    );
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    }
    res.json({ success: true, employer });
  } catch (error) {
    next(error);
  }
};

// ── Get Public Employer Profile ───────────────────────────────────────────────
exports.getPublicProfile = async (req, res, next) => {
  try {
    const employer = await Employer.findById(req.params.employerId).populate(
      'userId',
      'name'
    );
    if (!employer || employer.isSuspended) {
      return res.status(404).json({ success: false, message: 'Employer not found.' });
    }

    // Fetch fraud report summary (public, anonymized)
    const reportSummary = await FraudReport.aggregate([
      {
        $match: {
          employerId: employer._id,
          status: { $in: ['pending', 'under_review', 'verified'] },
        },
      },
      {
        $group: {
          _id: '$reportType',
          count: { $sum: 1 },
        },
      },
    ]);

    const reportsByType = {};
    reportSummary.forEach((r) => { reportsByType[r._id] = r.count; });

    // Recent verified reports (anonymized)
    const recentReports = await FraudReport.find({
      employerId: employer._id,
      status: 'verified',
    })
      .select('reportType createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      employer: {
        _id: employer._id,
        companyName: employer.companyName,
        verificationStatus: employer.verificationStatus,
        verificationData: employer.verificationData
          ? {
              registeredName: employer.verificationData.registeredName,
              incorporationDate: employer.verificationData.incorporationDate,
              companyType: employer.verificationData.companyType,
              registeredState: employer.verificationData.registeredState,
              verifiedAt: employer.verificationData.verifiedAt,
            }
          : null,
        trustScore: employer.trustScore,
        industry: employer.industry,
        companySize: employer.companySize,
        website: employer.website,
        description: employer.description,
        logoUrl: employer.logoUrl,
        totalListings: employer.totalListings,
        fraudReportCount: employer.fraudReportCount,
        createdAt: employer.createdAt,
      },
      fraudSummary: {
        total: employer.fraudReportCount,
        byType: reportsByType,
        recentVerified: recentReports,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Employer Profile ───────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const schema = z.object({
      companyName: z.string().min(2).max(200).optional(),
      website: z.string().url().optional().or(z.literal('')),
      description: z.string().max(1000).optional(),
      industry: z.string().max(100).optional(),
      companySize: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
    });

    const updates = schema.parse(req.body);

    const employer = await Employer.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    }

    res.json({ success: true, employer });
  } catch (error) {
    next(error);
  }
};
