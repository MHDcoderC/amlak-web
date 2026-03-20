#!/usr/bin/env node

/**
 * Script to create an admin user for the Amlak Web application
 * Usage: node createAdmin.js
 */

const readline = require('readline');
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function createAdmin() {
  console.log('=================================');
  console.log('  ایجاد کاربر مدیر - املاک ایران');
  console.log('  ورژن 2.0 - MongoDB Edition');
  console.log('=================================\n');

  try {
    // Connect to MongoDB
    console.log('⏳ در حال اتصال به MongoDB...');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/amlak_db');

    console.log('✅ اتصال به MongoDB موفق!\n');

    // Get admin details
    const name = await question('نام و نام خانوادگی: ');
    const email = await question('ایمیل (اختیاری): ');
    const phone = await question('شماره موبایل: ');
    const username = await question('نام کاربری: ');
    const password = await question('رمز عبور (حداقل 6 کاراکتر): ');
    const confirmPassword = await question('تکرار رمز عبور: ');

    // Validation
    if (!name || !phone || !username || !password) {
      console.log('\n❌ خطا: فیلدهای نام، موبایل، نام کاربری و رمز عبور الزامی هستند');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('\n❌ خطا: رمز عبور باید حداقل 6 کاراکتر باشد');
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.log('\n❌ خطا: رمز عبور و تکرار آن مطابقت ندارند');
      process.exit(1);
    }

    // Phone validation (Iranian mobile)
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      console.log('\n❌ خطا: شماره موبایل نامعتبر است (باید با 09 شروع شود و 11 رقم باشد)');
      process.exit(1);
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      console.log('\n❌ خطا: نام کاربری فقط می‌تواند شامل حروف، اعداد و _ باشد');
      process.exit(1);
    }

    // Check if username already exists
    const existingUserByUsername = await User.findByUsername(username);
    if (existingUserByUsername) {
      console.log('\n❌ خطا: این نام کاربری قبلاً استفاده شده است');
      process.exit(1);
    }

    // Check if phone already exists
    const existingUserByPhone = await User.findByPhone(phone);
    if (existingUserByPhone) {
      console.log('\n❌ خطا: این شماره موبایل قبلاً ثبت شده است');
      process.exit(1);
    }

    // Create admin user
    console.log('\n⏳ در حال ایجاد کاربر مدیر...');

    const adminData = {
      name: name.trim(),
      phone: phone.trim(),
      username: username.trim().toLowerCase(),
      password: password,
      role: 'admin',
      isActive: true,
      isBanned: false
    };

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email.trim())) {
        adminData.email = email.trim().toLowerCase();
      }
    }

    const user = await User.create(adminData);

    console.log('\n=================================');
    console.log('  ✅ کاربر مدیر با موفقیت ایجاد شد');
    console.log('=================================\n');
    console.log('📋 اطلاعات کاربر:');
    console.log(`   شناسه: ${user._id}`);
    console.log(`   نام: ${user.name}`);
    console.log(`   نام کاربری: ${user.username}`);
    console.log(`   موبایل: ${user.phone}`);
    if (user.email) console.log(`   ایمیل: ${user.email}`);
    console.log(`   نقش: ${user.role}`);
    console.log('\n🔑 می‌توانید با نام کاربری و رمز عبور وارد سیستم شوید');

  } catch (error) {
    console.error('\n❌ خطا در ایجاد کاربر:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  createAdmin();
}

module.exports = { createAdmin };
