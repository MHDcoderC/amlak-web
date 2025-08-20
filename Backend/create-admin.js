const User = require('./models/User');
const { testConnection, initDatabase } = require('./config/database');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Test database connection
    await testConnection();
    await initDatabase();
    
    // Check if admin already exists
    const existingAdmin = await User.findAdmin();
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      return;
    }

    // Create admin user
    const adminId = await User.create({
      name: 'مدیر سیستم',
      phone: '09123456789',
      username: 'admin',
      password: 'admin123',
      email: 'admin@amlak.com',
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Admin ID:', adminId);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdminUser();
