const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

class Ad {
  // Create a new ad
  static async create(adData) {
    try {
      const {
        title, description, address, province, city, lat, lng,
        images, phone, userNotes, adminNotes, price, area, rooms, propertyType, userId
      } = adData;

      const [result] = await pool.execute(
        `INSERT INTO ads (title, description, address, province, city, lat, lng, 
         images, phone, userNotes, adminNotes, price, area, rooms, propertyType, userId) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, 
          description, 
          address, 
          province, 
          city, 
          lat, 
          lng,
          JSON.stringify(images || []), 
          phone, 
          userNotes || null, 
          adminNotes || null, 
          price || null, 
          area || null, 
          rooms || null, 
          propertyType || 'apartment', 
          userId
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find ad by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM ads WHERE id = ?',
        [id]
      );
      const ad = rows[0];
      if (ad && ad.images) {
        ad.images = JSON.parse(ad.images);
      }
      return ad || null;
    } catch (error) {
      throw error;
    }
  }

  // Find all approved ads
  static async findApproved(limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM ads WHERE status = 'approved' 
         ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      
      return rows.map(ad => {
        if (ad.images) {
          ad.images = JSON.parse(ad.images);
        }
        return ad;
      });
    } catch (error) {
      throw error;
    }
  }

  // Find all ads (for admin)
  static async findAll(limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.*, u.name as userName, u.phone as userPhone 
         FROM ads a 
         LEFT JOIN users u ON a.userId = u.id 
         ORDER BY a.createdAt DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      
      return rows.map(ad => {
        if (ad.images) {
          ad.images = JSON.parse(ad.images);
        }
        return ad;
      });
    } catch (error) {
      throw error;
    }
  }

  // Find ads by user ID
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM ads WHERE userId = ? ORDER BY createdAt DESC',
        [userId]
      );
      
      return rows.map(ad => {
        if (ad.images) {
          ad.images = JSON.parse(ad.images);
        }
        return ad;
      });
    } catch (error) {
      throw error;
    }
  }

  // Update ad
  static async update(id, updateData) {
    try {
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      
      // Handle images array
      const imagesIndex = values.findIndex(val => Array.isArray(val));
      if (imagesIndex !== -1) {
        values[imagesIndex] = JSON.stringify(values[imagesIndex]);
      }
      
      values.push(id);
      
      const [result] = await pool.execute(
        `UPDATE ads SET ${fields} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update ad status
  static async updateStatus(id, status, adminNotes = null) {
    try {
      let query, params;
      
      if (adminNotes !== null && adminNotes !== undefined) {
        // Update both status and adminNotes
        query = 'UPDATE ads SET status = ?, adminNotes = ? WHERE id = ?';
        params = [status, adminNotes, id];
      } else {
        // Update only status, keep existing adminNotes
        query = 'UPDATE ads SET status = ? WHERE id = ?';
        params = [status, id];
      }
      
      const [result] = await pool.execute(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Increment view count
  static async incrementViewCount(id) {
    try {
      await pool.execute(
        'UPDATE ads SET viewCount = viewCount + 1 WHERE id = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  // Increment click count
  static async incrementClickCount(id) {
    try {
      await pool.execute(
        'UPDATE ads SET clickCount = clickCount + 1 WHERE id = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  // Delete ad
  static async delete(id) {
    try {
      const ad = await this.findById(id);
      if (!ad) {
        return false;
      }

      // Delete associated image files
      if (ad.images && ad.images.length > 0) {
        const uploadsDir = path.join(__dirname, '../uploads');
        ad.images.forEach(imageUrl => {
          // Extract filename from URL (e.g., "/uploads/image.jpg" -> "image.jpg")
          const filename = imageUrl.replace('/uploads/', '');
          const imagePath = path.join(uploadsDir, filename);
          if (fs.existsSync(imagePath)) {
            try {
              fs.unlinkSync(imagePath);
              console.log(`Deleted image: ${filename}`);
            } catch (err) {
              console.error(`Error deleting image ${filename}:`, err);
            }
          }
        });
      }

      const [result] = await pool.execute(
        'DELETE FROM ads WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get ads statistics
  static async getStats() {
    try {
      const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM ads');
      const [approvedResult] = await pool.execute("SELECT COUNT(*) as approved FROM ads WHERE status = 'approved'");
      const [pendingResult] = await pool.execute("SELECT COUNT(*) as pending FROM ads WHERE status = 'pending'");
      const [rejectedResult] = await pool.execute("SELECT COUNT(*) as rejected FROM ads WHERE status = 'rejected'");
      const [viewsResult] = await pool.execute('SELECT SUM(viewCount) as totalViews FROM ads');
      const [clicksResult] = await pool.execute('SELECT SUM(clickCount) as totalClicks FROM ads');

      return {
        totalAds: totalResult[0].total || 0,
        approvedAds: approvedResult[0].approved || 0,
        pendingAds: pendingResult[0].pending || 0,
        rejectedAds: rejectedResult[0].rejected || 0,
        totalViews: viewsResult[0].totalViews || 0,
        totalClicks: clicksResult[0].totalClicks || 0
      };
    } catch (error) {
      throw error;
    }
  }

  // Search ads
  static async search(query, limit = 50, offset = 0) {
    try {
      const searchQuery = `%${query}%`;
      const [rows] = await pool.execute(
        `SELECT * FROM ads WHERE status = 'approved' AND 
         (title LIKE ? OR description LIKE ? OR address LIKE ? OR province LIKE ? OR city LIKE ?)
         ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, limit, offset]
      );
      
      return rows.map(ad => {
        if (ad.images) {
          ad.images = JSON.parse(ad.images);
        }
        return ad;
      });
    } catch (error) {
      throw error;
    }
  }

  // Get ads by province
  static async findByProvince(province, limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM ads WHERE status = 'approved' AND province = ? 
         ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        [province, limit, offset]
      );
      
      return rows.map(ad => {
        if (ad.images) {
          ad.images = JSON.parse(ad.images);
        }
        return ad;
      });
    } catch (error) {
      throw error;
    }
  }

  // Get ads by property type
  static async findByPropertyType(propertyType, limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM ads WHERE status = 'approved' AND propertyType = ? 
         ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        [propertyType, limit, offset]
      );
      
      return rows.map(ad => {
        if (ad.images) {
          ad.images = JSON.parse(ad.images);
        }
        return ad;
      });
    } catch (error) {
      throw error;
    }
  }

  // Update ad rating
  static async updateRating(id, rating) {
    try {
      const [result] = await pool.execute(
        'UPDATE ads SET stars = ? WHERE id = ?',
        [rating, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Ad;