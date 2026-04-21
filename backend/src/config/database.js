const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'alona_web',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const initDatabase = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');

    // Create database if not exists
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'alona_web'}`);
    await conn.query(`USE ${process.env.DB_NAME || 'alona_web'}`);

    // admins table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // messages table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        reply TEXT DEFAULT NULL,
        is_read TINYINT(1) DEFAULT 0,
        replied_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // services table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(50) DEFAULT 'code',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // projects table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500) DEFAULT NULL,
        tech_stack VARCHAR(500) NOT NULL,
        demo_url VARCHAR(500) DEFAULT NULL,
        github_url VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default admin if not exists
    const bcrypt = require('bcryptjs');
    const [admins] = await conn.query('SELECT * FROM admins WHERE username = ?', ['admin']);
    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await conn.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('✅ Default admin created: admin / admin123');
    }

    // Seed services if empty
    const [services] = await conn.query('SELECT COUNT(*) as count FROM services');
    if (services[0].count === 0) {
      await conn.query(`
        INSERT INTO services (title, description, icon) VALUES
        ('Web Development', 'We build blazing-fast, scalable web applications using modern technologies like React, Next.js, and Node.js.', 'globe'),
        ('Mobile Apps', 'Cross-platform mobile applications for iOS and Android using React Native and Flutter.', 'smartphone'),
        ('UI/UX Design', 'Beautiful, user-centered designs that convert visitors into customers with intuitive interfaces.', 'palette'),
        ('Cloud Solutions', 'AWS, GCP, and Azure cloud architecture, deployment, and DevOps automation pipelines.', 'cloud'),
        ('API Development', 'RESTful and GraphQL APIs built for performance, security, and developer experience.', 'code'),
        ('AI Integration', 'Integrate cutting-edge AI/ML models into your product for smarter user experiences.', 'cpu')
      `);
      console.log('✅ Default services seeded');
    }

    // Seed projects if empty
    const [projects] = await conn.query('SELECT COUNT(*) as count FROM projects');
    if (projects[0].count === 0) {
      await conn.query(`
        INSERT INTO projects (title, description, image, tech_stack, demo_url) VALUES
        ('EcommerceX Platform', 'A full-featured e-commerce platform with real-time inventory, AI recommendations, and seamless checkout.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', 'React, Node.js, MySQL, Redis, Stripe', 'https://example.com'),
        ('HealthTrack App', 'Mobile health monitoring app with wearable integration, analytics dashboard, and telemedicine features.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', 'React Native, Firebase, Node.js, TensorFlow', 'https://example.com'),
        ('FinanceFlow Dashboard', 'Real-time financial analytics dashboard for enterprise clients with predictive modeling.', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800', 'Next.js, Python, PostgreSQL, D3.js', 'https://example.com'),
        ('SocialHub CMS', 'Multi-platform social media management system with scheduling, analytics, and team collaboration.', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800', 'Vue.js, Laravel, MySQL, Redis', 'https://example.com')
      `);
      console.log('✅ Default projects seeded');
    }

    conn.release();
  } catch (err) {
    console.error('❌ Database initialization error:', err);
    process.exit(1);
  }
};

module.exports = { pool, initDatabase };
