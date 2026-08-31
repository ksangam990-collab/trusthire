import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', authenticate, authorize('employer', 'admin'), createJob);
router.put('/:id', authenticate, authorize('employer', 'admin'), updateJob);
router.delete('/:id', authenticate, authorize('employer', 'admin'), deleteJob);

export default router;