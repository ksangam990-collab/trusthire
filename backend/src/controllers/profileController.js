import User from '../models/User.js';
import JobSeekerProfile from '../models/JobSeekerProfile.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
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

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
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
    let profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await JobSeekerProfile.create({
        userId: req.user._id,
        headline: '',
        summary: '',
        skills: [],
        education: [],
        experience: []
      });
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
    let profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new JobSeekerProfile({ userId: req.user._id });
    }

    const {
      headline,
      summary,
      skills,
      education,
      experience,
      resumeUrl,
      preferredLocations,
      preferredRoles,
      preferredJobType,
      salaryExpectation,
      isOpenToWork,
      noticePeriod
    } = req.body;

    if (headline !== undefined) profile.headline = headline;
    if (summary !== undefined) profile.summary = summary;
    if (Array.isArray(skills)) profile.skills = skills;
    if (Array.isArray(education)) profile.education = education;
    if (Array.isArray(experience)) profile.experience = experience;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (Array.isArray(preferredLocations)) profile.preferredLocations = preferredLocations;
    if (Array.isArray(preferredRoles)) profile.preferredRoles = preferredRoles;
    if (preferredJobType) profile.preferredJobType = preferredJobType;
    if (salaryExpectation) profile.salaryExpectation = salaryExpectation;
    if (isOpenToWork !== undefined) profile.isOpenToWork = Boolean(isOpenToWork);
    if (noticePeriod) profile.noticePeriod = noticePeriod;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Candidate profile updated successfully.',
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};