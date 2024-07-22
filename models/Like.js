const db = require('../config/db');

const checkIfLiked = async (userId, postId) => {
  const result = await db.query('SELECT * FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
  return result.rows.length > 0;
};

const addLike = async (userId, postId) => {
  await db.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
};

module.exports = {
  checkIfLiked,
  addLike,
};
