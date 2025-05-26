const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');
const {
  sendOtp,
  verifyOtp,
  signup,
  login,
  getUser,
  updatePassword
} = require('../controllers/authController');

router.post('/send-otp', rateLimiter, sendOtp);
router.post('/verify-otp', rateLimiter, verifyOtp);
router.post('/signup', rateLimiter, signup);
router.post('/login', rateLimiter, login);
router.post('/user-details', auth, getUser);
router.put('/update-password', auth, rateLimiter, updatePassword);

module.exports = router;
