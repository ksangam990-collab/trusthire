const { z } = require('zod');
const JobListing = require('../models/JobListing');
const Employer = require('../models/Employer');
const JobSeekerProfile = require('../models/JobSeekerProfile');


// Escape special regex characters to prevent ReDoS attacks
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\const jobSchema = z.object({');
const jobSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(50).max(5000),
  responsibilities: z.string().max(3000).optional(),
  requirements: z.string().max(3000).optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    isRemote: z.boolean().default(false),
  }),
  salaryRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    isDisclosed: z.boolean().default(true),
  }).optional(),
  jobType: z.enum(['fulltime', 'parttime', 'internship', 'contract', 'freelance']),
  experienceLevel: z.enum(['fresher', '1-2', '2-5', '5-10', '10+']).default('fresher'),
  skills: z.array(z.string()).max(15).optional(),
  education: z.string().optional(),
  openings: z.number().int().min(1).max(100).default(1),
  applyMethod: z.enum(['platform', 'email', 'external']).default('platform'),
  applyEmail: z.string().email().optional(),
  applyLink: z.string().url().optional(),
  closesAt: z.string().datetime().optional(),
});

// ── Create Job Listing ────────────────────────────────────────────────────────
exports.createJob = async (req, res, next) => {
  try {
    const data = jobSchema.parse(req.body);

    const employer = await Employer.findOne({ userId: req.user._id });
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer profile not found.' });
    }

    if (employer.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended. You cannot post jobs.',
      });
    }

    const job = await JobListing.create({
      ...data,
      employerId: employer._id,
      isFromVerifiedEmployer: employer.verificationStatus === 'verified',
    });

    // Update employer listing count
    await Employer.findByIdAndUpdate(employer._id, {
      $inc: { totalListings: 1, activeListings: 1 },
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// ── Search / List Jobs (Public) ───────────────────────────────────────────────
exports.getJobs = async (req, res, next) => {
  try {
    const {
      q,
      city,
      state,
      jobType,
      experienceLevel,
      verifiedOnly,
      remote,
      salaryMin,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { status: 'active' };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Location filters
    if (city) query['location.city'] = { $regex: escapeRegex(city), $options: 'i' };
    if (state) query['location.state'] = { $regex: escapeRegex(state), $options: 'i' };
    if (remote === 'true') query['location.isRemote'] = true;

    // Type filters
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (verifiedOnly === 'true') query.isFromVerifiedEmployer = true;

    // Salary filter
    if (salaryMin) {
      query['salaryRange.min'] = { $gte: parseInt(salaryMin) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      JobListing.find(query)
        .populate({
          path: 'employerId',
          select: 'companyName verificationStatus trustScore fraudReportCount logoUrl',
        })
        .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      JobListing.countDocuments(query),
    ]);

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Job ────────────────────────────────────────────────────────────
exports.getJob = async (req, res, next) => {
  try {
    const job = await JobListing.findById(req.params.jobId).populate({
      path: 'employerId',
      select:
        'companyName verificationStatus trustScore fraudReportCount verifiedReportCount logoUrl industry companySize website description verificationData',
    });

    if (!job || job.status === 'suspended') {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Increment view count (fire and forget)
    JobListing.findByIdAndUpdate(job._id, { $inc: { viewCount: 1 } }).exec();

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// ── Update Job ────────────────────────────────────────────────────────────────
exports.updateJob = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ userId: req.user._id });
    const job = await JobListing.findById(req.params.jobId);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (!job.employerId.equals(employer._id)) {
      return res.status(403).json({ success: false, message: 'Not your listing.' });
    }

    const allowedUpdates = jobSchema.partial().parse(req.body);
    Object.assign(job, allowedUpdates);
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// ── Close / Delete Job ────────────────────────────────────────────────────────
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = z
      .object({ status: z.enum(['active', 'closed', 'draft']) })
      .parse(req.body);

    const employer = await Employer.findOne({ userId: req.user._id });
    const job = await JobListing.findById(req.params.jobId);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (!job.employerId.equals(employer._id)) {
      return res.status(403).json({ success: false, message: 'Not your listing.' });
    }

    const wasActive = job.status === 'active';
    job.status = status;
    await job.save();

    // Update employer active count
    if (wasActive && status !== 'active') {
      await Employer.findByIdAndUpdate(employer._id, { $inc: { activeListings: -1 } });
    } else if (!wasActive && status === 'active') {
      await Employer.findByIdAndUpdate(employer._id, { $inc: { activeListings: 1 } });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// ── Employer's Own Listings ───────────────────────────────────────────────────
exports.getMyListings = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ userId: req.user._id });
    if (!employer) return res.status(404).json({ success: false, message: 'Not found.' });

    const { status = 'active', page = 1, limit = 20 } = req.query;
    const query = { employerId: employer._id };
    if (status !== 'all') query.status = status;

    const jobs = await JobListing.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

// ── Save / Unsave Job ─────────────────────────────────────────────────────────
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

    const jobId = req.params.jobId;
    const isSaved = profile.savedJobs.includes(jobId);

    if (isSaved) {
      profile.savedJobs.pull(jobId);
      await JobListing.findByIdAndUpdate(jobId, { $inc: { savedCount: -1 } });
    } else {
      profile.savedJobs.push(jobId);
      await JobListing.findByIdAndUpdate(jobId, { $inc: { savedCount: 1 } });
    }

    await profile.save();

    res.json({
      success: true,
      saved: !isSaved,
      message: isSaved ? 'Job removed from saved.' : 'Job saved.',
    });
  } catch (error) {
    next(error);
  }
};
