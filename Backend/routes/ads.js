const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Ad = require('../models/Ad');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { getPagination, isValidObjectId } = require('../utils/request');
const maxUploadSize = Number.parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);

const sanitizeUploadedImagePaths = (images) => images
  .filter((image) => typeof image === 'string')
  .map((image) => image.trim())
  .filter((image) => image.startsWith('/uploads/'));

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
    fileSize: maxUploadSize
  }
});

// Get admin statistics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await Ad.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'خطا در دریافت آمار' });
  }
});

// Get all ads for admin panel
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const ads = await Ad.findAll(limit, skip);
    const total = await Ad.countDocuments();

    res.json({ ads, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get admin ads error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌ها' });
  }
});

// Get all approved ads
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const ads = await Ad.findApproved(limit, skip);
    const total = await Ad.countDocuments({ status: 'approved' });

    res.json({ ads, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌ها' });
  }
});

// Advanced search with filters
router.get('/search/advanced', async (req, res) => {
  try {
    const {
      query,
      province,
      city,
      propertyType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      rooms
    } = req.query;

    const { page, limit, skip } = getPagination(req.query);

    // Build filter object
    const filter = { status: 'approved' };

    if (query) {
      filter.$text = { $search: query };
    }

    if (province) filter.province = province;
    if (city) filter.city = city;
    if (propertyType) filter.propertyType = propertyType;
    if (rooms) filter.rooms = Number.parseInt(rooms, 10);

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number.parseInt(minPrice, 10);
      if (maxPrice) filter.price.$lte = Number.parseInt(maxPrice, 10);
    }

    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = Number.parseInt(minArea, 10);
      if (maxArea) filter.area.$lte = Number.parseInt(maxArea, 10);
    }

    let adsQuery = Ad.find(filter);

    // Sort by text score if searching
    if (query) {
      adsQuery = adsQuery.sort({ score: { $meta: 'textScore' } });
    } else {
      adsQuery = adsQuery.sort({ createdAt: -1 });
    }

    const ads = await adsQuery.limit(limit).skip(skip);
    const total = await Ad.countDocuments(filter);

    res.json({ ads, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ error: 'خطا در جستجوی آگهی‌ها' });
  }
});

// Search by free text
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const { limit, skip } = getPagination(req.query);

    const ads = await Ad.search(query, limit, skip);
    res.json({ ads });
  } catch (error) {
    console.error('Search ads error:', error);
    res.status(500).json({ error: 'خطا در جستجوی آگهی‌ها' });
  }
});

// Filter ads by province
router.get('/province/:province', async (req, res) => {
  try {
    const province = decodeURIComponent(req.params.province);
    const { page, limit, skip } = getPagination(req.query);

    const ads = await Ad.findByProvince(province, limit, skip);
    const total = await Ad.countDocuments({ province, status: 'approved' });

    res.json({ ads, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get ads by province error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌ها' });
  }
});

// Filter ads by property type
router.get('/type/:propertyType', async (req, res) => {
  try {
    const propertyType = req.params.propertyType;
    const { limit, skip } = getPagination(req.query);

    const ads = await Ad.findByPropertyType(propertyType, limit, skip);
    res.json({ ads });
  } catch (error) {
    console.error('Get ads by type error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌ها' });
  }
});

// Upload ad images
router.post('/upload', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
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

// Create new ad
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

    // Process images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (bodyImages) {
      try {
        const parsedImages = Array.isArray(bodyImages) ? bodyImages : JSON.parse(bodyImages);
        images = sanitizeUploadedImagePaths(parsedImages);
      } catch {
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
      rooms: rooms ? Number.parseInt(rooms, 10) : null,
      propertyType: propertyType || 'apartment',
      userId: req.user.userId
    };

    const ad = await Ad.create(adData);
    await ad.populate('userId', 'name phone');

    res.status(201).json({
      message: 'آگهی با موفقیت ایجاد شد و در انتظار تایید است',
      ad
    });

  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ error: 'خطا در ایجاد آگهی' });
  }
});

// Update ad
router.put('/:id', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const adId = req.params.id;

    if (!isValidObjectId(adId)) {
      return res.status(400).json({ error: 'شناسه آگهی نامعتبر است' });
    }

    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    // Check if user owns this ad or is admin
    if (ad.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'شما مجاز به ویرایش این آگهی نیستید' });
    }

    const {
      title, description, address, province, city, lat, lng,
      phone, price, area, rooms, propertyType
    } = req.body;

    // Process uploaded images
    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch {
        existingImages = [];
      }
    }
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
      rooms: rooms ? Number.parseInt(rooms, 10) : ad.rooms,
      propertyType: propertyType || ad.propertyType
    };

    const updatedAd = await Ad.findByIdAndUpdate(adId, updateData, { new: true }).populate('userId', 'name phone');

    res.json({
      message: 'آگهی با موفقیت به‌روزرسانی شد',
      ad: updatedAd
    });

  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ error: 'خطا در به‌روزرسانی آگهی' });
  }
});

// Update ad moderation status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adId = req.params.id;
    const { status, adminNotes } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'وضعیت نامعتبر است' });
    }

    const updatedAd = await Ad.updateStatus(adId, status, adminNotes);
    if (!updatedAd) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    res.json({ message: `آگهی ${status === 'approved' ? 'تایید' : status === 'rejected' ? 'رد' : 'در انتظار'} شد` });

  } catch (error) {
    console.error('Update ad status error:', error);
    res.status(500).json({ error: 'خطا در به‌روزرسانی وضعیت آگهی' });
  }
});

// Delete ad
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const adId = req.params.id;

    if (!isValidObjectId(adId)) {
      return res.status(400).json({ error: 'شناسه آگهی نامعتبر است' });
    }

    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    // Check if user owns this ad or is admin
    if (ad.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'شما مجاز به حذف این آگهی نیستید' });
    }

    await Ad.findByIdAndDelete(adId);

    res.json({ message: 'آگهی با موفقیت حذف شد' });

  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ error: 'خطا در حذف آگهی' });
  }
});

// Increment click count
router.post('/:id/click', async (req, res) => {
  try {
    const adId = req.params.id;

    if (!isValidObjectId(adId)) {
      return res.status(400).json({ error: 'شناسه آگهی نامعتبر است' });
    }

    await Ad.incrementClickCount(adId);
    res.json({ message: 'کلیک ثبت شد' });
  } catch (error) {
    console.error('Increment click error:', error);
    res.status(500).json({ error: 'خطا در ثبت کلیک' });
  }
});

// Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const adId = req.params.id;

    if (!isValidObjectId(adId)) {
      return res.status(400).json({ error: 'شناسه آگهی نامعتبر است' });
    }

    await Ad.incrementViewCount(adId);
    res.json({ message: 'بازدید ثبت شد' });
  } catch (error) {
    console.error('Increment view error:', error);
    res.status(500).json({ error: 'خطا در ثبت بازدید' });
  }
});

// Rate ad (admin only)
router.post('/:id/rate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adId = req.params.id;
    const { stars } = req.body;

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: 'امتیاز باید بین 1 تا 5 باشد' });
    }

    const updatedAd = await Ad.updateRating(adId, stars);
    if (!updatedAd) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    res.json({ message: 'امتیاز با موفقیت ثبت شد' });
  } catch (error) {
    console.error('Rate ad error:', error);
    res.status(500).json({ error: 'خطا در ثبت امتیاز' });
  }
});

// Get ad by ID (must be declared after specific routes)
router.get('/:id', async (req, res) => {
  try {
    const adId = req.params.id;

    if (!isValidObjectId(adId)) {
      return res.status(400).json({ error: 'شناسه آگهی نامعتبر است' });
    }

    const ad = await Ad.findById(adId).populate('userId', 'name phone');

    if (!ad) {
      return res.status(404).json({ error: 'آگهی یافت نشد' });
    }

    return res.json({ ad });
  } catch (error) {
    console.error('Get ad error:', error);
    return res.status(500).json({ error: 'خطا در دریافت آگهی' });
  }
});

module.exports = router;
