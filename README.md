# 🏠 Amlak Web - سیستم مدیریت املاک

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa)

[![GitHub stars](https://img.shields.io/github/stars/mmdcode/amlak-web?style=social)](https://github.com/mmdcode/amlak-web/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mmdcode/amlak-web?style=social)](https://github.com/mmdcode/amlak-web/network)
[![GitHub issues](https://img.shields.io/github/issues/mmdcode/amlak-web)](https://github.com/mmdcode/amlak-web/issues)
[![GitHub license](https://img.shields.io/github/license/mmdcode/amlak-web)](https://github.com/mmdcode/amlak-web/blob/main/LICENSE)

**🚀 Live Demo:** [http://amlak.venusbox.ir/](http://amlak.venusbox.ir/)

**📱 PWA Ready:** قابل نصب روی موبایل و دسکتاپ

</div>

---

🏢 **سیستم کامل مدیریت املاک** با React.js و Node.js؛ مدیریت آگهی‌های املاک، جستجوی پیشرفته، نقشه تعاملی Leaflet، پنل مدیریت با نمودارها، سیستم احراز هویت JWT، آپلود تصاویر، فیلترهای پیشرفته و طراحی ریسپانسیو RTL. 🚀 PWA آماده، SEO بهینه، بدون بک‌اند؛ آماده دمو برای کارفرما و دیپلوی روی cPanel/GitHub Pages.

amlak.venusbox.ir/

## ویژگی‌ها (FA)

* مدیریت کامل آگهی‌های املاک با آپلود تصاویر Drag & Drop
* جستجوی پیشرفته با فیلترهای متعدد (قیمت، موقعیت، نوع ملک)
* نقشه تعاملی Leaflet با نمایش موقعیت املاک
* سیستم احراز هویت JWT با مدیریت نقش‌ها (کاربر/مدیر)
* پنل مدیریت با آمار و نمودارهای تحلیلی Chart.js
* طراحی ریسپانسیو و RTL با Tailwind CSS
* PWA (Service Worker + Manifest) برای نصب روی دستگاه
* SEO بهینه با Meta Tags، Sitemap و Structured Data
* بهینه‌سازی کامل Performance با Code Splitting و Lazy Loading

## امنیت (FA)

* احراز هویت امن با JWT و bcryptjs برای رمزنگاری پسوردها
* محافظت در برابر SQL Injection و XSS
* Rate Limiting برای محدودیت درخواست‌ها
* CORS Configuration مناسب
* Input Validation کامل
* متغیرهای محیطی امن در .env
* HTTPS اجباری در production

## اجرا (FA)

### پیش‌نیازها
- Node.js (نسخه 18 یا بالاتر)
- MySQL (نسخه 8 یا بالاتر)
- npm یا yarn

### مراحل نصب

1. **کلون و نصب وابستگی‌ها:**

```bash
git clone https://github.com/mmdcode/amlak-web.git
cd amlak-web
npm install
cd Backend && npm install && cd ..
```

2. **تنظیم دیتابیس MySQL:**

```sql
CREATE DATABASE amlak_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **تنظیم متغیرهای محیطی:**

فایل `.env` در پوشه `Backend/` ایجاد کنید:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=amlak_web
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. **اجرای Backend (در ترمینال اول):**

```bash
npm run backend:dev
```

5. **اجرای Frontend (در ترمینال دوم):**

```bash
npm run dev
```

6. **Build نهایی:**

```bash
npm run build
```

### ⚠️ نکات مهم:
- **Backend باید قبل از Frontend اجرا شود**
- **پورت 5000 باید آزاد باشد**
- **MySQL باید در حال اجرا باشد**
- **فایل .env باید در پوشه Backend قرار گیرد**

## تکنولوژی‌ها (FA)

* **Frontend:** React.js 19, Vite, Tailwind CSS, React Router, Leaflet, Chart.js
* **Backend:** Node.js, Express.js, MySQL, JWT, Multer, bcryptjs
* **Tools:** ESLint, PostCSS, PM2
* **PWA:** Service Worker, Manifest, Offline Support
* **SEO:** Meta Tags, Sitemap, Structured Data, Open Graph

## راهنمای توسعه/مشارکت (FA)

* ساختار ماژولار و قابل نگهداری
* کدنویسی تمیز با ESLint
* کامنت‌گذاری مناسب
* تست‌نویسی برای قابلیت‌های جدید
* حفظ طراحی ریسپانسیو و RTL
* بهینه‌سازی Performance

### نکات مهم:
* برای امنیت بالاتر، از HTTPS در production استفاده کنید
* به‌روزرسانی منظم وابستگی‌ها
* Backup منظم دیتابیس
* مانیتورینگ لاگ‌ها

## لایسنس (FA)

این پروژه تحت لایسنس MIT منتشر شده است. جزئیات در فایل `LICENSE` موجود است.

---

اگر این پروژه برایتان مفید بود، لطفاً ⭐️ بدهید. ممنون از حمایت شما!

---

## Features (EN)

* Complete real estate management system with image upload and Drag & Drop
* Advanced search with multiple filters (price, location, property type)
* Interactive Leaflet map with property location display
* JWT authentication system with role management (user/admin)
* Admin panel with statistics and Chart.js analytics
* Responsive RTL design with Tailwind CSS
* PWA (Service Worker + Manifest) for device installation
* SEO optimized with Meta Tags, Sitemap and Structured Data
* Complete Performance optimization with Code Splitting and Lazy Loading

## Security (EN)

* Secure authentication with JWT and bcryptjs for password encryption
* Protection against SQL Injection and XSS
* Rate Limiting for request throttling
* Proper CORS Configuration
* Complete Input Validation
* Secure environment variables in .env
* HTTPS enforcement in production

## Getting Started (EN)

### Prerequisites
- Node.js (version 18 or higher)
- MySQL (version 8 or higher)
- npm or yarn

### Installation Steps

1. **Clone and install dependencies:**

```bash
git clone https://github.com/mmdcode/amlak-web.git
cd amlak-web
npm install
cd Backend && npm install && cd ..
```

2. **Setup MySQL database:**

```sql
CREATE DATABASE amlak_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Configure environment variables:**

Create `.env` file in `Backend/` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=amlak_web
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. **Run Backend (in first terminal):**

```bash
npm run backend:dev
```

5. **Run Frontend (in second terminal):**

```bash
npm run dev
```

6. **Build for production:**

```bash
npm run build
```

### ⚠️ Important Notes:
- **Backend must be running before Frontend**
- **Port 5000 must be available**
- **MySQL must be running**
- **.env file must be in Backend folder**

## Tech Stack (EN)

* **Frontend:** React.js 19, Vite, Tailwind CSS, React Router, Leaflet, Chart.js
* **Backend:** Node.js, Express.js, MySQL, JWT, Multer, bcryptjs
* **Tools:** ESLint, PostCSS, PM2
* **PWA:** Service Worker, Manifest, Offline Support
* **SEO:** Meta Tags, Sitemap, Structured Data, Open Graph

## Contributing (EN)

* Modular and maintainable structure
* Clean code with ESLint
* Proper commenting
* Testing for new features
* Maintain responsive and RTL design
* Performance optimization

### Important Notes:
* Use HTTPS in production for higher security
* Regular dependency updates
* Regular database backups
* Log monitoring

## License (EN)

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

If this project was helpful, please give it a ⭐️. Thank you for your support!