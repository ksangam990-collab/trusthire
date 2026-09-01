import JobListing from '../models/JobListing.js';
import Employer from '../models/Employer.js';

const escapeRegex = (string) => {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      jobType,
      workplaceType,
      experienceLevel,
      verifiedOnly,
      minSalary,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {
      status: 'active'
    };

    if (keyword && keyword.trim()) {
      const sanitized = escapeRegex(keyword.trim());
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { skills: { $in: [new RegExp(sanitized, 'i')] } }
      ];
    }

    if (city && city.trim()) {
      query['location.city'] = { $regex: escapeRegex(city.trim()), $options: 'i' };
    }

    if (jobType) query.jobType = jobType;
    if (workplaceType) query.workplaceType = workplaceType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (verifiedOnly === 'true') query.isFromVerifiedEmployer = true;
    if (minSalary && Number(minSalary) > 0) {
      query['salary.max'] = { $gte: Number(minSalary) };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortField = ['createdAt', 'salary.max', 'employerTrustScore'].includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const [jobs, total] = await Promise.all([
      JobListing.find(query)
        .populate('employer', 'companyName logo verificationStatus trustScore location')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      JobListing.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        jobs,
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

export const getJobById = async (req, res, next) => {
  try {
    const job = await JobListing.findById(req.params.id)
      .populate('employer', 'companyName logo website industry companySize verificationStatus trustScore scoreBreakdown location totalSubmittedReports verifiedFraudReports')
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer) {
      return res.status(403).json({
        success: false,
        message: 'Employer profile not found. Complete your profile before posting jobs.'
      });
    }

    if (employer.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended from posting jobs due to safety violations.'
      });
    }

    const {
      title,
      description,
      responsibilities,
      requirements,
      skills,
      jobType,
      workplaceType,
      experienceLevel,
      location,
      salary,
      openings,
      deadline
    } = req.body;

    if (!title || !description || !location?.city) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and city location are required.'
      });
    }

    const isVerified = employer.verificationStatus === 'verified';

    const job = await JobListing.create({
      employer: employer._id,
      title,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      skills: Array.isArray(skills) ? skills.map(s => s.toLowerCase().trim()) : [],
      jobType: jobType || 'Full-time',
      workplaceType: workplaceType || 'On-site',
      experienceLevel: experienceLevel || 'Entry Level',
      location: {
        city: location.city,
        state: location.state || '',
        country: location.country || 'India'
      },
      salary: {
        min: salary?.min || 0,
        max: salary?.max || 0,
        currency: salary?.currency || 'INR',
        isNegotiable: !!salary?.isNegotiable
      },
      openings: openings || 1,
      status: 'active',
      trustVerificationStatus: isVerified ? 'verified' : 'pending',
      isFromVerifiedEmployer: isVerified,
      employerTrustScore: employer.trustScore,
      deadline: deadline || null
    });

    res.status(201).json({
      success: true,
      message: 'Job listing posted successfully.',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer) {
      return res.status(403).json({ success: false, message: 'Employer profile not found.' });
    }

    const job = await JobListing.findOne({ _id: req.params.id, employer: employer._id });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized.' });
    }

    const updates = req.body;
    // Protect trust status invariants
    delete updates.employer;
    delete updates.isFromVerifiedEmployer;
    delete updates.employerTrustScore;
    delete updates.verifiedFraudCount;

    Object.assign(job, updates);
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job listing updated.',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    if (!employer) {
      return res.status(403).json({ success: false, message: 'Employer profile not found.' });
    }

    const job = await JobListing.findOneAndDelete({ _id: req.params.id, employer: employer._id });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized.' });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing removed.'
    });
  } catch (error) {
    next(error);
  }
};