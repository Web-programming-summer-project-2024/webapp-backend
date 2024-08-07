
// run node seed-db

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Creates an admin user if one does not already exist.
 * 
 * @returns {Promise<Object>} The admin user object.
 */
const createAdminUser = async () => {
  const email = 'admin@example.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING *',
      [email, hashedPassword]
    );

    if (result.rows.length > 0) {
      console.log('Admin user created');
      return result.rows[0];
    } else {
      console.log('Admin user already exists');
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return existingUser.rows[0];
    }
  } catch (error) {
    console.error('Error creating admin user', error);
  }
};

/**
 * Creates sample posts linked to the admin user.
 * 
 * @param {number} adminUserId - The ID of the admin user.
 * @returns {void}
 */
const createSamplePosts = async (adminUserId) => {
  const samplePosts = [
    { title: 'Admin Post 1', description: 'This is the first post by admin', imageUrl: null },
    { title: 'Admin Post 2', description: 'This is the second post by admin', imageUrl: null },
    { title: 'Admin Post 3', description: 'This is the third post by admin', imageUrl: null },
    { title: 'Admin Post 4', description: 'This is the fourth post by admin', imageUrl: null },
    { title: 'Admin Post 5', description: 'This is the fifth post by admin', imageUrl: null },
  ];

  try {
    for (const post of samplePosts) {
      await pool.query(
        'INSERT INTO posts (title, description, author, date, image_url) VALUES ($1, $2, $3, NOW(), $4)',
        [post.title, post.description, adminUserId, post.imageUrl]
      );
    }
    console.log('Sample posts created');
  } catch (error) {
    console.error('Error creating sample posts', error);
  }
};

/**
 * Seeds the database with an admin user and sample posts.
 * 
 * @returns {void}
 */
const seedDatabase = async () => {
  const adminUser = await createAdminUser();
  if (adminUser) {
    await createSamplePosts(adminUser.id);
  }
  pool.end();
};

seedDatabase();
