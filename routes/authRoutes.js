const express = require('express');
const { check, validationResult } = require('express-validator');
const { register, login, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');
const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation error", errors: errors.array() });
  }
  next();
};

router.post('/register', [
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], validateRequest, register);

router.post('/login', [
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').exists().withMessage('Password is required')
], validateRequest, login);

router.post('/forgotpassword', [
  check('email').isEmail().withMessage('Please include a valid email')
], validateRequest, forgotPassword);

router.post('/verify-otp', [
  check('otp').not().isEmpty().withMessage('OTP is required')
], validateRequest, verifyOtp);

router.put('/resetpassword', [
  check('otp').not().isEmpty().withMessage('OTP is required'),
  check('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], validateRequest, resetPassword);

module.exports = router;
