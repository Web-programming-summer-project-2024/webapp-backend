
const express = require('express');
const { check, validationResult } = require('express-validator');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation error", errors: errors.array() });
  }
  next();
};

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, [
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ], validateRequest, updateUserProfile);

module.exports = router;
