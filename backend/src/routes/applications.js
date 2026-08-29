const express = require('express');
const router = express.Router();
const {
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/auth');

// Job seeker
router.get('/mine', protect, restrictTo('jobseeker'), getMyApplications);

// Employer
router.get('/job/:jobId', protect, restrictTo('employer'), getJobApplications);
router.patch('/:applicationId/status', protect, restrictTo('employer'), updateApplicationStatus);

module.exports = router;
