const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = isProduction
  ? (process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : ['https://amlak.mmdcode.top'])
  : [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

const apiLimiter = rateLimit({
  windowMs: Number.parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: Number.parseInt(process.env.API_RATE_LIMIT_MAX || '200', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

if (!process.env.JWT_SECRET) {
  throw new Error('Missing required environment variable: JWT_SECRET');
}

// Middleware
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', apiLimiter);

// Connect to MongoDB
console.log('🔗 Connecting to MongoDB database...');
connectDB();

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      res.set('Content-Type', 'image/jpeg');
    } else if (ext === '.png') {
      res.set('Content-Type', 'image/png');
    } else if (ext === '.gif') {
      res.set('Content-Type', 'image/gif');
    } else if (ext === '.webp') {
      res.set('Content-Type', 'image/webp');
    }

    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// API Routes
app.use('/api/ads', require('./routes/ads'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB',
    version: '2.0.0'
  });
});

// Serve static files from React build (production only)
if (process.env.NODE_ENV === 'production') {
  // Supports multiple layouts:
  // 1) local: Backend/.. -> frontend/dist
  // 2) packed deploy: dist/Backend -> dist/ (client build next to Backend)
  const clientDirCandidates = [
    path.join(__dirname, '../frontend/dist'),
    path.join(__dirname, '../dist'),
    path.join(__dirname, '..'),
  ];

  const clientBuildDir = clientDirCandidates.find((dir) => {
    const indexPath = path.join(dir, 'index.html');
    return fs.existsSync(indexPath);
  });

  if (clientBuildDir) {
    app.use(express.static(clientBuildDir));

    // Handle React routing (SPA fallback)
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildDir, 'index.html'));
    });
  } else {
    console.warn('Production mode: client build not found. Expected index.html in:', clientDirCandidates);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'حجم فایل بیش از حد مجاز است (حداکثر 5 مگابایت)' });
    }
    return res.status(400).json({ error: 'خطا در آپلود فایل' });
  }

  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  // Helps debugging "API endpoint not found"
  console.warn('API 404:', req.method, req.originalUrl);
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});
