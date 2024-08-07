// models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Creates a new user with the given email and password.
 * The password is hashed before being stored in the database.
 * 
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object} The created user.
 */
const createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );
  return result.rows[0];
};

/**
 * Finds a user by their email.
 * 
 * @param {string} email - The user's email.
 * @returns {Object} The user found.
 */
const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

/**
 * Updates the email and password of a user identified by their ID.
 * The password is hashed before being stored in the database.
 * 
 * @param {number} id - The user's ID.
 * @param {string} email - The new email.
 * @param {string} password - The new password.
 * @returns {Object} The updated user.
 */
const updateUser = async (id, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *',
    [email, hashedPassword, id]
  );
  return result.rows[0];
};

/**
 * Updates the reset token and expiration for a user identified by their email.
 * 
 * @param {string} email - The user's email.
 * @param {string} resetPasswordToken - The hashed reset token.
 * @param {number} resetPasswordExpire - The expiration timestamp of the reset token.
 */
const updateResetToken = async (email, resetPasswordToken, resetPasswordExpire) => {
  await db.query(
    'UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE email = $3',
    [resetPasswordToken, resetPasswordExpire, email]
  );
};

/**
 * Finds a user by their reset token.
 * 
 * @param {string} resetPasswordToken - The hashed reset token.
 * @returns {Object} The user found.
 */
const findUserByResetToken = async (resetPasswordToken) => {
  const result = await db.query(
    'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > $2',
    [resetPasswordToken, new Date()]
  );
  return result.rows[0];
};

/**
 * Updates the user's password and clears the reset token and expiration.
 * The password is hashed before being stored in the database.
 * 
 * @param {string} email - The user's email.
 * @param {string} newPassword - The new password.
 */
const updatePasswordAndClearResetToken = async (email, newPassword) => {
  await db.query(
    'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE email = $2',
    [newPassword, email]
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
  updateResetToken,
  findUserByResetToken,
  updatePasswordAndClearResetToken
};
