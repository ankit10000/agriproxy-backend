const express = require('express');
const {
  signup,
  login,
  getProfile,
  updateProfile,
  logout,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  signupValidation,
  loginValidation,
  updateProfileValidation
} = require('../middleware/validation');

const router = express.Router();

router.post('/signup', signupValidation, signup);

router.post('/login', loginValidation, login);

router.get('/profile', protect, getProfile);

router.put('/profile', protect, updateProfileValidation, updateProfile);

router.post('/logout', logout);

router.delete('/account', protect, deleteAccount);

module.exports = router;