
const User = require('../models/User');


/**
 * This function handles getting a user's profile.
 * It finds the user in the database using the email from the request,
 * and returns the user data if the user exists.
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * This function updates a user's profile.
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.updateUser(req.user.id, email, password);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
