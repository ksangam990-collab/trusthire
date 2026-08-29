const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', protect, resendVerification);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
