const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Ad = require('../models/Ad');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('فقط فایل‌های تصویری مجاز هستند!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// دریافت آمار کلی
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await Ad.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'خطا در دریافت آمار' });
  }
});

// دریافت همه آگهی‌ها برای پنل مدیریت
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const ads = await Ad.findAll(limit, offset);
    res.json({ ads });
  } catch (error) {
    console.error('Get admin ads error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌ها' });
  }
});

// دریافت همه آگهی‌های تایید شده
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const ads = await Ad.findApproved(limit, offset);
    res.json({ ads });
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌ها' });
  }
});

// دریافت آگهی بر اساس ID
router.get('/:id', async (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    const ad = await Ad.findById(adId);
    
    if (!ad) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    // Increment view count
    await Ad.incrementViewCount(adId);

    res.json({ ad });
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی' });
  }
});

// جستجو در آگهی‌ها
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const ads = await Ad.search(query, limit, offset);
    res.json({ ads });
  } catch (error) {
    console.error('Search ads error:', error);
    res.status(500).json({ error: 'خطا در جستجوی آگهی‌ها' });
  }
});

// دریافت آگهی‌ها بر اساس استان
router.get('/province/:province', async (req, res) => {
  try {
    const province = req.params.province;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const ads = await Ad.findByProvince(province, limit, offset);
    res.json({ ads });
  } catch (error) {
    console.error('Get ads by province error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌ها' });
  }
});

// دریافت آگهی‌ها بر اساس نوع ملک
router.get('/type/:propertyType', async (req, res) => {
  try {
    const propertyType = req.params.propertyType;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const ads = await Ad.findByPropertyType(propertyType, limit, offset);
    res.json({ ads });
  } catch (error) {
    console.error('Get ads by type error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌ها' });
  }
});

// آپلود تصاویر
router.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ error: 'هیچ فایلی آپلود نشده است' });
    }

    const uploadedFiles = req.files.map(file => {
      const url = `/uploads/${file.filename}`;
      return {
        filename: file.filename,
        originalname: file.originalname,
        url: url
      };
    });

    res.json({ 
      message: 'فایل‌ها با موفقیت آپلود شدند',
      files: uploadedFiles 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'خطا در آپلود فایل‌ها' });
  }
});

// ایجاد آگهی جدید
router.post('/', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const {
      title, description, address, province, city, lat, lng,
      phone, userNotes, price, area, rooms, propertyType, images: bodyImages
    } = req.body;

    // Validation
    if (!title || !description || !address || !province || !city || !phone) {
      return res.status(400).json({ error: 'تمام فیلدهای ضروری باید پر شوند' });
    }

    // Validate coordinates
    if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      return res.status(400).json({ error: 'مختصات جغرافیایی معتبر وارد کنید' });
    }

    // Process images - check both req.files and req.body.images
    let images = [];
    if (req.files && req.files.length > 0) {
      // Images uploaded via multipart/form-data
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (bodyImages) {
      // Images already uploaded and URLs provided in body
      try {
        images = Array.isArray(bodyImages) ? bodyImages : JSON.parse(bodyImages);
      } catch (e) {
        images = [];
      }
    }

    // Create ad data
    const adData = {
      title: title.trim(),
      description: description.trim(),
      address: address.trim(),
      province: province.trim(),
      city: city.trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      images,
      phone: phone.trim(),
      userNotes: userNotes ? userNotes.trim() : null,
      price: price ? parseFloat(price) : null,
      area: area ? parseFloat(area) : null,
      rooms: rooms ? parseInt(rooms) : null,
      propertyType: propertyType || 'apartment',
      userId: req.user.userId
    };

    const adId = await Ad.create(adData);
    const ad = await Ad.findById(adId);

    res.status(201).json({
      message: 'آگهی با موفقیت ایجاد شد و در انتظار تایید است',
      ad
    });

  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ error: 'خطا در ایجاد آگهی' });
  }
});

// به‌روزرسانی آگهی
router.put('/:id', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    // Check if user owns this ad or is admin
    if (ad.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'شما مجاز به ویرایش این آگهی نیستید' });
    }

    const {
      title, description, address, province, city, lat, lng,
      phone, price, area, rooms, propertyType
    } = req.body;

    // Process uploaded images
    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const images = [...existingImages, ...newImages];

    // Update ad data
    const updateData = {
      title: title ? title.trim() : ad.title,
      description: description ? description.trim() : ad.description,
      address: address ? address.trim() : ad.address,
      province: province ? province.trim() : ad.province,
      city: city ? city.trim() : ad.city,
      lat: lat ? parseFloat(lat) : ad.lat,
      lng: lng ? parseFloat(lng) : ad.lng,
      images,
      phone: phone ? phone.trim() : ad.phone,
      price: price ? parseFloat(price) : ad.price,
      area: area ? parseFloat(area) : ad.area,
      rooms: rooms ? parseInt(rooms) : ad.rooms,
      propertyType: propertyType || ad.propertyType
    };

    const success = await Ad.update(adId, updateData);
    if (!success) {
      return res.status(500).json({ error: 'خطا در به‌روزرسانی آگهی' });
    }

    const updatedAd = await Ad.findById(adId);
    res.json({
      message: 'آگهی با موفقیت به‌روزرسانی شد',
      ad: updatedAd
    });

  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ error: 'خطا در به‌روزرسانی آگهی' });
  }
});

// تایید یا رد آگهی (فقط ادمین)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    const { status, adminNotes } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'وضعیت نامعتبر است' });
    }

    const success = await Ad.updateStatus(adId, status, adminNotes);
    if (!success) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    res.json({ message: `آگهی ${status === 'approved' ? 'تایید' : status === 'rejected' ? 'رد' : 'در انتظار'} شد` });

        } catch (error) {
    console.error('Update ad status error:', error);
    res.status(500).json({ error: 'خطا در به‌روزرسانی وضعیت آگهی' });
  }
});

// حذف آگهی
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    // Check if user owns this ad or is admin
    if (ad.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'شما مجاز به حذف این آگهی نیستید' });
    }

    const success = await Ad.delete(adId);
    if (!success) {
      return res.status(500).json({ error: 'خطا در حذف آگهی' });
    }

    res.json({ message: 'آگهی با موفقیت حذف شد' });

        } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ error: 'خطا در حذف آگهی' });
  }
});

// افزایش تعداد کلیک
router.post('/:id/click', async (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    await Ad.incrementClickCount(adId);
    res.json({ message: 'کلیک ثبت شد' });
  } catch (error) {
    console.error('Increment click error:', error);
    res.status(500).json({ error: 'خطا در ثبت کلیک' });
  }
});

// افزایش تعداد بازدید
router.post('/:id/view', async (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    await Ad.incrementViewCount(adId);
    res.json({ message: 'بازدید ثبت شد' });
  } catch (error) {
    console.error('Increment view error:', error);
    res.status(500).json({ error: 'خطا در ثبت بازدید' });
  }
});

// امتیازدهی به آگهی
router.post('/:id/rate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    const { stars } = req.body;
    
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: 'امتیاز باید بین 1 تا 5 باشد' });
    }

    const success = await Ad.updateRating(adId, stars);
    if (!success) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    res.json({ message: 'امتیاز با موفقیت ثبت شد' });
  } catch (error) {
    console.error('Rate ad error:', error);
    res.status(500).json({ error: 'خطا در ثبت امتیاز' });
  }
});

module.exports = router;