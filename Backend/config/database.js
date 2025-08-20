const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amlak_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully!');
    console.log('🗄️ Database:', dbConfig.database);
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    throw error;
  }
};

// Initialize database tables
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        username VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        isActive BOOLEAN DEFAULT TRUE,
        isBanned BOOLEAN DEFAULT FALSE,
        lastLogin DATETIME,
        loginAttempts INT DEFAULT 0,
        lockUntil DATETIME,
        email VARCHAR(100),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_phone (phone),
        INDEX idx_username (username),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create ads table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        address VARCHAR(500) NOT NULL,
        province VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        lat DECIMAL(10, 8) NOT NULL,
        lng DECIMAL(11, 8) NOT NULL,
        images JSON,
        phone VARCHAR(15) NOT NULL,
        userNotes TEXT,
        adminNotes TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        stars INT DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0.00,
        viewCount INT DEFAULT 0,
        clickCount INT DEFAULT 0,
        price DECIMAL(15, 2),
        area DECIMAL(10, 2),
        rooms INT,
        propertyType ENUM('apartment', 'villa', 'office', 'shop', 'land') DEFAULT 'apartment',
        userId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_province (province),
        INDEX idx_city (city),
        INDEX idx_propertyType (propertyType),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Database tables created successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
};
