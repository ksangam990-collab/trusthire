import express from 'express';
import {
  applyToJob,
  getCandidateApplications,
  getJobApplicantsForEmployer,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadResumeMiddleware } from '../config/cloudinary.js';

const router = express.Router();

router.post(
  '/apply',
  authenticate,
  authorize('jobseeker'),
  uploadResumeMiddleware,     // FIX: single composed middleware, not array
  applyToJob
);
router.get('/my-applications',        authenticate, authorize('jobseeker'),           getCandidateApplications);
router.get('/employer/candidates',    authenticate, authorize('employer', 'admin'),   getJobApplicantsForEmployer);
router.get('/employer/candidates/:jobId', authenticate, authorize('employer', 'admin'), getJobApplicantsForEmployer);
router.patch('/status/:applicationId', authenticate, authorize('employer', 'admin'),  updateApplicationStatus);

export default router;
