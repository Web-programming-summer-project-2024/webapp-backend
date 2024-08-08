const express = require('express');
const { check } = require('express-validator');
const { register, login, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');
const router = express.Router();

router.post('/register', [
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], validate, register);

router.post('/login', [
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').exists().withMessage('Password is required')
], validate, login);

router.post('/forgotpassword', [
  check('email').isEmail().withMessage('Please include a valid email')
], validate, forgotPassword);

router.post('/verify-otp', [
  check('otp').not().isEmpty().withMessage('OTP is required')
], validate, verifyOtp);

router.put('/resetpassword', [
  check('otp').not().isEmpty().withMessage('OTP is required'),
  check('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], validate, resetPassword);

module.exports = router;
