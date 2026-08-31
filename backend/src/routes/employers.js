import express from 'express';
import {
  getEmployerProfile,
  updateEmployerProfile,
  verifyEmployerSimulation,
  getEmployerDashboardMetrics
} from '../controllers/employerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, authorize('employer', 'admin'), getEmployerProfile);
router.put('/profile', authenticate, authorize('employer', 'admin'), updateEmployerProfile);
router.post('/verify', authenticate, authorize('employer', 'admin'), verifyEmployerSimulation);
router.get('/metrics', authenticate, authorize('employer', 'admin'), getEmployerDashboardMetrics);

export default router;