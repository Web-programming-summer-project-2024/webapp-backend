// models/Comment.js
const db = require('../config/db');

const createComment = async (text, author, postId) => {
  const result = await db.query(
    'INSERT INTO comments (text, author, post_id, date) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [text, author, postId]
  );
  return result.rows[0];
};

const getCommentsByPostId = async (postId) => {
  const result = await db.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY date ASC', [postId]);
  return result.rows;
};

const deleteComment = async (id) => {
  await db.query('DELETE FROM comments WHERE id = $1', [id]);
};

module.exports = {
  createComment,
  getCommentsByPostId,
  deleteComment,
};
