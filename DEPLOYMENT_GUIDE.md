# 🚀 راهنمای استقرار Amlak Web

## 📋 پیش‌نیازها

- **Node.js** (v16 یا بالاتر)
- **MySQL** (v8.0 یا بالاتر)
- **cPanel** با Node.js App یا **VPS**

## 🎯 روش‌های استقرار

### 1️⃣ استقرار روی cPanel

#### مرحله 1: آماده‌سازی فایل‌ها
```bash
# ساخت نسخه تولید
npm run build:prod
```

#### مرحله 2: آپلود فایل‌ها
1. فایل‌های پوشه `upload-ready` را آپلود کنید
2. فایل‌ها را در پوشه اصلی دامنه قرار دهید

#### مرحله 3: تنظیم Node.js App
1. در cPanel، بخش **Node.js Apps** را باز کنید
2. **Create Application** کلیک کنید
3. تنظیمات:
   - **Node.js version**: 18.x یا بالاتر
   - **Application mode**: Production
   - **Application root**: پوشه اصلی
   - **Application URL**: دامنه شما
   - **Application startup file**: `Backend/server.js`

#### مرحله 4: تنظیم متغیرهای محیطی
در بخش **Environment Variables**:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=5000
```

#### مرحله 5: تنظیم دیتابیس
1. **MySQL Databases** در cPanel
2. دیتابیس جدید ایجاد کنید
3. کاربر دیتابیس ایجاد کنید
4. مجوزهای لازم را بدهید

#### مرحله 6: راه‌اندازی
1. **Restart Application** کلیک کنید
2. آدرس سایت را تست کنید

### 2️⃣ استقرار روی VPS

#### مرحله 1: نصب پیش‌نیازها
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm mysql-server nginx

# CentOS/RHEL
sudo yum install nodejs npm mysql-server nginx
```

#### مرحله 2: تنظیم MySQL
```bash
sudo mysql_secure_installation
sudo mysql -u root -p
```

```sql
CREATE DATABASE amlak_db;
CREATE USER 'amlak_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON amlak_db.* TO 'amlak_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### مرحله 3: آپلود پروژه
```bash
# کلون پروژه
git clone <your-repo>
cd amlak-web

# نصب وابستگی‌ها
npm run install:all

# ساخت نسخه تولید
npm run build:prod
```

#### مرحله 4: تنظیم متغیرهای محیطی
```bash
# ایجاد فایل .env
nano .env
```

```env
DB_HOST=localhost
DB_USER=amlak_user
DB_PASSWORD=your_password
DB_NAME=amlak_db
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=5000
```

#### مرحله 5: تنظیم PM2
```bash
# نصب PM2
npm install -g pm2

# راه‌اندازی با PM2
pm2 start ecosystem.config.js --env production

# تنظیم PM2 برای راه‌اندازی خودکار
pm2 startup
pm2 save
```

#### مرحله 6: تنظیم Nginx
```bash
sudo nano /etc/nginx/sites-available/amlak-web
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /path/to/your/project/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        alias /path/to/your/project/Backend/uploads;
    }
}
```

```bash
# فعال‌سازی سایت
sudo ln -s /etc/nginx/sites-available/amlak-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### مرحله 7: تنظیم SSL (اختیاری)
```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx

# دریافت گواهی SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 تنظیمات امنیتی

### 1. فایروال
```bash
# Ubuntu/Debian
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. محدودیت‌های MySQL
```sql
-- محدود کردن دسترسی کاربر
REVOKE ALL PRIVILEGES ON *.* FROM 'amlak_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON amlak_db.* TO 'amlak_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📊 مانیتورینگ

### 1. PM2 Monitoring
```bash
# مشاهده وضعیت
pm2 status
pm2 monit

# مشاهده لاگ‌ها
pm2 logs amlak-web
```

### 2. Nginx Monitoring
```bash
# مشاهده آمار
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 به‌روزرسانی

### 1. Backup
```bash
# Backup دیتابیس
mysqldump -u amlak_user -p amlak_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup فایل‌ها
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/your/project
```

### 2. به‌روزرسانی
```bash
# توقف برنامه
pm2 stop amlak-web

# آپلود فایل‌های جدید
git pull origin main

# نصب وابستگی‌های جدید
npm run install:all

# ساخت نسخه جدید
npm run build:prod

# راه‌اندازی مجدد
pm2 restart amlak-web
```

## 🚨 عیب‌یابی

### مشکلات رایج:

1. **خطای 502 Bad Gateway**
   - بررسی وضعیت Node.js app
   - بررسی لاگ‌های PM2

2. **خطای اتصال دیتابیس**
   - بررسی تنظیمات MySQL
   - بررسی متغیرهای محیطی

3. **خطای 404 برای API**
   - بررسی تنظیمات Nginx
   - بررسی مسیرهای API

### دستورات مفید:
```bash
# بررسی وضعیت سرویس‌ها
sudo systemctl status nginx
sudo systemctl status mysql
pm2 status

# بررسی لاگ‌ها
pm2 logs amlak-web --lines 100
sudo tail -f /var/log/nginx/error.log
```

## 📞 پشتیبانی

برای مشکلات و سوالات:
- Issue در GitHub ایجاد کنید
- ایمیل: [mohammadsajjadidev@gmail.com]

---

**آخرین به‌روزرسانی**: 2024
