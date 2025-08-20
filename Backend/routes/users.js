const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ad = require('../models/Ad');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for security
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 registration attempts per 15 minutes
  message: { error: 'Too many registration attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
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

// Register new user
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { name, phone, username, password, email } = req.body;

    // Validation
    if (!name || !phone || !username || !password) {
      return res.status(400).json({ error: 'تمام فیلدهای ضروری باید پر شوند' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'رمز عبور باید حداقل 6 کاراکتر باشد' });
    }

    if (!/^09\d{9}$/.test(phone)) {
      return res.status(400).json({ error: 'شماره موبایل باید در فرمت صحیح باشد (09xxxxxxxxx)' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'نام کاربری فقط می‌تواند شامل حروف، اعداد و _ باشد' });
    }

    // Check if user already exists
    const existingUserByUsername = await User.findByUsername(username);
    const existingUserByPhone = await User.findByPhone(phone);

    if (existingUserByUsername) {
      return res.status(400).json({ error: 'این نام کاربری قبلاً استفاده شده است' });
    }

    if (existingUserByPhone) {
      return res.status(400).json({ error: 'این شماره موبایل قبلاً ثبت شده است' });
    }

    // Create new user
    const userId = await User.create({
      name,
      phone,
      username,
      password
    });

    // Get the created user
    const user = await User.findById(userId);

    // Generate token
    const token = User.generateAuthToken(user);

    res.status(201).json({
      message: 'کاربر با موفقیت ثبت شد',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'خطا در ثبت‌نام کاربر' });
  }
});

// Login user
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
    }

    // Find user by username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    }

    // Check if account is locked
    if (User.isLocked(user)) {
      return res.status(423).json({ error: 'حساب کاربری شما قفل شده است. لطفاً بعداً تلاش کنید' });
    }

    // Check if account is banned
    if (user.isBanned) {
      return res.status(403).json({ error: 'حساب کاربری شما مسدود شده است' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'حساب کاربری شما غیرفعال است' });
    }

    // Verify password
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      // Increment login attempts
      await User.incLoginAttempts(user.id);
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    }

    // Reset login attempts on successful login
    await User.resetLoginAttempts(user.id);

    // Generate token
    const token = User.generateAuthToken(user);

    res.json({
      message: 'ورود موفقیت‌آمیز',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'خطا در ورود کاربر' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات کاربر' });
  }
});

// Get user's ads
router.get('/my-ads', authenticateToken, async (req, res) => {
  try {
    const ads = await Ad.findByUserId(req.user.userId);
    res.json({ ads });

  } catch (error) {
    console.error('Get user ads error:', error);
    res.status(500).json({ error: 'خطا در دریافت آگهی‌های کاربر' });
  }
});

// Admin: Get all users
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'خطا در دریافت لیست کاربران' });
  }
});

// Admin: Update user status
router.patch('/admin/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, isBanned, role } = req.body;

    const updateData = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (typeof isBanned === 'boolean') updateData.isBanned = isBanned;
    if (role && ['user', 'admin'].includes(role)) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'هیچ فیلدی برای به‌روزرسانی مشخص نشده است' });
    }

    const success = await User.update(userId, updateData);
    if (!success) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }

    res.json({ message: 'وضعیت کاربر با موفقیت به‌روزرسانی شد' });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'خطا در به‌روزرسانی وضعیت کاربر' });
  }
});

// Admin: Delete user
router.delete('/admin/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user has ads
    const userAds = await Ad.findByUserId(userId);
    if (userAds.length > 0) {
      return res.status(400).json({ error: 'نمی‌توان کاربری که آگهی دارد را حذف کرد' });
    }

    const success = await User.delete(userId);
    if (!success) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }

    res.json({ message: 'کاربر با موفقیت حذف شد' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'خطا در حذف کاربر' });
  }
});

// Get user dashboard data (ads statistics)
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all user's ads
    const allAds = await Ad.findByUserId(userId);
    
    // Calculate statistics
    const totalAds = allAds.length;
    const approvedAds = allAds.filter(ad => ad.status === 'approved').length;
    const pendingAds = allAds.filter(ad => ad.status === 'pending').length;
    const rejectedAds = allAds.filter(ad => ad.status === 'rejected').length;
    
    // Calculate total views and clicks
    const totalViews = allAds.reduce((sum, ad) => sum + (ad.viewCount || 0), 0);
    const totalClicks = allAds.reduce((sum, ad) => sum + (ad.clickCount || 0), 0);
    
    // Get recent ads (last 5)
    const recentAds = allAds.slice(0, 5);
    
    const dashboardData = {
      totalAds,
      approvedAds,
      pendingAds,
      rejectedAds,
      totalViews,
      totalClicks,
      recentAds
    };
    
    res.json(dashboardData);
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات داشبورد' });
  }
});

module.exports = router;
