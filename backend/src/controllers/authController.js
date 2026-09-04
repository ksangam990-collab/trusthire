import User from '../models/User.js';
import Employer from '../models/Employer.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/jwt.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';

// ─── register ─────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, industry, companySize } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)
      return res.status(400).json({ success: false, message: 'Name must be between 2 and 100 characters.' });

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser)
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

    const assignedRole = role === 'employer' ? 'employer' : 'jobseeker';
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
    });

    let employerProfile = null;
    if (assignedRole === 'employer') {
      employerProfile = await Employer.create({
        user: user._id,
        userId: user._id,
        companyName: companyName ? String(companyName).trim().slice(0, 120) : `${name.trim()}'s Organization`,
        industry: industry || 'Information Technology',
        companySize: companySize || '11-50',
        verificationStatus: 'unverified',
        trustScore: 40,
      });
    }

    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user: {
          id: user._id, name: user.name, email: user.email, role: user.role,
          avatar: user.avatar, employerId: employerProfile?._id ?? null,
        },
        token: accessToken,
      },
    });
  } catch (error) { next(error); }
};

// ─── login ────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });

    let employerProfile = null;
    if (user.role === 'employer') employerProfile = await Employer.findOne({ user: user._id });

    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          id: user._id, name: user.name, email: user.email, role: user.role,
          avatar: user.avatar,
          employerId: employerProfile?._id ?? null,
          verificationStatus: employerProfile?.verificationStatus ?? null,
        },
        token: accessToken,
      },
    });
  } catch (error) { next(error); }
};

// ─── refreshToken ─────────────────────────────────────────────────────────────
export const refreshToken = async (req, res, next) => {
  try {
    const incoming = req.cookies.refreshToken;
    if (!incoming)
      return res.status(401).json({ success: false, message: 'No refresh token provided.' });

    let decoded;
    try {
      decoded = jwt.verify(incoming, process.env.JWT_REFRESH_SECRET);
    } catch {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ success: false, message: 'Refresh token is invalid or expired.' });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ success: false, message: 'User session invalid or account no longer exists.' });
    }

    let employerProfile = null;
    if (user.role === 'employer') employerProfile = await Employer.findOne({ user: user._id });

    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id, name: user.name, email: user.email, role: user.role,
          avatar: user.avatar,
          employerId: employerProfile?._id ?? null,
          verificationStatus: employerProfile?.verificationStatus ?? null,
        },
        token: newAccessToken,
      },
    });
  } catch (error) { next(error); }
};

// ─── logout ───────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  clearRefreshTokenCookie(res);
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// ─── getCurrentUser ───────────────────────────────────────────────────────────
// FIX (MEDIUM): Added null guard — if the user was deleted after the token
// was issued, findById returns null and accessing user.role throws a crash.
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User account no longer exists.' });

    let employerProfile = null;
    if (user.role === 'employer') employerProfile = await Employer.findOne({ user: user._id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id, name: user.name, email: user.email, role: user.role,
          avatar: user.avatar,
          employerId: employerProfile?._id ?? null,
          verificationStatus: employerProfile?.verificationStatus ?? null,
          trustScore: employerProfile?.trustScore ?? null,
        },
      },
    });
  } catch (error) { next(error); }
};

// ─── forgotPassword ───────────────────────────────────────────────────────────
// FIX (CRITICAL): Previously generated and stored the reset token but
// NEVER called sendPasswordResetEmail — the entire password reset flow was
// silently broken. Every user who requested a reset got a success message but
// received no email.
//
// FIX (HIGH): Token now carries type: 'password_reset' so that a live access
// token (signed with the same JWT_SECRET) cannot be used as a reset token.
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email address is required.' });

    // Always return the same response to prevent user enumeration
    const safe = { success: true, message: 'If an account with that email exists, a password reset link has been sent.' };

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(200).json(safe);

    // Issue a purpose-bound reset token (type discriminator prevents reuse of access tokens)
    const resetToken = jwt.sign(
      { id: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    user.passwordResetToken   = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // CRITICAL FIX: actually send the email (was missing)
    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json(safe);
  } catch (error) { next(error); }
};

// ─── resetPassword ────────────────────────────────────────────────────────────
// FIX (HIGH): Added decoded.type !== 'password_reset' check.
// Previously any valid access token could be used here — now only tokens
// explicitly issued for password_reset are accepted.
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });

    if (typeof newPassword !== 'string' || newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired.' });
    }

    // Enforce purpose binding — reject any token not explicitly for password_reset
    if (decoded.type !== 'password_reset')
      return res.status(400).json({ success: false, message: 'Invalid token type. Please request a new reset link.' });

    const user = await User.findOne({
      _id: decoded.id,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired.' });

    user.password             = newPassword;
    user.passwordResetToken   = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset. Please log in with your new credentials.' });
  } catch (error) { next(error); }
};
