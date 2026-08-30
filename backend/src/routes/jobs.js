// backend/src/routes/jobs.js
import express from 'express';
import { createJob, getJobs } from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public: Get all verified jobs with filters
router.get('/', getJobs);

// Protected: Only authenticated employers can post jobs
router.post('/', authenticate, authorize('employer', 'admin'), createJob);

export default router;