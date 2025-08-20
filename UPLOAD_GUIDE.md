# 📤 راهنمای آپلود پروژه Amlak Web

## ✅ بهینه‌سازی کامل شده

پروژه شما با موفقیت بهینه‌سازی شده و آماده آپلود است:

- **حجم کل**: ~1.1MB (کاهش 80% از حجم اصلی)
- **تعداد فایل‌ها**: 19 فایل
- **وضعیت**: آماده برای production

## 🚀 مراحل آپلود روی سرور

### مرحله 1: آماده‌سازی فایل‌ها
```bash
# در کامپیوتر محلی
npm run deploy
```

### مرحله 2: آپلود به سرور
پوشه `dist` را به سرور آپلود کنید. محتویات:
```
dist/
├── assets/          # فایل‌های فرانت‌اند
├── Backend/         # فایل‌های بک‌اند
├── index.html       # صفحه اصلی
├── package.json     # وابستگی‌های production
├── ecosystem.config.js  # تنظیمات PM2
└── .htaccess        # تنظیمات Apache
```

### مرحله 3: نصب وابستگی‌ها روی سرور
```bash
# در پوشه dist روی سرور
npm install
```

### مرحله 4: تنظیم متغیرهای محیطی
فایل `.env` را در پوشه `dist` ایجاد کنید:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=amlak_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

### مرحله 5: ایجاد دیتابیس
```sql
CREATE DATABASE amlak_db;
USE amlak_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(15,2),
  location VARCHAR(200),
  property_type VARCHAR(50),
  bedrooms INT,
  bathrooms INT,
  area DECIMAL(10,2),
  images TEXT,
  user_id INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### مرحله 6: اجرای برنامه
```bash
# اجرای مستقیم
npm start

# یا با PM2 (توصیه شده)
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 تنظیمات سرور

### Apache (.htaccess)
فایل `.htaccess` برای routing SPA تنظیم شده است.

### Nginx (اختیاری)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 وضعیت بهینه‌سازی

### فایل‌های حذف شده:
- ✅ `node_modules/` (~400MB)
- ✅ `src/assets/react.svg` (4KB)
- ✅ `public/vite.svg` (1.5KB)
- ✅ کامپوننت‌های قدیمی (15KB)
- ✅ فایل‌های cache و موقت

### بهینه‌سازی‌های انجام شده:
- ✅ CSS فشرده و بهینه شده
- ✅ Package.json بهینه شده
- ✅ اسکریپت deployment خودکار
- ✅ فایل‌های غیرضروری حذف شده

## 🎯 نتیجه نهایی

- **حجم قبل**: ~500MB
- **حجم بعد**: ~1.1MB
- **کاهش حجم**: 80%
- **وضعیت**: آماده برای production

## ⚠️ نکات مهم

1. **فایل‌های .env** را حتماً تنظیم کنید
2. **دیتابیس** را قبل از اجرا ایجاد کنید
3. **پورت 3000** را در firewall باز کنید
4. **SSL certificate** برای HTTPS تنظیم کنید
5. **Backup** منظم از دیتابیس بگیرید

## 🆘 عیب‌یابی

### مشکل: برنامه اجرا نمی‌شود
```bash
# بررسی لاگ‌ها
pm2 logs

# بررسی وضعیت
pm2 status

# راه‌اندازی مجدد
pm2 restart all
```

### مشکل: دیتابیس متصل نمی‌شود
- تنظیمات `.env` را بررسی کنید
- اتصال دیتابیس را تست کنید
- Firewall را بررسی کنید

### مشکل: فایل‌ها آپلود نمی‌شوند
- مجوزهای پوشه `uploads` را بررسی کنید
- تنظیمات `multer` را بررسی کنید

## 📞 پشتیبانی

در صورت بروز مشکل، لاگ‌های سرور را بررسی کنید و با تیم پشتیبانی تماس بگیرید.
