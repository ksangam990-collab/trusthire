const express = require('express');
const router = express.Router();
const {
  submitReport,
  getEmployerFraudSummary,
  getAllReports,
  reviewReport,
} = require('../controllers/fraudController');
const { protect, restrictTo } = require('../middleware/auth');
const { fraudReportLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../config/cloudinary');

// Public
router.get('/employer/:employerId', getEmployerFraudSummary);

// Job seeker — submit report with optional evidence files
router.post(
  '/',
  protect,
  restrictTo('jobseeker'),
  fraudReportLimiter,
  upload.array('evidence', 3),
  submitReport
);

// Admin only
router.get('/admin/all', protect, restrictTo('admin'), getAllReports);
router.patch('/admin/:reportId', protect, restrictTo('admin'), reviewReport);

module.exports = router;
