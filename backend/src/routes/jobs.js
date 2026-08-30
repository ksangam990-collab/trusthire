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

// Static routes MUST come before dynamic /:jobId to avoid conflicts
router.get('/', getJobs);
router.get('/employer/mine', protect, restrictTo('employer'), getMyListings);

// Dynamic routes
router.get('/:jobId', optionalAuth, getJob);
router.post('/:jobId/apply', protect, restrictTo('jobseeker'), applyToJob);
router.post('/:jobId/save', protect, restrictTo('jobseeker'), toggleSaveJob);
router.patch('/:jobId', protect, restrictTo('employer'), updateJob);
router.patch('/:jobId/status', protect, restrictTo('employer'), updateJobStatus);

// Employer only
router.post('/', protect, restrictTo('employer'), createJob);

module.exports = router;
