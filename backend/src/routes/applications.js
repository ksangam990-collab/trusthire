import express from 'express';
import {
  applyToJob,
  getCandidateApplications,
  getJobApplicantsForEmployer,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadResume } from '../config/cloudinary.js';

const router = express.Router();

router.post(
  '/apply',
  authenticate,
  authorize('jobseeker'),
  uploadResume.single('resume'),
  applyToJob
);
router.get('/my-applications', authenticate, authorize('jobseeker'), getCandidateApplications);
router.get('/employer/candidates', authenticate, authorize('employer', 'admin'), getJobApplicantsForEmployer);
router.get('/employer/candidates/:jobId', authenticate, authorize('employer', 'admin'), getJobApplicantsForEmployer);
router.patch('/status/:applicationId', authenticate, authorize('employer', 'admin'), updateApplicationStatus);

export default router;