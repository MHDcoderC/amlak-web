import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚀 Starting deployment process...');

// Clean up function
function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    try {
      console.log(`🧹 Cleaning ${dir}...`);
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (error) {
      console.log(`⚠️ Could not clean ${dir}: ${error.message}`);
    }
  }
}

// Create directory function
function createDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`📁 Creating ${dir}...`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

try {
  // Clean previous builds
  cleanDirectory('dist');

  console.log('📦 Installing dependencies...');
  
  // Install frontend dependencies
  execSync('npm install', { stdio: 'inherit' });
  
  // Install backend dependencies
  execSync('cd Backend && npm install', { stdio: 'inherit' });

  console.log('🔨 Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📋 Copying backend to dist...');
  execSync('npm run copy-backend', { stdio: 'inherit' });

  // Create uploads directory in dist
  createDirectory('dist/Backend/uploads');

  // Copy .htaccess to dist
  if (fs.existsSync('.htaccess')) {
    fs.copyFileSync('.htaccess', 'dist/.htaccess');
    console.log('📄 Copied .htaccess');
  }

  // Copy ecosystem.config.js to dist
  if (fs.existsSync('ecosystem.config.js')) {
    fs.copyFileSync('ecosystem.config.js', 'dist/ecosystem.config.js');
    console.log('⚙️ Copied ecosystem.config.js');
  }

  // Create production package.json for dist
  const prodPackageJson = {
    name: "amlak-web-prod",
    version: "1.0.0",
    private: true,
    scripts: {
      start: "node Backend/server.js"
    },
    dependencies: {
      "bcryptjs": "^2.4.3",
      "cors": "^2.8.5",
      "dotenv": "^17.2.1",
      "express": "^4.18.2",
      "express-rate-limit": "^7.5.1",
      "jsonwebtoken": "^9.0.2",
      "mysql2": "^3.9.2",
      "multer": "^2.0.2"
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2));
  console.log('📄 Created production package.json');

  // Remove unnecessary files from dist
  const filesToRemove = [
    'dist/Backend/node_modules',
    'dist/Backend/package-lock.json',
    'dist/Backend/create-admin.js'
  ];

  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        if (fs.lstatSync(file).isDirectory()) {
          fs.rmSync(file, { recursive: true, force: true });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`🗑️ Removed ${file}`);
      } catch (error) {
        console.log(`⚠️ Could not remove ${file}: ${error.message}`);
      }
    }
  });

  console.log('✅ Deployment build completed successfully!');
  console.log('📁 Production files are ready in the "dist" directory');
  console.log('🚀 You can now upload the "dist" folder to your server');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
