// backend/src/routes/jobs.js
const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getJobs);
router.post('/', authenticate, authorize('employer', 'admin'), createJob);

module.exports = router;