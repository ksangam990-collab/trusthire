import express from 'express';
import {
  submitReport,
  getPublicFraudBoard,
  updateReportStatus,
  getAllReportsAdmin,
  getAdminMetrics
} from '../controllers/fraudController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { uploadEvidenceMiddleware } from '../config/cloudinary.js';
import { reportLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/board',          getPublicFraudBoard);
router.get('/admin/metrics',  authenticate, authorize('admin'), getAdminMetrics);
router.get('/admin/reports',  authenticate, authorize('admin'), getAllReportsAdmin);

router.post(
  '/report',
  reportLimiter,
  optionalAuth,
  uploadEvidenceMiddleware,   // FIX: single composed middleware, not array
  submitReport
);

router.patch(
  '/reports/:reportId/status',
  authenticate,
  authorize('admin'),
  updateReportStatus
);

export default router;
