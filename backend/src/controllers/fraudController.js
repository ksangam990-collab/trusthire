import FraudReport from '../models/FraudReport.js';
import Employer from '../models/Employer.js';
import JobListing from '../models/JobListing.js';

export const recalculateEmployerTrustScore = (employer) => {
  let score = 40; // Base baseline
  const breakdown = {
    legalVerification: 0,
    domainVerified: 0,
    companyAge: 0,
    cleanRecordBonus: 0,
    fraudPenalty: 0
  };

  if (employer.verificationStatus === 'verified') {
    breakdown.legalVerification = 30;
    score += 30;
  }

  if (employer.website && !employer.website.includes('free-domain')) {
    breakdown.domainVerified = 10;
    score += 10;
  }

  breakdown.companyAge = 10;
  score += 10;

  if (employer.verifiedFraudReports === 0) {
    breakdown.cleanRecordBonus = 10;
    score += 10;
  } else {
    const penalty = employer.verifiedFraudReports * 15;
    breakdown.fraudPenalty = penalty;
    score -= penalty;
  }

  employer.trustScore = Math.max(0, Math.min(100, score));
  employer.scoreBreakdown = breakdown;
  return employer.trustScore;
};

export const submitReport = async (req, res, next) => {
  try {
    const {
      employerId,
      jobId,
      fraudCategory,
      severity,
      title,
      description,
      amountDemanded,
      isAnonymous,
      reporterContact
    } = req.body;

    if (!employerId || !fraudCategory || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Employer ID, fraud category, title, and detailed description are required.'
      });
    }

    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'The reported employer does not exist.'
      });
    }

    const evidenceFiles = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        evidenceFiles.push({
          url: file.path || file.secure_url,
          fileType: file.mimetype,
          fileName: file.originalname
        });
      });
    }

    const report = await FraudReport.create({
      reporter: req.user ? req.user._id : null,
      isAnonymous: Boolean(isAnonymous),
      reporterContact: isAnonymous ? {} : (reporterContact || {}),
      employer: employerId,
      job: jobId || null,
      fraudCategory,
      severity: severity || 'Medium',
      title,
      description,
      amountDemanded: Number(amountDemanded) || 0,
      evidenceFiles,
      status: 'pending'
    });

    employer.totalSubmittedReports += 1;
    await employer.save();

    res.status(201).json({
      success: true,
      message: 'Fraud incident report submitted successfully for moderation.',
      data: { reportId: report._id }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicFraudBoard = async (req, res, next) => {
  try {
    const { category, severity, page = 1, limit = 10 } = req.query;
    const query = { status: { $in: ['verified', 'investigating'] } };

    if (category) query.fraudCategory = category;
    if (severity) query.severity = severity;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      FraudReport.find(query)
        .populate('employer', 'companyName logo verificationStatus trustScore')
        .populate('job', 'title location')
        .select('-reporter -reporterContact')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      FraudReport.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    if (!['pending', 'investigating', 'verified', 'dismissed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status transition value.' });
    }

    const report = await FraudReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    const prevStatus = report.status;
    const employer = await Employer.findById(report.employer);

    if (employer && prevStatus !== status) {
      // Idempotent state transitions
      if (prevStatus !== 'verified' && status === 'verified') {
        employer.verifiedFraudReports += 1;
      } else if (prevStatus === 'verified' && status !== 'verified') {
        employer.verifiedFraudReports = Math.max(0, employer.verifiedFraudReports - 1);
      }

      // Auto-suspension threshold rule: >= 3 verified reports triggers suspension
      if (employer.verifiedFraudReports >= 3) {
        employer.isSuspended = true;
        employer.verificationStatus = 'suspended';
        employer.suspensionReason = 'Multiple verified fraud allegations confirmed.';
        
        await JobListing.updateMany(
          { employer: employer._id },
          { status: 'suspended', trustVerificationStatus: 'flagged' }
        );
      }

      recalculateEmployerTrustScore(employer);
      await employer.save();

      // Cascade update to listings
      await JobListing.updateMany(
        { employer: employer._id },
        { 
          employerTrustScore: employer.trustScore,
          verifiedFraudCount: employer.verifiedFraudReports,
          isFromVerifiedEmployer: employer.verificationStatus === 'verified'
        }
      );
    }

    report.status = status;
    if (adminNotes) report.adminNotes = adminNotes;
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    await report.save();

    res.status(200).json({
      success: true,
      message: `Report status updated to ${status}.`,
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReportsAdmin = async (req, res, next) => {
  try {
    const { status, category, severity, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.fraudCategory = category;
    if (severity) query.severity = severity;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      FraudReport.find(query)
        .populate('employer', 'companyName cin gstin verificationStatus trustScore')
        .populate('job', 'title location salary')
        .populate('reporter', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      FraudReport.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminMetrics = async (req, res, next) => {
  try {
    const [totalUsers, totalEmployers, verifiedEmployers, totalJobs, activeJobs, totalReports, pendingReports, verifiedReports] = await Promise.all([
      import('../models/User.js').then(m => m.default.countDocuments()),
      Employer.countDocuments(),
      Employer.countDocuments({ verificationStatus: 'verified' }),
      JobListing.countDocuments(),
      JobListing.countDocuments({ status: 'active' }),
      FraudReport.countDocuments(),
      FraudReport.countDocuments({ status: 'pending' }),
      FraudReport.countDocuments({ status: 'verified' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEmployers,
        verifiedEmployers,
        totalJobs,
        activeJobs,
        totalReports,
        pendingReports,
        verifiedReports
      }
    });
  } catch (error) {
    next(error);
  }
};