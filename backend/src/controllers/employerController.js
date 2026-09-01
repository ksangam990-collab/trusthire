import Employer from '../models/Employer.js';
import JobListing from '../models/JobListing.js';
import Application from '../models/Application.js';
import FraudReport from '../models/FraudReport.js';
import { recalculateEmployerTrustScore } from './fraudController.js';

export const getEmployerProfile = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    }

    res.status(200).json({
      success: true,
      data: { employer }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployerProfile = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    }

    const { companyName, website, industry, companySize, description, location } = req.body;
    
    if (companyName) employer.companyName = companyName;
    if (website !== undefined) employer.website = website;
    if (industry) employer.industry = industry;
    if (companySize) employer.companySize = companySize;
    if (description !== undefined) employer.description = description;
    if (location) employer.location = { ...employer.location, ...location };

    recalculateEmployerTrustScore(employer);
    await employer.save();

    res.status(200).json({
      success: true,
      message: 'Employer profile updated.',
      data: { employer }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmployerSimulation = async (req, res, next) => {
  try {
    const { cin, gstin } = req.body;
    const normalizedCin = typeof cin === 'string' ? cin.trim().toUpperCase() : '';
    const normalizedGstin = typeof gstin === 'string' ? gstin.trim().toUpperCase() : '';
    const employer = await Employer.findOne({ user: req.user._id });

    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    }

    if (!normalizedCin && !normalizedGstin) {
      return res.status(400).json({
        success: false,
        message: 'Provide a valid CIN or GSTIN before requesting verification.'
      });
    }

    // Structural validation for the demo verification flow. This does not query MCA/GST.
    const cinPattern = /^[LU][0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}$/i;
    const gstinPattern = /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/;

    if (normalizedCin && !cinPattern.test(normalizedCin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Corporate Identification Number (CIN) format.'
      });
    }

    if (normalizedGstin && !gstinPattern.test(normalizedGstin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Goods and Services Tax Identification Number (GSTIN) format.'
      });
    }

    employer.cin = normalizedCin || employer.cin;
    employer.gstin = normalizedGstin || employer.gstin;
    employer.verificationStatus = 'verified';
    employer.verificationDate = new Date();

    recalculateEmployerTrustScore(employer);
    await employer.save();

    // Synchronize existing active job listings
    await JobListing.updateMany(
      { employer: employer._id },
      {
        isFromVerifiedEmployer: true,
        trustVerificationStatus: 'verified',
        employerTrustScore: employer.trustScore
      }
    );

    res.status(200).json({
      success: true,
      message: 'Corporate identity successfully verified.',
      data: {
        verificationStatus: employer.verificationStatus,
        trustScore: employer.trustScore,
        scoreBreakdown: employer.scoreBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployerDashboardMetrics = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    }

    const [activeJobsCount, totalJobsCount, recentJobs, fraudReportsCount] = await Promise.all([
      JobListing.countDocuments({ employer: employer._id, status: 'active' }),
      JobListing.countDocuments({ employer: employer._id }),
      JobListing.find({ employer: employer._id }).sort({ createdAt: -1 }).limit(5).lean(),
      FraudReport.countDocuments({ employer: employer._id })
    ]);

    const jobIds = await JobListing.find({ employer: employer._id }).distinct('_id');

    const applications = await Application.find({ job: { $in: jobIds } }).lean();

    const funnel = {
      applied: 0,
      reviewing: 0,
      shortlisted: 0,
      interview: 0,
      hired: 0,
      rejected: 0
    };

    applications.forEach(app => {
      if (funnel[app.status] !== undefined) {
        funnel[app.status] += 1;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          trustScore: employer.trustScore,
          verificationStatus: employer.verificationStatus,
          activeJobs: activeJobsCount,
          totalJobs: totalJobsCount,
          totalApplications: applications.length,
          fraudReportsCount,
          scoreBreakdown: employer.scoreBreakdown
        },
        funnel,
        recentJobs
      }
    });
  } catch (error) {
    next(error);
  }
};