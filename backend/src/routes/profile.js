const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateProfile,
  uploadResume,
  updateUserInfo,
} = require('../controllers/profileController');
const { protect, restrictTo } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.use(protect, restrictTo('jobseeker'));

router.get('/me', getMyProfile);
router.patch('/me', updateProfile);
router.patch('/me/user', updateUserInfo);
router.post('/me/resume', upload.single('resume'), uploadResume);

module.exports = router;
