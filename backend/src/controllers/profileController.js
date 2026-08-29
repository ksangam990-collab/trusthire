const { z } = require('zod');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const User = require('../models/User');
const { uploadToCloudinary } = require('../config/cloudinary');

// ── Get My Profile ────────────────────────────────────────────────────────────
exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    res.json({ success: true, profile, user: req.user });
  } catch (error) {
    next(error);
  }
};

// ── Update Profile ────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const schema = z.object({
      headline: z.string().max(200).optional(),
      summary: z.string().max(1000).optional(),
      skills: z.array(z.string()).max(30).optional(),
      education: z.array(z.object({
        institution: z.string(),
        degree: z.string(),
        field: z.string().optional(),
        startYear: z.number().optional(),
        endYear: z.number().optional(),
        isCurrently: z.boolean().default(false),
      })).optional(),
      experience: z.array(z.object({
        company: z.string(),
        role: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isCurrently: z.boolean().default(false),
        description: z.string().optional(),
      })).optional(),
      preferredLocations: z.array(z.string()).optional(),
      preferredRoles: z.array(z.string()).optional(),
      preferredJobType: z.enum(['fulltime', 'parttime', 'internship', 'contract', 'any']).optional(),
      salaryExpectation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
      }).optional(),
      isOpenToWork: z.boolean().optional(),
      noticePeriod: z.enum(['immediate', '15days', '1month', '2months', '3months']).optional(),
    });

    const updates = schema.parse(req.body);

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// ── Upload Resume ─────────────────────────────────────────────────────────────
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { resumeUrl: result.secure_url },
      { new: true }
    );

    res.json({
      success: true,
      resumeUrl: result.secure_url,
      message: 'Resume uploaded successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Update User Info (name, phone, location) ─────────────────────────────────
exports.updateUserInfo = async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2).max(100).optional(),
      phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone').optional(),
      city: z.string().optional(),
      state: z.string().optional(),
    });

    const { name, phone, city, state } = schema.parse(req.body);

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (city || state) updates.location = { city, state };

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
