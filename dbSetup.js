// run node dbSetup-db

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Creates the necessary tables in the database if they do not already exist.
 * 
 * @returns {void}
 */
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reset_password_token VARCHAR(255),
        reset_password_expire TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        author INTEGER REFERENCES users(id),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image_url VARCHAR(255),
        likes INTEGER DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        author INTEGER REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id),
        UNIQUE (user_id, post_id)
      );
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  } finally {
    pool.end();
  }
};

createTables();
