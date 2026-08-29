const { z } = require('zod');
const crypto = require('crypto');
const User = require('../models/User');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const Employer = require('../models/Employer');
const { sendTokenResponse, generateRandomToken, hashToken } = require('../utils/jwt');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../services/emailService');

// ── Validation Schemas ────────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['jobseeker', 'employer']),
  companyName: z.string().min(2).max(200).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

// ── Register ──────────────────────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Employer must provide company name
    if (data.role === 'employer' && !data.companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required for employer accounts.',
      });
    }

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Generate email verification token
    const rawToken = generateRandomToken();
    const hashedToken = hashToken(rawToken);

    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      role: data.role,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Create role-specific profile
    if (data.role === 'jobseeker') {
      await JobSeekerProfile.create({ userId: user._id });
    } else if (data.role === 'employer') {
      await Employer.create({
        userId: user._id,
        companyName: data.companyName,
      });
    }

    // Send verification email (non-blocking)
    sendVerificationEmail(user, rawToken).catch((err) =>
      console.error('Verification email failed:', err.message)
    );

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+passwordHash +isActive');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ── Verify Email ──────────────────────────────────────────────────────────────
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token missing.' });
    }

    const hashedToken = hashToken(token);
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification link. Request a new one.',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Resend Verification Email ─────────────────────────────────────────────────
exports.resendVerification = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified.' });
    }

    const rawToken = generateRandomToken();
    user.emailVerificationToken = hashToken(rawToken);
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(user, rawToken);
    res.json({ success: true, message: 'Verification email sent.' });
  } catch (error) {
    next(error);
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    const rawToken = generateRandomToken();
    user.passwordResetToken = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user, rawToken);
    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

// ── Reset Password ────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const schema = z.object({
      token: z.string(),
      password: z
        .string()
        .min(8)
        .regex(/[A-Z]/, 'Must contain uppercase')
        .regex(/[0-9]/, 'Must contain a number'),
    });
    const { token, password } = schema.parse(req.body);

    const hashedToken = hashToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired.',
      });
    }

    user.passwordHash = password; // pre-save hook will hash it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. Please log in.' });
  } catch (error) {
    next(error);
  }
};

// ── Get Current User ──────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// ── Logout ────────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully.' });
};
