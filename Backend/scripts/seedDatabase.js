#!/usr/bin/env node

/**
 * Database Seeder Script for Amlak Web
 * Creates 30 realistic ads with random users, images, and specifications
 * Usage: node scripts/seedDatabase.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const User = require('../models/User');
const Ad = require('../models/Ad');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Sample data for realistic generation
const provinces = [
  { name: 'تهران', cities: ['تهران', 'شهریار', 'ورامین', 'فیروزکوه', 'دماوند', 'پردیس', 'پیشوا', 'رباط کریم'] },
  { name: 'اصفهان', cities: ['اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر', 'شاهین‌شهر', 'مبارکه', 'فولادشهر'] },
  { name: 'خراسان رضوی', cities: ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'کاشمر', 'گناباد', 'قوچان'] },
  { name: 'فارس', cities: ['شیراز', 'مرودشت', 'جهرم', 'فسا', 'کازرون', 'لار', 'داراب', 'نی ریز'] },
  { name: 'گیلان', cities: ['رشت', 'انزلی', 'لاهیجان', 'آستارا', 'تالش', 'فومن', 'صومعه سرا', 'رودسر'] },
  { name: 'مازندران', cities: ['ساری', 'بابل', 'آمل', 'قائم‌شهر', 'نوشهر', 'چالوس', 'تنکابن', 'نکا'] },
  { name: 'آذربایجان شرقی', cities: ['تبریز', 'مراغه', 'میانه', 'اهر', 'بناب', 'سراب', 'شبستر'] },
  { name: 'خوزستان', cities: ['اهواز', 'دزفول', 'ماهشهر', 'ایذه', 'شوشتر', 'شوش', 'اندیمشک', 'بهبهان'] }
];

const propertyTypes = [
  { type: 'apartment', titles: ['آپارتمان لوکس', 'آپارتمان نوساز', 'آپارتمان فروشی', 'آپارتمان شهرکی', 'آپارتمان مرکز شهر'] },
  { type: 'villa', titles: ['ویلای دوبلکس', 'ویلای باغ‌دار', 'ویلای ساحلی', 'ویلای کوهستانی', 'ویلای لوکس'] },
  { type: 'office', titles: ['دفتر کار', 'دفتر اداری', 'دفتر تجاری', 'دفتر مرکزی', 'دفتر مجهز'] },
  { type: 'shop', titles: ['مغازه تجاری', 'فروشگاه', 'بازارچه', 'مغازه زیرپیلوتی', 'مغازه شیک'] },
  { type: 'land', titles: ['زمین مسکونی', 'زمین تجاری', 'زمین زراعی', 'زمین باغ', 'زمین کوهستانی'] }
];

const adjectives = ['شیک', 'لوکس', 'نوساز', 'قدیمی‌ساز', 'بازسازی‌شده', 'مبله', 'خالی', 'آفتاب‌گیر', 'دنج', 'دنج و آرام'];
const features = ['دارای پارکینگ', 'دارای آسانسور', 'نزدیک به مترو', 'نزدیک به بازار', 'ویو عالی', 'امنیت ۲۴ ساعته', 'دارای استخر', 'دارای سالن ورزشی'];

// Generate random Iranian phone number
function generatePhone() {
  const prefixes = ['0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919', '0990', '0991'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return prefix + suffix;
}

// Generate random username (ASCII only - matches User model regex)
function generateUsername() {
  const adjectives = ['smart', 'golden', 'prime', 'urban', 'royal', 'modern', 'green', 'blue'];
  const nouns = ['home', 'estate', 'villa', 'agent', 'house', 'trade', 'city', 'owner'];
  const random = Math.floor(Math.random() * 100000);
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}_${noun}_${random}`;
}

// Generate random price
function generatePrice() {
  const base = Math.floor(Math.random() * 50) + 10; // 10 to 60
  return base * 100000000; // In Tomans (1 billion to 6 billion)
}

// Generate random coordinates for Iran
function generateCoordinates(provinceName) {
  const province = provinces.find(p => p.name === provinceName);
  const baseCoords = {
    'تهران': { lat: 35.6892, lng: 51.3890 },
    'اصفهان': { lat: 32.6546, lng: 51.6680 },
    'خراسان رضوی': { lat: 35.2216, lng: 59.1042 },
    'فارس': { lat: 29.5917, lng: 52.5836 },
    'گیلان': { lat: 37.2809, lng: 49.5924 },
    'مازندران': { lat: 36.2262, lng: 52.5319 },
    'آذربایجان شرقی': { lat: 38.0962, lng: 46.2738 },
    'خوزستان': { lat: 31.3183, lng: 48.6706 }
  };

  const base = baseCoords[provinceName] || { lat: 35.6892, lng: 51.3890 };
  const lat = base.lat + (Math.random() - 0.5) * 0.1;
  const lng = base.lng + (Math.random() - 0.5) * 0.1;

  return { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };
}

/** Same naming as frontend/download-images.cjs (property-01.jpg … property-30.jpg) */
function getDefaultRemotePropertyFilenames() {
  const names = [];
  for (let i = 1; i <= 30; i += 1) {
    names.push(`property-${String(i).padStart(2, '0')}.jpg`);
  }
  return names;
}

function parseRemoteFilenamesFromEnv() {
  const raw = process.env.SEED_PROPERTY_IMAGE_FILENAMES;
  if (!raw || !String(raw).trim()) return null;
  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Base URL for seeded property images on the server (no trailing slash), e.g. https://amlak.mmdcode.top/images/properties */
function getRemotePropertyImagesBaseUrl() {
  const u = process.env.SEED_PROPERTY_IMAGES_BASE_URL;
  if (!u || !String(u).trim()) return '';
  return String(u).replace(/\/+$/, '');
}

function joinRemotePropertyUrl(base, filename) {
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`;
  return new URL(filename, baseWithSlash).href;
}

// Get random local property images, or full URLs from SEED_PROPERTY_IMAGES_BASE_URL when no local folder
function getRandomPropertyImages(count = 3) {
  const candidateDirs = [
    // Preferred (this repo keeps demo images under frontend/public)
    path.join(__dirname, '../../frontend/public/images/properties'),
    // Production builds may relocate downloaded assets under dist
    path.join(__dirname, '../../frontend/dist/images/properties'),
    // Legacy/fallback candidate locations
    path.join(__dirname, '../../public/images/properties'),
    path.join(__dirname, '../../dist/images/properties')
  ];
  const uploadsDir = path.join(__dirname, '../uploads');
  const allowedExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Check if property images exist
  let availableImages = [];
  for (const dir of candidateDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
        .filter((f) => allowedExts.has(path.extname(f).toLowerCase()))
        .map((f) => ({
          // Used only if copy fails; the normal flow returns /uploads/...
          relative: `/images/properties/${f}`,
          fullPath: path.join(dir, f)
        }));
      availableImages.push(...files);
    }
  }

  // Remote/CDN: same paths as static hosting (e.g. /images/properties on production domain)
  if (availableImages.length === 0) {
    const remoteBase = getRemotePropertyImagesBaseUrl();
    if (remoteBase) {
      const filenames = parseRemoteFilenamesFromEnv() || getDefaultRemotePropertyFilenames();
      const remoteUrls = filenames.map((name) => joinRemotePropertyUrl(remoteBase, name));
      const shuffled = remoteUrls.sort(() => 0.5 - Math.random());
      const picked = shuffled.slice(0, Math.min(count, shuffled.length));
      console.log(
        `   📎 Using ${picked.length} remote property image URL(s) from ${remoteBase}`
      );
      return picked;
    }
  }

  // If no local images and no remote base
  if (availableImages.length === 0) {
    console.log(
      '   ⚠️  No local property images found in expected folders (frontend/public/images/properties / frontend/dist/images/properties / public/images/properties). ' +
      'Either run (cd frontend && npm run download:images), or set SEED_PROPERTY_IMAGES_BASE_URL to your hosted folder (e.g. https://yourdomain.com/images/properties).'
    );
    return [];
  }

  // Shuffle and select random images
  const shuffled = availableImages.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Copy selected images to uploads folder with unique names
  return selected.map((imgObj, index) => {
    const sourcePath = imgObj.fullPath;
    const ext = path.extname(sourcePath).toLowerCase() || '.jpg';
    const filename = `ad-${Date.now()}-${index}${ext}`;
    const destPath = path.join(uploadsDir, filename);

    try {
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        return `/uploads/${filename}`;
      }
    } catch (error) {
      console.log(`   ⚠️  Could not copy image: ${error.message}`);
    }
    return imgObj.relative;
  });
}

// Generate random first name
function generateFirstName() {
  const names = ['علی', 'محمد', 'رضا', 'حسن', 'حسین', 'امیر', 'سعید', 'مهدی', 'حامد', 'پرهام',
    'سارا', 'مریم', 'نسترن', 'فاطمه', 'زهرا', 'الناز', 'نرگس', 'سمانه', 'آیدا', 'پریسا'];
  return names[Math.floor(Math.random() * names.length)];
}

// Generate random last name
function generateLastName() {
  const names = ['احمدی', 'رضایی', 'محمدی', 'حسنی', 'خسروی', 'نوری', 'کریمی', 'موسوی', 'جعفری', 'رحیمی',
    'نظری', 'عباسی', 'حسینی', 'غلامی', 'کاظمی', 'اکبری', 'عزیزی', 'نجفی', 'قاسمی', 'رستمی'];
  return names[Math.floor(Math.random() * names.length)];
}

// Create random users
async function createRandomUsers(count = 10) {
  const users = [];
  console.log(`👤 Creating ${count} random users...`);

  let attempts = 0;
  const maxAttempts = count * 10;

  while (users.length < count && attempts < maxAttempts) {
    attempts++;
    try {
      const firstName = generateFirstName();
      const lastName = generateLastName();
      const name = `${firstName} ${lastName}`;
      const phone = generatePhone();
      const username = generateUsername();

      // Check if user exists
      const existingUser = await User.findOne({ $or: [{ phone }, { username }] });
      if (existingUser) {
        console.log(`   User ${username} already exists, skipping...`);
        continue;
      }

      const user = await User.create({
        name,
        phone,
        username,
        password: '123456', // All users have same password for demo
        role: users.length === 0 ? 'admin' : 'user', // First created user is admin
        isActive: true,
        isBanned: false
      });

      users.push(user);
      console.log(`   ✅ Created user: ${name} (${username})`);
    } catch (error) {
      console.error(`   ❌ Error creating user:`, error.message);
    }
  }

  if (users.length < count) {
    console.log(`   ⚠️  Could only create ${users.length}/${count} users after ${attempts} attempts.`);
  }

  return users;
}

// Create random ads
async function createRandomAds(users, count = 30) {
  const ads = [];
  console.log(`\n🏠 Creating ${count} random ads...`);

  if (!users || users.length === 0) {
    console.log('   ❌ No users available. Aborting ad creation.');
    return ads;
  }

  for (let i = 0; i < count; i++) {
    try {
      // Select random province and city
      const province = provinces[Math.floor(Math.random() * provinces.length)];
      const city = province.cities[Math.floor(Math.random() * province.cities.length)];

      // Select random property type
      const propertyTypeObj = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const propertyType = propertyTypeObj.type;
      const titleBase = propertyTypeObj.titles[Math.floor(Math.random() * propertyTypeObj.titles.length)];

      // Generate title
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const title = `${titleBase} ${adjective} در ${city}`;

      // Generate description
      const feature1 = features[Math.floor(Math.random() * features.length)];
      const feature2 = features[Math.floor(Math.random() * features.length)];
      const description = `این ${titleBase} ${adjective} در بهترین منطقه ${city} واقع شده است. ${feature1} و ${feature2}. مناسب برای سکونت یا سرمایه‌گذاری. دسترسی عالی به مراکز خرید و حمل و نقل عمومی.`;

      // Generate specifications
      const area = Math.floor(Math.random() * 200) + 50; // 50 to 250 sqm
      const rooms = propertyType === 'land' ? null : Math.floor(Math.random() * 4) + 1;
      const price = generatePrice();
      const coords = generateCoordinates(province.name);

      // Get random local images
      const imageCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 images
      console.log(`   📸 Selecting ${imageCount} images for ad ${i + 1}...`);
      const images = getRandomPropertyImages(imageCount);

      // Select random user
      const user = users[Math.floor(Math.random() * users.length)];

      // Create ad
      const ad = await Ad.create({
        title,
        description,
        address: `خیابان ${generateFirstName()}، کوچه ${Math.floor(Math.random() * 50) + 1}، پلاک ${Math.floor(Math.random() * 100) + 1}`,
        province: province.name,
        city,
        lat: coords.lat,
        lng: coords.lng,
        images,
        phone: user.phone,
        userNotes: 'آگهی توسط سیستم تست ایجاد شده است',
        status: Math.random() > 0.3 ? 'approved' : 'pending', // 70% approved
        stars: Math.floor(Math.random() * 3) + 3, // 3 to 5 stars
        rating: (Math.random() * 2 + 3).toFixed(2), // 3.00 to 5.00
        viewCount: Math.floor(Math.random() * 1000),
        clickCount: Math.floor(Math.random() * 200),
        price,
        area,
        rooms,
        propertyType,
        userId: user._id
      });

      ads.push(ad);
      console.log(`   ✅ Created ad ${i + 1}: ${title.substring(0, 50)}...`);
    } catch (error) {
      console.error(`   ❌ Error creating ad ${i + 1}:`, error.message);
    }
  }

  return ads;
}

// Main seed function
async function seedDatabase() {
  console.log('=================================');
  console.log('  🌱 Database Seeder');
  console.log('  املاک ایران - ورژن 2.0');
  console.log('=================================\n');

  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/amlak_db');
    console.log('✅ Connected to MongoDB!\n');

    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question('⚠️  This will clear existing data and create new test data. Continue? (yes/no): ', (ans) => {
        resolve(ans.trim().toLowerCase());
      });
    });

    // Accept 'yes' or 'y'
    if (answer !== 'yes' && answer !== 'y') {
      console.log('❌ Seeding cancelled.');
      await mongoose.connection.close();
      rl.close();
      return;
    }

    rl.close();

    // Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await User.deleteMany({});
    await Ad.deleteMany({});
    console.log('✅ Existing data cleared!\n');

    // Create users
    const users = await createRandomUsers(10);
    console.log(`\n✅ Created ${users.length} users successfully!`);

    // Create ads
    const ads = await createRandomAds(users, 30);
    console.log(`\n✅ Created ${ads.length} ads successfully!`);

    // Summary
    console.log('\n=================================');
    console.log('  📊 Seeding Complete!');
    console.log('=================================');
    console.log(`👤 Users created: ${users.length}`);
    console.log(`🏠 Ads created: ${ads.length}`);
    console.log('\n🔑 Default password for all users: 123456');
    console.log('👑 First user is admin, others are regular users');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed.');
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, createRandomUsers, createRandomAds };
