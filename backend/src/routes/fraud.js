import express from 'express';
import {
  submitReport,
  getPublicFraudBoard,
  updateReportStatus
} from '../controllers/fraudController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { uploadEvidence } from '../config/cloudinary.js';
import { reportLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/board', getPublicFraudBoard);
router.post(
  '/report',
  reportLimiter,
  optionalAuth,
  uploadEvidence.array('evidence', 4),
  submitReport
);
router.patch(
  '/reports/:reportId/status',
  authenticate,
  authorize('admin'),
  updateReportStatus
);

export default router;