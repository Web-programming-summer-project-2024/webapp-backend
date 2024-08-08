
const express = require('express');
const { check } = require('express-validator');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, [
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ], validate, updateUserProfile);

module.exports = router;
