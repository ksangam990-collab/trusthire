import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getJobSeekerProfile,
  updateJobSeekerProfile
} from '../controllers/profileController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticate, getUserProfile);
router.put('/me', authenticate, updateUserProfile);
router.get('/candidate', authenticate, authorize('jobseeker', 'admin'), getJobSeekerProfile);
router.put('/candidate', authenticate, authorize('jobseeker', 'admin'), updateJobSeekerProfile);

export default router;