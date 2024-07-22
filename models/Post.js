const db = require('../config/db');

const createPost = async (title, description, author, imageUrl) => {
  const result = await db.query(
    'INSERT INTO posts (title, description, author, date, image_url) VALUES ($1, $2, $3, NOW(), $4) RETURNING *',
    [title, description, author, imageUrl]
  );
  return result.rows[0];
};

const getPosts = async () => {
  const result = await db.query('SELECT * FROM posts ORDER BY date DESC');
  return result.rows;
};

const getPostById = async (id) => {
  const result = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0];
};

const updatePost = async (id, title, description, imageUrl) => {
  const result = await db.query(
    'UPDATE posts SET title = $1, description = $2, image_url = $3, date = NOW() WHERE id = $4 RETURNING *',
    [title, description, imageUrl, id]
  );
  return result.rows[0];
};

const deletePost = async (id) => {
  await db.query('DELETE FROM posts WHERE id = $1', [id]);
};

const incrementLikes = async (id) => {
  const result = await db.query(
    'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};


const searchPosts = async (query) => {
  const result = await db.query(
    'SELECT * FROM posts WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY date DESC',
    [`%${query}%`]
  );
  return result.rows;
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  incrementLikes,
  searchPosts
};
