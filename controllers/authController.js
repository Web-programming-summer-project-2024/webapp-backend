
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');


/**
 * This function handles user registration.
 * It first checks if a user with the provided email already exists.
 * If not, it creates a new user and returns the user data and a JWT token.
 */
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.createUser(email, password);

    const userResponse = { ...user };
    delete userResponse.password;

    res.json({ user: userResponse });
  } catch (error) {
    next(error);
  }
};


/**
 * This function handles user login.
 * It checks if the provided email and password match a user in the database.
 * If they do, it returns a success message and a JWT token.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user.id, user.email);

      res.cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
        .status(200)
        .json({ message: 'Logged in successfully!', token: token }); // Attach the token to the response
    } else {
      return res.status(400).json({ message: 'User not found or password incorrect' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This function handles the forgot password process.
 * It generates a reset token and saves it to the user's record in the database.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findUserByEmail(req.body.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    await user.save();

    // Send reset password email...
  } catch (error) {
    next(error);
  }
};

/**
 * This function handles the reset password process.
 * It checks if the provided reset token is valid and updates the user's password.
 */
const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({ success: true, data: 'Password reset success' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
