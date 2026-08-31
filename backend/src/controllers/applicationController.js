import Application from '../models/Application.js';
import JobListing from '../models/JobListing.js';
import Employer from '../models/Employer.js';

export const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, contactPhone, portfolioUrl, resumeUrl } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    let finalResumeUrl = resumeUrl;
    if (req.file) {
      finalResumeUrl = req.file.path || req.file.secure_url;
    }

    if (!finalResumeUrl) {
      return res.status(400).json({ success: false, message: 'Resume file or URL is required.' });
    }

    const job = await JobListing.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `This job is currently ${job.status} and cannot accept new applications.`
      });
    }

    const existingApp = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existingApp) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this position.'
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      employer: job.employer,
      resumeUrl: finalResumeUrl,
      coverLetter: coverLetter || '',
      contactPhone: contactPhone || '',
      portfolioUrl: portfolioUrl || '',
      status: 'applied'
    });

    await JobListing.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        select: 'title location workplaceType salary status',
        populate: { path: 'employer', select: 'companyName logo verificationStatus trustScore' }
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { applications }
    });
  } catch (error) {
    next(error);
  }
};

export const getJobApplicantsForEmployer = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const employer = await Employer.findOne({ user: req.user._id });

    if (!employer) {
      return res.status(403).json({ success: false, message: 'Employer profile not found.' });
    }

    const query = { employer: employer._id };
    if (jobId) query.job = jobId;

    const applications = await Application.find(query)
      .populate('candidate', 'name email avatar phone')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { applications }
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status value.' });
    }

    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer) {
      return res.status(403).json({ success: false, message: 'Employer profile not found.' });
    }

    const application = await Application.findOne({ _id: applicationId, employer: employer._id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized.' });
    }

    application.status = status;
    if (notes !== undefined) application.notes = notes;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Candidate status marked as ${status}.`,
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};