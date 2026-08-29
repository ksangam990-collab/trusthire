const { z } = require('zod');
const Application = require('../models/Application');
const JobListing = require('../models/JobListing');
const Employer = require('../models/Employer');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const { sendApplicationNotification } = require('../services/emailService');
const User = require('../models/User');

// ── Apply to a Job ────────────────────────────────────────────────────────────
exports.applyToJob = async (req, res, next) => {
  try {
    const { coverNote } = z
      .object({ coverNote: z.string().max(1000).optional() })
      .parse(req.body);

    const job = await JobListing.findById(req.params.jobId);
    if (!job || job.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Job not found or no longer active.' });
    }

    // Check for duplicate application
    const existing = await Application.findOne({
      jobId: job._id,
      jobSeekerId: req.user._id,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this job.',
      });
    }

    // Get resume URL from profile
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    const application = await Application.create({
      jobId: job._id,
      jobSeekerId: req.user._id,
      employerId: job.employerId,
      resumeUrl: profile?.resumeUrl,
      coverNote,
    });

    // Increment application count
    await JobListing.findByIdAndUpdate(job._id, { $inc: { applicationCount: 1 } });

    // Notify employer (non-blocking)
    const employer = await Employer.findById(job.employerId).populate('userId', 'email');
    if (employer?.userId?.email) {
      sendApplicationNotification(
        employer.userId,
        job.title,
        req.user.name
      ).catch((err) => console.error('Application notification failed:', err.message));
    }

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// ── Get My Applications (Job Seeker) ─────────────────────────────────────────
exports.getMyApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { jobSeekerId: req.user._id };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate({
        path: 'jobId',
        select: 'title location jobType salaryRange status closesAt',
        populate: {
          path: 'employerId',
          select: 'companyName verificationStatus trustScore logoUrl',
        },
      })
      .sort({ appliedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// ── Get Applications for a Job (Employer) ────────────────────────────────────
exports.getJobApplications = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ userId: req.user._id });
    const job = await JobListing.findById(req.params.jobId);

    if (!job || !job.employerId.equals(employer._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const query = { jobId: job._id };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('jobSeekerId', 'name email phone location')
      .populate({
        path: 'jobSeekerId',
        select: 'name email phone location',
        model: User,
      })
      .sort({ appliedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Fetch seeker profiles for skills/resume
    const seekerIds = applications.map((a) => a.jobSeekerId?._id);
    const profiles = await JobSeekerProfile.find({
      userId: { $in: seekerIds },
    }).select('userId skills resumeUrl headline profileCompleteness');

    const profileMap = {};
    profiles.forEach((p) => { profileMap[p.userId.toString()] = p; });

    const enriched = applications.map((app) => ({
      ...app,
      seekerProfile: profileMap[app.jobSeekerId?._id?.toString()] || null,
    }));

    res.json({ success: true, applications: enriched });
  } catch (error) {
    next(error);
  }
};

// ── Update Application Status (Employer) ─────────────────────────────────────
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, employerNote } = z.object({
      status: z.enum(['viewed', 'shortlisted', 'rejected', 'hired']),
      employerNote: z.string().max(500).optional(),
    }).parse(req.body);

    const employer = await Employer.findOne({ userId: req.user._id });
    const application = await Application.findById(req.params.applicationId).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (!application.jobId.employerId.equals(employer._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    application.status = status;
    application.statusUpdatedAt = new Date();
    if (status === 'viewed' && !application.viewedAt) {
      application.viewedAt = new Date();
    }
    if (employerNote !== undefined) application.employerNote = employerNote;

    await application.save();
    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};
