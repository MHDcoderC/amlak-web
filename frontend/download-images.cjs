const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Create directories
const publicDir = path.join(__dirname, 'public', 'images');
const heroDir = path.join(publicDir, 'hero');
const propertiesDir = path.join(publicDir, 'properties');

[publicDir, heroDir, propertiesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// Hero images - reliable sources
const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    filename: 'hero-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
    filename: 'hero-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
    filename: 'hero-3.jpg'
  }
];

// Property images - using Picsum (Lorem Picsum) for reliable random images
const propertyImages = [
  // Set 1: Different seeds for variety
  'https://picsum.photos/seed/house1/800/600',
  'https://picsum.photos/seed/apartment1/800/600',
  'https://picsum.photos/seed/villa1/800/600',
  'https://picsum.photos/seed/office1/800/600',
  'https://picsum.photos/seed/shop1/800/600',
  // Set 2
  'https://picsum.photos/seed/house2/800/600',
  'https://picsum.photos/seed/apartment2/800/600',
  'https://picsum.photos/seed/villa2/800/600',
  'https://picsum.photos/seed/office2/800/600',
  'https://picsum.photos/seed/shop2/800/600',
  // Set 3
  'https://picsum.photos/seed/house3/800/600',
  'https://picsum.photos/seed/apartment3/800/600',
  'https://picsum.photos/seed/villa3/800/600',
  'https://picsum.photos/seed/office3/800/600',
  'https://picsum.photos/seed/shop3/800/600',
  // Set 4
  'https://picsum.photos/seed/house4/800/600',
  'https://picsum.photos/seed/apartment4/800/600',
  'https://picsum.photos/seed/villa4/800/600',
  'https://picsum.photos/seed/office4/800/600',
  'https://picsum.photos/seed/shop4/800/600',
  // Set 5
  'https://picsum.photos/seed/house5/800/600',
  'https://picsum.photos/seed/apartment5/800/600',
  'https://picsum.photos/seed/villa5/800/600',
  'https://picsum.photos/seed/office5/800/600',
  'https://picsum.photos/seed/shop5/800/600',
  // Set 6
  'https://picsum.photos/seed/house6/800/600',
  'https://picsum.photos/seed/apartment6/800/600',
  'https://picsum.photos/seed/villa6/800/600',
  'https://picsum.photos/seed/office6/800/600',
  'https://picsum.photos/seed/shop6/800/600'
];

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const stats = fs.statSync(filepath);
        console.log(`  ✅ Downloaded: ${path.basename(filepath)} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.log(`  ❌ Failed: ${path.basename(filepath)}`);
    throw error;
  }
}

async function downloadAllImages() {
  console.log('=================================');
  console.log('  📸 Downloading Images');
  console.log('  املاک ایران');
  console.log('=================================\n');

  // Download hero images
  console.log('🏠 Downloading Hero Images...');
  for (const img of heroImages) {
    const filepath = path.join(heroDir, img.filename);
    if (fs.existsSync(filepath)) {
      console.log(`  ⏭️  Skipped (exists): ${img.filename}`);
      continue;
    }
    try {
      await downloadImage(img.url, filepath);
    } catch (error) {
      console.log(`  ⚠️  Could not download hero image: ${img.filename}`);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n🏢 Downloading Property Images...');
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < propertyImages.length; i++) {
    const filename = `property-${(i + 1).toString().padStart(2, '0')}.jpg`;
    const filepath = path.join(propertiesDir, filename);

    if (fs.existsSync(filepath)) {
      skipped++;
      continue;
    }

    try {
      await downloadImage(propertyImages[i], filepath);
      downloaded++;
    } catch (error) {
      failed++;
    }

    // Progress indicator every 5 images
    if ((i + 1) % 5 === 0) {
      console.log(`  📊 Progress: ${i + 1}/${propertyImages.length} (✅${downloaded} ⏭️${skipped} ❌${failed})`);
    }

    // Delay between downloads
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n=================================');
  console.log('  ✅ Download Complete!');
  console.log('=================================');
  console.log(`📊 Stats:`);
  console.log(`   Downloaded: ${downloaded}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);

  // List all downloaded images
  const heroFiles = fs.readdirSync(heroDir);
  const propertyFiles = fs.readdirSync(propertiesDir);

  console.log(`\n📁 Hero Images: ${heroFiles.length} files`);
  console.log(`📁 Property Images: ${propertyFiles.length} files`);

  if (failed > 0) {
    console.log('\n⚠️  Some images failed to download. Run the script again to retry.');
  } else {
    console.log('\n🎉 All images downloaded successfully!');
  }
}

// Run the download
downloadAllImages().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
