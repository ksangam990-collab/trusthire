import FraudReport from '../models/FraudReport.js';
import Employer from '../models/Employer.js';
import JobListing from '../models/JobListing.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Enum allowlists used for validation before query construction
const VALID_CATEGORIES = [
  'Registration Fee / Security Deposit', 'Fake Offer Letter',
  'Identity Theft / Document Misuse',    'Unpaid Trial Work',
  'Phishing / Impersonation',            'Misleading Salary / Job Role',
  'Other Fraudulent Activity',
];
const VALID_SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const VALID_STATUSES   = ['pending', 'investigating', 'verified', 'dismissed'];

export const recalculateEmployerTrustScore = (employer) => {
  let score = 40;
  const breakdown = { legalVerification: 0, domainVerified: 0, companyAge: 0, cleanRecordBonus: 0, fraudPenalty: 0 };

  if (employer.verificationStatus === 'verified')     { breakdown.legalVerification = 30; score += 30; }
  if (employer.website && !employer.website.includes('free-domain')) { breakdown.domainVerified = 10; score += 10; }
  breakdown.companyAge = 10; score += 10;

  if (employer.verifiedFraudReports === 0) { breakdown.cleanRecordBonus = 10; score += 10; }
  else { const p = employer.verifiedFraudReports * 15; breakdown.fraudPenalty = p; score -= p; }

  employer.trustScore     = Math.max(0, Math.min(100, score));
  employer.scoreBreakdown = breakdown;
  return employer.trustScore;
};

export const submitReport = async (req, res, next) => {
  try {
    const { employerId, jobId, fraudCategory, severity, title, description, amountDemanded, isAnonymous, reporterContact } = req.body;

    if (!employerId || !fraudCategory || !title || !description)
      return res.status(400).json({ success: false, message: 'Employer ID, fraud category, title, and description are required.' });

    // FIX (MEDIUM): Validate ObjectIds before querying
    if (!isValidId(employerId))
      return res.status(400).json({ success: false, message: 'Invalid employer ID.' });
    if (jobId && !isValidId(jobId))
      return res.status(400).json({ success: false, message: 'Invalid job ID.' });

    // FIX (MEDIUM): Validate enum fields — previously any string was stored
    if (!VALID_CATEGORIES.includes(fraudCategory))
      return res.status(400).json({ success: false, message: 'Invalid fraud category.' });
    if (severity && !VALID_SEVERITIES.includes(severity))
      return res.status(400).json({ success: false, message: 'Invalid severity value.' });

    const employer = await Employer.findById(employerId);
    if (!employer)
      return res.status(404).json({ success: false, message: 'The reported employer does not exist.' });

    const evidenceFiles = [];
    if (Array.isArray(req.files)) {
      req.files.forEach(f => evidenceFiles.push({
        url:      f.path || f.secure_url,
        fileType: f.mimetype,
        fileName: typeof f.originalname === 'string' ? f.originalname.slice(0, 255) : 'evidence',
      }));
    }

    const report = await FraudReport.create({
      user:           req.user?._id ?? null,
      reporter:       req.user?._id ?? null,
      isAnonymous:    Boolean(isAnonymous),
      reporterContact: isAnonymous ? {} : (typeof reporterContact === 'object' && reporterContact !== null ? reporterContact : {}),
      employer:       employerId,
      job:            jobId || null,
      fraudCategory,
      severity:       VALID_SEVERITIES.includes(severity) ? severity : 'Medium',
      title:          String(title).trim().slice(0, 180),
      description:    String(description).trim(),
      amountDemanded: Math.max(0, Number(amountDemanded) || 0),
      evidenceFiles,
      status: 'pending',
    });

    await Employer.findByIdAndUpdate(employerId, { $inc: { totalSubmittedReports: 1 } });

    res.status(201).json({ success: true, message: 'Fraud report submitted for moderation.', data: { reportId: report._id } });
  } catch (error) { next(error); }
};

export const getPublicFraudBoard = async (req, res, next) => {
  try {
    const { category, severity, page = 1, limit = 10 } = req.query;
    const query = { status: { $in: ['verified', 'investigating'] } };

    // FIX (MEDIUM): Validate enum filters before using in query
    if (category) {
      if (!VALID_CATEGORIES.includes(category))
        return res.status(400).json({ success: false, message: 'Invalid category filter.' });
      query.fraudCategory = category;
    }
    if (severity) {
      if (!VALID_SEVERITIES.includes(severity))
        return res.status(400).json({ success: false, message: 'Invalid severity filter.' });
      query.severity = severity;
    }

    const pageNum  = Math.max(1, parseInt(page,  10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      FraudReport.find(query)
        .populate('employer', 'companyName logo verificationStatus trustScore')
        .populate('job', 'title location')
        .select('-reporter -reporterContact')   // Never expose reporter identity publicly
        .sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      FraudReport.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: { reports, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } },
    });
  } catch (error) { next(error); }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    // FIX (MEDIUM): Validate ObjectId and enum status before query
    if (!isValidId(reportId))
      return res.status(400).json({ success: false, message: 'Invalid report ID.' });
    if (!VALID_STATUSES.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status value.' });

    const report = await FraudReport.findById(reportId);
    if (!report)
      return res.status(404).json({ success: false, message: 'Report not found.' });

    const prevStatus = report.status;
    const employer   = await Employer.findById(report.employer);

    if (employer && prevStatus !== status) {
      if (prevStatus !== 'verified' && status === 'verified')   employer.verifiedFraudReports++;
      if (prevStatus === 'verified' && status !== 'verified')   employer.verifiedFraudReports = Math.max(0, employer.verifiedFraudReports - 1);

      if (employer.verifiedFraudReports >= 3) {
        employer.isSuspended        = true;
        employer.verificationStatus = 'suspended';
        employer.suspensionReason   = 'Multiple verified fraud allegations.';
        await JobListing.updateMany({ employer: employer._id }, { status: 'suspended', trustVerificationStatus: 'flagged' });
      }

      recalculateEmployerTrustScore(employer);
      await employer.save();
      await JobListing.updateMany(
        { employer: employer._id },
        { employerTrustScore: employer.trustScore, verifiedFraudCount: employer.verifiedFraudReports, isFromVerifiedEmployer: employer.verificationStatus === 'verified' }
      );
    }

    report.status     = status;
    if (adminNotes !== undefined) report.adminNotes = typeof adminNotes === 'string' ? adminNotes.slice(0, 2000) : '';
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    await report.save();

    res.status(200).json({ success: true, message: `Report status updated to ${status}.`, data: { report } });
  } catch (error) { next(error); }
};

export const getAllReportsAdmin = async (req, res, next) => {
  try {
    const { status, category, severity, page = 1, limit = 20 } = req.query;
    const query = {};

    // FIX (MEDIUM): Validate all enum filter params
    if (status)   { if (!VALID_STATUSES.includes(status))     return res.status(400).json({ success: false, message: 'Invalid status filter.' });   query.status       = status;   }
    if (category) { if (!VALID_CATEGORIES.includes(category)) return res.status(400).json({ success: false, message: 'Invalid category filter.' }); query.fraudCategory = category; }
    if (severity) { if (!VALID_SEVERITIES.includes(severity)) return res.status(400).json({ success: false, message: 'Invalid severity filter.' }); query.severity      = severity; }

    const pageNum  = Math.max(1, parseInt(page,  10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      FraudReport.find(query)
        .populate('employer', 'companyName cin gstin verificationStatus trustScore')
        .populate('job',      'title location salary')
        .populate('reporter', 'name email phone')
        .sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      FraudReport.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: { reports, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } },
    });
  } catch (error) { next(error); }
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
      FraudReport.countDocuments({ status: 'verified' }),
    ]);

    res.status(200).json({ success: true, data: { totalUsers, totalEmployers, verifiedEmployers, totalJobs, activeJobs, totalReports, pendingReports, verifiedReports } });
  } catch (error) { next(error); }
};
