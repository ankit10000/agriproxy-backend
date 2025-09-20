const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  deleteAccount
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const {
  updateProfileExtendedValidation,
  changePasswordValidation,
  deleteAccountValidation
} = require('../middleware/validation');
const { uploadAvatar: uploadAvatarMiddleware, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All routes are protected - require authentication
router.use(protect);

// Get user profile
router.get('/', getProfile);

// Update user profile
router.put('/', updateProfileExtendedValidation, updateProfile);

// Upload profile avatar
router.post('/avatar', uploadAvatarMiddleware.single('avatar'), handleUploadError, uploadAvatar);

// Delete profile avatar
router.delete('/avatar', deleteAvatar);

// Change password
router.put('/password', changePasswordValidation, changePassword);

// Delete account
router.delete('/account', deleteAccountValidation, deleteAccount);

module.exports = router;