import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticate, getUserProfile);
router.put('/me', authenticate, updateUserProfile);

export default router;