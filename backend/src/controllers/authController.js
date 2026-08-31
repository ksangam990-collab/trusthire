import User from '../models/User.js';
import Employer from '../models/Employer.js';
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, industry, companySize } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const assignedRole = role === 'employer' ? 'employer' : 'jobseeker';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole
    });

    let employerProfile = null;
    if (assignedRole === 'employer') {
      employerProfile = await Employer.create({
        user: user._id,
        companyName: companyName || `${name}'s Organization`,
        industry: industry || 'Information Technology',
        companySize: companySize || '11-50',
        verificationStatus: 'unverified',
        trustScore: 40
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          employerId: employerProfile ? employerProfile._id : null
        },
        token: accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    let employerProfile = null;
    if (user.role === 'employer') {
      employerProfile = await Employer.findOne({ user: user._id });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          employerId: employerProfile ? employerProfile._id : null,
          verificationStatus: employerProfile ? employerProfile.verificationStatus : null
        },
        token: accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided.'
      });
    }

    const decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: 'User session is invalid or user no longer exists.'
      });
    }

    let employerProfile = null;
    if (user.role === 'employer') {
      employerProfile = await Employer.findOne({ user: user._id });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          employerId: employerProfile ? employerProfile._id : null,
          verificationStatus: employerProfile ? employerProfile.verificationStatus : null
        },
        token: newAccessToken
      }
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({
      success: false,
      message: 'Refresh token is invalid or expired.'
    });
  }
};

export const logout = (req, res) => {
  clearRefreshTokenCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let employerProfile = null;

    if (user.role === 'employer') {
      employerProfile = await Employer.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          employerId: employerProfile ? employerProfile._id : null,
          verificationStatus: employerProfile ? employerProfile.verificationStatus : null,
          trustScore: employerProfile ? employerProfile.trustScore : null
        }
      }
    });
  } catch (error) {
    next(error);
  }
};