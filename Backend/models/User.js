const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

class User {
  // Create a new user
  static async create(userData) {
    try {
      const { name, phone, username, password, email, role = 'user' } = userData;
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const [result] = await pool.execute(
        'INSERT INTO users (name, phone, username, password, role) VALUES (?, ?, ?, ?, ?)',
        [name, phone, username, hashedPassword, role]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by phone
  static async findByPhone(phone) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE phone = ?',
        [phone]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find admin user
  static async findAdmin() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE role = "admin" LIMIT 1'
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, updateData) {
    try {
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      values.push(id);
      
      const [result] = await pool.execute(
        `UPDATE users SET ${fields} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  static async updateLastLogin(id) {
    try {
      await pool.execute(
        'UPDATE users SET lastLogin = NOW() WHERE id = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  // Increment login attempts
  static async incLoginAttempts(id) {
    try {
      const user = await this.findById(id);
      if (!user) return false;

      const loginAttempts = (user.loginAttempts || 0) + 1;
      let lockUntil = null;

      // Lock account after 5 failed attempts for 2 hours
      if (loginAttempts >= 5) {
        lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000);
      }

      await pool.execute(
        'UPDATE users SET loginAttempts = ?, lockUntil = ? WHERE id = ?',
        [loginAttempts, lockUntil, id]
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Reset login attempts
  static async resetLoginAttempts(id) {
    try {
      await pool.execute(
        'UPDATE users SET loginAttempts = 0, lockUntil = NULL, lastLogin = NOW() WHERE id = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  // Check if account is locked
  static isLocked(user) {
    return !!(user.lockUntil && new Date(user.lockUntil) > new Date());
  }

  // Compare password
  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static generateAuthToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
  }

  // Get all users (for admin)
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, phone, username, role, isActive, isBanned, lastLogin, createdAt FROM users ORDER BY createdAt DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
