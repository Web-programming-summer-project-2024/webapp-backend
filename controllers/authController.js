const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
 * It generates an OTP and saves it to the user's record in the database.
 * It then sends an email to the user with the OTP.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findUserByEmail(req.body.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = crypto.randomBytes(3).toString('hex'); // Generates a 6-character OTP
    const resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    await User.updateResetToken(user.email, resetPasswordToken, resetPasswordExpire);

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please use the following OTP to reset your password: \n\n ${otp}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        message,
      });

      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      console.log(error);
      await User.updateResetToken(user.email, null, null);
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This function verifies the OTP (verification code).
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const user = await User.findUserByResetToken(hashedOtp);

    if (!user || user.reset_password_expire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
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
    const { otp, newPassword } = req.body;
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const user = await User.findUserByResetToken(hashedOtp);

    if (!user || user.reset_password_expire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePasswordAndClearResetToken(user.email, hashedPassword);

    const token = generateToken(user.id, user.email);

    res.status(201).json({ success: true, message: 'Password reset success', token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
