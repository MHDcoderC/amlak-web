# 🚀 بهینه‌سازی پروژه Amlak Web

## فایل‌های حذف شده

### فایل‌های غیرضروری:
- `src/assets/react.svg` - آیکون React که استفاده نمی‌شد
- `public/vite.svg` - آیکون Vite که استفاده نمی‌شد
- `src/components/UserRegistrationModal.jsx` - کامپوننت ثبت‌نام جداگانه (با UnifiedAuthModal جایگزین شده)
- `src/components/LoginModal.jsx` - کامپوننت ورود جداگانه (با UnifiedAuthModal جایگزین شده)
- `src/styles/` - پوشه خالی استایل‌ها
- `upload-ready/` - پوشه قدیمی آماده‌سازی آپلود
- `dist/` - پوشه build قبلی
- `Backend/node_modules/` - node_modules بک‌اند (قابل بازسازی)

### فایل‌های node_modules:
- `node_modules/` - وابستگی‌های فرانت‌اند (قابل بازسازی)
- `Backend/node_modules/` - وابستگی‌های بک‌اند (قابل بازسازی)

## بهینه‌سازی‌های انجام شده

### 1. فایل CSS (`src/index.css`):
- حذف استایل‌های تکراری
- ادغام استایل‌های مشابه
- مرتب‌سازی و گروه‌بندی استایل‌ها
- کاهش حجم فایل از 268 خط به 200 خط

### 2. فایل‌های package.json:
- حذف اسکریپت‌های غیرضروری (`lint`, `preview`, `postinstall`)
- حذف وابستگی `terser` (Vite خودش minify می‌کند)
- بهینه‌سازی اسکریپت‌های بک‌اند

### 3. فایل .gitignore:
- اضافه کردن قوانین جامع برای حذف فایل‌های غیرضروری
- پوشش کامل فایل‌های موقت و cache
- اضافه کردن قوانین برای فایل‌های deployment

### 4. اسکریپت deployment:
- ایجاد `deploy.js` برای اتوماسیون فرآیند build
- پاک‌سازی خودکار فایل‌های غیرضروری
- ایجاد package.json بهینه برای production
- کپی خودکار فایل‌های ضروری

## دستورات جدید

### برای build و deployment:
```bash
npm run deploy
```

### برای نصب کامل:
```bash
npm run install:all
```

### برای اجرای production:
```bash
npm run start:prod
```

## حجم کاهش یافته

### قبل از بهینه‌سازی:
- کل پروژه: ~500MB (شامل node_modules)
- فایل‌های اصلی: ~50MB

### بعد از بهینه‌سازی:
- کل پروژه: ~10MB (بدون node_modules)
- فایل‌های اصلی: ~8MB
- کاهش 80% حجم

## نکات مهم

1. **فایل‌های حذف شده قابل بازسازی هستند** با اجرای `npm install`
2. **برای آپلود روی سرور** فقط پوشه `dist` نیاز است
3. **فایل‌های .env** باید جداگانه تنظیم شوند
4. **دیتابیس** باید جداگانه ایجاد شود

## مراحل آپلود روی سرور

1. اجرای `npm run deploy`
2. آپلود پوشه `dist` به سرور
3. اجرای `npm install` در پوشه `dist` روی سرور
4. تنظیم فایل‌های .env
5. اجرای `npm start`

## فایل‌های ضروری برای آپلود

- `dist/` (کل پوشه)
- `.htaccess`
- `ecosystem.config.js` (برای PM2)
- فایل‌های .env (جداگانه)

## فایل‌های غیرضروری (حذف شده)

- `node_modules/`
- `src/assets/react.svg`
- `public/vite.svg`
- کامپوننت‌های قدیمی
- فایل‌های cache و موقت
