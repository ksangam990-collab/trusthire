import User from '../models/User.js';
import JobSeekerProfile from '../models/JobSeekerProfile.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getJobSeekerProfile = async (req, res, next) => {
  try {
    let profile = await JobSeekerProfile.findOne({ userId: req.user._id })
      .populate('userId', 'name email avatar phone');

    if (!profile) {
      profile = await JobSeekerProfile.create({ userId: req.user._id });
      profile = await JobSeekerProfile.findById(profile._id)
        .populate('userId', 'name email avatar phone');
    }

    res.status(200).json({
      success: true,
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobSeekerProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'headline', 'summary', 'skills', 'education', 'experience',
      'resumeUrl', 'preferredLocations', 'preferredRoles',
      'preferredJobType', 'salaryExpectation', 'isOpenToWork', 'noticePeriod'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    let profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new JobSeekerProfile({ userId: req.user._id, ...updates });
    } else {
      Object.assign(profile, updates);
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};