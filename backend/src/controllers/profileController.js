import User from '../models/User.js';
import JobSeekerProfile from '../models/JobSeekerProfile.js';

const isValidHttpUrl = (str) => {
  try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, data: { user } });
  } catch (error) { next(error); }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (trimmed.length < 2 || trimmed.length > 100)
        return res.status(400).json({ success: false, message: 'Name must be between 2 and 100 characters.' });
      user.name = trimmed;
    }
    if (phone !== undefined) user.phone = String(phone).trim().slice(0, 20);

    // FIX (HIGH): Only accept HTTPS URLs for avatars — prevents javascript:,
    // data:, and file:// URIs being stored and rendered in the UI.
    if (avatar !== undefined) {
      const avatarStr = String(avatar || '').trim();
      if (avatarStr && !avatarStr.startsWith('https://'))
        return res.status(400).json({ success: false, message: 'Avatar must be a valid HTTPS URL.' });
      user.avatar = avatarStr;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated.',
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone } },
    });
  } catch (error) { next(error); }
};

export const getJobSeekerProfile = async (req, res, next) => {
  try {
    let profile = await JobSeekerProfile.findOne({ userId: req.user._id }).populate('userId', 'name email avatar phone');
    if (!profile) {
      profile = await JobSeekerProfile.create({ userId: req.user._id });
      profile  = await JobSeekerProfile.findById(profile._id).populate('userId', 'name email avatar phone');
    }
    res.status(200).json({ success: true, data: { profile } });
  } catch (error) { next(error); }
};

export const updateJobSeekerProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'headline', 'summary', 'skills', 'education', 'experience',
      'resumeUrl', 'preferredLocations', 'preferredRoles',
      'preferredJobType', 'salaryExpectation', 'isOpenToWork', 'noticePeriod',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // FIX (HIGH): Validate resumeUrl to http/https only
    if (updates.resumeUrl && typeof updates.resumeUrl === 'string' && updates.resumeUrl.trim()) {
      if (!isValidHttpUrl(updates.resumeUrl.trim()))
        return res.status(400).json({ success: false, message: 'Resume URL must be a valid HTTP or HTTPS URL.' });
      updates.resumeUrl = updates.resumeUrl.trim();
    }

    let profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    if (!profile) profile = new JobSeekerProfile({ userId: req.user._id, ...updates });
    else Object.assign(profile, updates);

    await profile.save();
    res.status(200).json({ success: true, message: 'Profile updated.', data: { profile } });
  } catch (error) { next(error); }
};
