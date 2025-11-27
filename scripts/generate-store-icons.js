/**
 * Generate Microsoft Store Icons
 *
 * This script generates all required icon sizes for Microsoft Store submission
 * from a single source image (public/sakukoro-mascot.png)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes required by Microsoft Store
const ICON_SIZES = [
  { name: 'Square44x44Logo.png', width: 44, height: 44 },
  { name: 'Square71x71Logo.png', width: 71, height: 71 },
  { name: 'Square150x150Logo.png', width: 150, height: 150 },
  { name: 'Square310x310Logo.png', width: 310, height: 310 },
  { name: 'Wide310x150Logo.png', width: 310, height: 150 },
  { name: 'StoreLogo.png', width: 50, height: 50 },
  { name: 'SplashScreen.png', width: 620, height: 300 },
];

const SOURCE_IMAGE = path.join(__dirname, '../public/sakukoro-mascot.png');
const OUTPUT_DIR = path.join(__dirname, '../build-assets');

async function generateIcons() {
  console.log('🎨 Generating Microsoft Store icons...\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Created build-assets directory\n');
  }

  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('❌ Source image not found:', SOURCE_IMAGE);
    console.error('Please make sure public/sakukoro-mascot.png exists');
    process.exit(1);
  }

  // Generate each icon size
  for (const icon of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, icon.name);

    try {
      await sharp(SOURCE_IMAGE)
        .resize(icon.width, icon.height, {
          fit: 'contain',
          background: { r: 254, g: 246, b: 243, alpha: 1 } // #fef6f3
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${icon.name} (${icon.width}x${icon.height})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
    }
  }

  console.log('\n🎉 All icons generated successfully!');
  console.log(`📁 Icons saved to: ${OUTPUT_DIR}`);
  console.log('\n📝 Next steps:');
  console.log('1. Review the generated icons in build-assets/');
  console.log('2. Update package.json with your Publisher ID from Partner Center');
  console.log('3. Run: npm run electron:build:win');
  console.log('4. Upload the .appx file to Microsoft Store');
}

// Run the script
generateIcons().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
