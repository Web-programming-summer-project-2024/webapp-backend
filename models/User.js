// models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (email, password) => {

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const updateUser = async (id, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *',
    [email, hashedPassword, id]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUser
};
