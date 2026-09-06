import JobListing from '../models/JobListing.js';
import Employer from '../models/Employer.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const escapeRegex = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

// Allowlists for enum query params — used to validate before querying
const VALID_JOB_TYPES       = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const VALID_WORKPLACE_TYPES  = ['On-site', 'Remote', 'Hybrid'];
const VALID_EXP_LEVELS       = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Manager', 'Executive'];
const VALID_SORT_FIELDS      = ['createdAt', 'salary.max', 'employerTrustScore'];

export const getJobs = async (req, res, next) => {
  try {
    const { keyword, city, jobType, workplaceType, experienceLevel, verifiedOnly, minSalary,
            page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { status: 'active' };

    if (keyword?.trim()) {
      const s = escapeRegex(keyword.trim().slice(0, 200));
      query.$or = [
        { title:       { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { skills:      { $in: [new RegExp(s, 'i')] } },
      ];
    }

    if (city?.trim())
      query['location.city'] = { $regex: escapeRegex(city.trim().slice(0, 100)), $options: 'i' };

    // FIX (MEDIUM): Only apply enum filters after allowlist validation.
    // Previously any string was passed directly into the MongoDB query, allowing
    // users to probe internal field values with arbitrary strings.
    if (jobType && VALID_JOB_TYPES.includes(jobType))             query.jobType         = jobType;
    if (workplaceType && VALID_WORKPLACE_TYPES.includes(workplaceType)) query.workplaceType = workplaceType;
    if (experienceLevel && VALID_EXP_LEVELS.includes(experienceLevel)) query.experienceLevel = experienceLevel;
    if (verifiedOnly === 'true') query.isFromVerifiedEmployer = true;
    if (minSalary && Number(minSalary) > 0) query['salary.max'] = { $gte: Number(minSalary) };

    const pageNum  = Math.max(1, parseInt(page,  10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;
    const sortField = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const [jobs, total] = await Promise.all([
      JobListing.find(query)
        .populate('employer', 'companyName logo verificationStatus trustScore location')
        .sort({ [sortField]: sortOrder })
        .skip(skip).limit(limitNum).lean(),
      JobListing.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: { jobs, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } },
    });
  } catch (error) { next(error); }
};

export const getJobById = async (req, res, next) => {
  try {
    // FIX (MEDIUM): Validate ObjectId before querying — without this, an invalid
    // id like "not-an-id" causes Mongoose to throw a CastError which, before the
    // errorHandler fix, echoed the raw user value back in the response.
    if (!isValidId(req.params.id))
      return res.status(404).json({ success: false, message: 'Job listing not found.' });

    const job = await JobListing.findById(req.params.id)
      .populate('employer', 'companyName logo website industry companySize verificationStatus trustScore scoreBreakdown location totalSubmittedReports verifiedFraudReports')
      .lean();

    if (!job)
      return res.status(404).json({ success: false, message: 'Job listing not found.' });

    res.status(200).json({ success: true, data: { job } });
  } catch (error) { next(error); }
};

export const createJob = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(403).json({ success: false, message: 'Employer profile not found. Complete your profile before posting jobs.' });

    if (employer.isSuspended)
      return res.status(403).json({ success: false, message: 'Account is suspended from posting jobs due to safety violations.' });

    const { title, description, responsibilities, requirements, skills,
            jobType, workplaceType, experienceLevel, location, salary, openings, deadline } = req.body;

    if (!title || !description || !location?.city)
      return res.status(400).json({ success: false, message: 'Title, description, and city are required.' });

    const minSalary = Math.max(0, Number(salary?.min) || 0);
    const maxSalary = Math.max(0, Number(salary?.max) || 0);
    if (minSalary > 0 && maxSalary > 0 && minSalary > maxSalary)
      return res.status(400).json({ success: false, message: 'Minimum salary cannot exceed maximum salary.' });

    const cleanSkills = Array.isArray(skills)
      ? skills.filter(s => typeof s === 'string' && s.trim()).map(s => s.toLowerCase().trim().slice(0, 50)).slice(0, 30)
      : [];

    const isVerified = employer.verificationStatus === 'verified';

    const job = await JobListing.create({
      employer: employer._id,
      title:       String(title).trim().slice(0, 150),
      description: String(description).trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities.filter(r => typeof r === 'string').map(r => r.trim()).slice(0, 20) : [],
      requirements:     Array.isArray(requirements)     ? requirements.filter(r => typeof r === 'string').map(r => r.trim()).slice(0, 20) : [],
      skills: cleanSkills,
      jobType:         VALID_JOB_TYPES.includes(jobType)             ? jobType         : 'Full-time',
      workplaceType:   VALID_WORKPLACE_TYPES.includes(workplaceType)  ? workplaceType   : 'On-site',
      experienceLevel: VALID_EXP_LEVELS.includes(experienceLevel)    ? experienceLevel : 'Entry Level',
      location: { city: String(location.city).trim().slice(0, 100), state: String(location.state || '').trim(), country: String(location.country || 'India').trim() },
      salary:  { min: minSalary, max: maxSalary >= minSalary ? maxSalary : minSalary, currency: salary?.currency || 'INR', isNegotiable: !!salary?.isNegotiable },
      openings: Math.max(1, Math.min(1000, parseInt(openings, 10) || 1)),
      status: 'active',
      trustVerificationStatus: isVerified ? 'verified' : 'pending',
      isFromVerifiedEmployer: isVerified,
      employerTrustScore: employer.trustScore,
      deadline: deadline || null,
    });

    res.status(201).json({ success: true, message: 'Job listing posted successfully.', data: { job } });
  } catch (error) { next(error); }
};

export const updateJob = async (req, res, next) => {
  try {
    // FIX (MEDIUM): Validate ObjectId before query to avoid CastError disclosure
    if (!isValidId(req.params.id))
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized.' });

    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(403).json({ success: false, message: 'Employer profile not found.' });

    const job = await JobListing.findOne({ _id: req.params.id, employer: employer._id });
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized.' });

    const { title, description, responsibilities, requirements, skills,
            jobType, workplaceType, experienceLevel, location, salary, openings, status, deadline } = req.body;

    if (title !== undefined)       job.title = String(title).trim().slice(0, 150);
    if (description !== undefined) job.description = String(description).trim();
    if (Array.isArray(responsibilities)) job.responsibilities = responsibilities.filter(r => typeof r === 'string').map(r => r.trim()).slice(0, 20);
    if (Array.isArray(requirements))     job.requirements     = requirements.filter(r => typeof r === 'string').map(r => r.trim()).slice(0, 20);
    if (Array.isArray(skills))           job.skills = skills.filter(s => typeof s === 'string' && s.trim()).map(s => s.toLowerCase().trim().slice(0, 50)).slice(0, 30);
    if (jobType && VALID_JOB_TYPES.includes(jobType))             job.jobType         = jobType;
    if (workplaceType && VALID_WORKPLACE_TYPES.includes(workplaceType)) job.workplaceType = workplaceType;
    if (experienceLevel && VALID_EXP_LEVELS.includes(experienceLevel))  job.experienceLevel = experienceLevel;
    if (location && typeof location === 'object') job.location = { ...job.location, ...location };
    if (salary  && typeof salary === 'object')    job.salary   = { ...job.salary,   ...salary };
    if (openings !== undefined) job.openings = Math.max(1, Math.min(1000, parseInt(openings, 10) || 1));
    if (deadline !== undefined) job.deadline = deadline;
    // Employer can only set active/closed/draft — 'suspended' is system-only
    if (status && ['active', 'closed', 'draft'].includes(status)) job.status = status;

    await job.save();
    res.status(200).json({ success: true, message: 'Job listing updated.', data: { job } });
  } catch (error) { next(error); }
};

export const deleteJob = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id))
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized.' });

    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer)
      return res.status(403).json({ success: false, message: 'Employer profile not found.' });

    const job = await JobListing.findOneAndDelete({ _id: req.params.id, employer: employer._id });
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized.' });

    res.status(200).json({ success: true, message: 'Job listing removed.' });
  } catch (error) { next(error); }
};
