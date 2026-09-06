import Application from '../models/Application.js';
import JobListing from '../models/JobListing.js';
import Employer from '../models/Employer.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// FIX (HIGH): Validate that any manually supplied URL uses http or https.
// Without this a candidate could store javascript:, data:, or file:// URLs
// as their resume URL, which would be served to employers clicking the link.
const isValidHttpUrl = (str) => {
  try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
};

export const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, contactPhone, portfolioUrl, resumeUrl } = req.body;

    if (!jobId)
      return res.status(400).json({ success: false, message: 'Job ID is required.' });

    // FIX (MEDIUM): ObjectId validation prevents CastError and wastes a DB roundtrip
    if (!isValidId(jobId))
      return res.status(400).json({ success: false, message: 'Invalid job ID.' });

    // Determine resume URL — uploaded file takes priority over URL body param
    let finalResumeUrl = null;
    if (req.file) {
      finalResumeUrl = req.file.path || req.file.secure_url;
    } else if (resumeUrl && typeof resumeUrl === 'string' && resumeUrl.trim()) {
      if (!isValidHttpUrl(resumeUrl.trim()))
        return res.status(400).json({ success: false, message: 'Resume URL must be a valid HTTP or HTTPS URL.' });
      finalResumeUrl = resumeUrl.trim();
    }

    if (!finalResumeUrl)
      return res.status(400).json({ success: false, message: 'A resume file or valid resume URL is required.' });

    // FIX (HIGH): Validate portfolioUrl if provided — same protocol restriction
    if (portfolioUrl && typeof portfolioUrl === 'string' && portfolioUrl.trim()) {
      if (!isValidHttpUrl(portfolioUrl.trim()))
        return res.status(400).json({ success: false, message: 'Portfolio URL must be a valid HTTP or HTTPS URL.' });
    }

    const job = await JobListing.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job listing not found.' });

    if (job.status !== 'active')
      return res.status(400).json({ success: false, message: `This job is currently ${job.status} and is not accepting applications.` });

    const existingApp = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existingApp)
      return res.status(409).json({ success: false, message: 'You have already applied for this position.' });

    const application = await Application.create({
      job:          jobId,
      candidate:    req.user._id,
      employer:     job.employer,
      resumeUrl:    finalResumeUrl,
      coverLetter:  typeof coverLetter === 'string'   ? coverLetter.slice(0, 3000)  : '',
      contactPhone: typeof contactPhone === 'string'  ? contactPhone.trim().slice(0, 20) : '',
      portfolioUrl: portfolioUrl && typeof portfolioUrl === 'string' ? portfolioUrl.trim().slice(0, 500) : '',
      status: 'applied',
    });

    await JobListing.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({ success: true, message: 'Application submitted successfully.', data: { application } });
  } catch (error) { next(error); }
};

export const getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        select: 'title location workplaceType salary status',
        populate: { path: 'employer', select: 'companyName logo verificationStatus trustScore' },
      })
      .sort({ createdAt: -1 }).lean();

    res.status(200).json({ success: true, data: { applications } });
  } catch (error) { next(error); }
};

export const getJobApplicantsForEmployer = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const employer  = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(403).json({ success: false, message: 'Employer profile not found.' });

    const query = { employer: employer._id };

    if (jobId) {
      // FIX (MEDIUM): Validate jobId param before using in query
      if (!isValidId(jobId))
        return res.status(400).json({ success: false, message: 'Invalid job ID.' });
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('candidate', 'name email avatar phone')
      .populate('job', 'title')
      .sort({ createdAt: -1 }).lean();

    res.status(200).json({ success: true, data: { applications } });
  } catch (error) { next(error); }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    // FIX (MEDIUM): Validate before DB hit
    if (!isValidId(applicationId))
      return res.status(400).json({ success: false, message: 'Invalid application ID.' });

    const VALID_STATUSES = ['applied', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'];
    if (!VALID_STATUSES.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid application status.' });

    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(403).json({ success: false, message: 'Employer profile not found.' });

    // Ownership check — employer can only update applications to their own jobs
    const application = await Application.findOne({ _id: applicationId, employer: employer._id });
    if (!application)
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized.' });

    application.status = status;
    if (notes !== undefined) application.notes = typeof notes === 'string' ? notes.slice(0, 2000) : '';
    await application.save();

    res.status(200).json({ success: true, message: `Candidate status updated to ${status}.`, data: { application } });
  } catch (error) { next(error); }
};
