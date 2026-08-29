const express = require('express');
const router = express.Router();
const {
  verifyEmployer,
  getMyProfile,
  getPublicProfile,
  updateProfile,
} = require('../controllers/employerController');
const { protect, restrictTo } = require('../middleware/auth');

// Public
router.get('/:employerId/profile', getPublicProfile);

// Employer-only
router.use(protect, restrictTo('employer'));
router.get('/me', getMyProfile);
router.post('/verify', verifyEmployer);
router.patch('/me', updateProfile);

module.exports = router;
