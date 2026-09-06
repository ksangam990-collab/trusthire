import Employer from '../models/Employer.js';
import JobListing from '../models/JobListing.js';
import Application from '../models/Application.js';
import FraudReport from '../models/FraudReport.js';
import { recalculateEmployerTrustScore } from './fraudController.js';

// FIX (HIGH): Escape user input before using in $regex to prevent ReDoS.
// A crafted search string like "(a+)+" causes catastrophic backtracking in the
// regex engine, hanging the MongoDB process under minimal CPU load.
const escapeRegex = (str) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

const VALID_COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

export const getEmployerProfile = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    res.status(200).json({ success: true, data: { employer } });
  } catch (error) { next(error); }
};

export const updateEmployerProfile = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });

    const { companyName, website, industry, companySize, description, location } = req.body;

    if (companyName !== undefined) employer.companyName = String(companyName).trim().slice(0, 120);
    if (website !== undefined)     employer.website     = String(website || '').trim().slice(0, 500);
    if (industry !== undefined)    employer.industry    = String(industry).trim().slice(0, 100);
    if (description !== undefined) employer.description = String(description || '').trim().slice(0, 2000);
    if (companySize !== undefined && VALID_COMPANY_SIZES.includes(companySize)) employer.companySize = companySize;
    if (location && typeof location === 'object') employer.location = { ...employer.location, ...location };

    recalculateEmployerTrustScore(employer);
    await employer.save();

    res.status(200).json({ success: true, message: 'Employer profile updated.', data: { employer } });
  } catch (error) { next(error); }
};

export const verifyEmployerSimulation = async (req, res, next) => {
  try {
    const { cin, gstin } = req.body;
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });

    const cinPattern   = /^[LUu]{1}[0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}$/;
    const gstinPattern = /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/;

    if (!cin?.trim())
      return res.status(400).json({ success: false, message: 'CIN is required for verification.' });
    if (!cinPattern.test(cin.trim()))
      return res.status(400).json({ success: false, message: 'Invalid CIN format.' });
    if (gstin && !gstinPattern.test(gstin.trim()))
      return res.status(400).json({ success: false, message: 'Invalid GSTIN format.' });

    employer.cin                = cin.trim().toUpperCase();
    employer.gstin              = gstin ? gstin.trim().toUpperCase() : employer.gstin;
    employer.verificationStatus = 'verified';
    employer.verificationDate   = new Date();

    recalculateEmployerTrustScore(employer);
    await employer.save();

    await JobListing.updateMany(
      { employer: employer._id },
      { isFromVerifiedEmployer: true, trustVerificationStatus: 'verified', employerTrustScore: employer.trustScore }
    );

    res.status(200).json({
      success: true,
      message: 'Corporate identity verified.',
      data: { verificationStatus: employer.verificationStatus, trustScore: employer.trustScore, scoreBreakdown: employer.scoreBreakdown },
    });
  } catch (error) { next(error); }
};

export const getEmployerDashboardMetrics = async (req, res, next) => {
  try {
    // FIX (MEDIUM): Admin users have no employer profile — previously this
    // returned a confusing 404 "Employer profile not found." Now returns a
    // meaningful 403 directing admins to the correct endpoint.
    if (req.user.role === 'admin')
      return res.status(403).json({ success: false, message: 'Admin users should use /fraud/admin/metrics for platform metrics.' });

    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });

    const [activeJobsCount, totalJobsCount, recentJobs, fraudReportsCount] = await Promise.all([
      JobListing.countDocuments({ employer: employer._id, status: 'active' }),
      JobListing.countDocuments({ employer: employer._id }),
      JobListing.find({ employer: employer._id }).sort({ createdAt: -1 }).limit(5).lean(),
      FraudReport.countDocuments({ employer: employer._id }),
    ]);

    const jobIds      = await JobListing.find({ employer: employer._id }).distinct('_id');
    const applications = await Application.find({ job: { $in: jobIds } }).lean();

    const funnel = { applied: 0, reviewing: 0, shortlisted: 0, interview: 0, hired: 0, rejected: 0 };
    applications.forEach(a => { if (funnel[a.status] !== undefined) funnel[a.status]++; });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          trustScore: employer.trustScore, verificationStatus: employer.verificationStatus,
          activeJobs: activeJobsCount, totalJobs: totalJobsCount,
          totalApplications: applications.length, fraudReportsCount,
          scoreBreakdown: employer.scoreBreakdown,
        },
        funnel,
        recentJobs,
      },
    });
  } catch (error) { next(error); }
};

export const getPublicEmployers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search && typeof search === 'string' && search.trim()) {
      // FIX (HIGH): Escape the user-supplied search string before using in $regex.
      const escaped = escapeRegex(search.trim().slice(0, 100));
      query.companyName = { $regex: escaped, $options: 'i' };
    }

    const employers = await Employer.find(query)
      .select('companyName logo verificationStatus trustScore industry location website')
      .limit(30)
      .lean();

    res.status(200).json({ success: true, data: { employers } });
  } catch (error) { next(error); }
};
