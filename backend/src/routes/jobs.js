const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  updateJobStatus,
  getMyListings,
  toggleSaveJob,
} = require('../controllers/jobController');
const { applyToJob } = require('../controllers/applicationController');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth');

// Public
router.get('/', getJobs);
router.get('/:jobId', optionalAuth, getJob);

// Job seeker only
router.post('/:jobId/apply', protect, restrictTo('jobseeker'), applyToJob);
router.post('/:jobId/save', protect, restrictTo('jobseeker'), toggleSaveJob);

// Employer only
router.post('/', protect, restrictTo('employer'), createJob);
router.get('/employer/mine', protect, restrictTo('employer'), getMyListings);
router.patch('/:jobId', protect, restrictTo('employer'), updateJob);
router.patch('/:jobId/status', protect, restrictTo('employer'), updateJobStatus);

module.exports = router;
