/**
 * Convert PNG to ICO for Windows
 *
 * This script converts the app icon to .ico format for Windows
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = path.join(__dirname, '../public/sakudoko-icon.png');
const OUTPUT_ICO = path.join(__dirname, '../public/icon.ico');
const OUTPUT_PNG = path.join(__dirname, '../public/icon.png');

async function convertIcon() {
  console.log('🎨 Converting icon for Windows...\n');

  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('❌ Source image not found:', SOURCE_IMAGE);
    console.error('Please save your icon as public/sakudoko-icon.png');
    process.exit(1);
  }

  try {
    // Create 256x256 PNG for Electron
    await sharp(SOURCE_IMAGE)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(OUTPUT_PNG);

    console.log('✅ Created icon.png (256x256)');

    // For ICO, we need to use a different approach
    // Sharp doesn't support ICO output, so we'll create multiple sizes
    const sizes = [16, 32, 48, 64, 128, 256];

    for (const size of sizes) {
      const outputPath = path.join(__dirname, `../public/icon-${size}.png`);
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Created icon-${size}.png`);
    }

    console.log('\n🎉 Icon conversion complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Use an online tool to convert PNG to ICO:');
    console.log('   - https://convertio.co/png-ico/');
    console.log('   - https://www.icoconverter.com/');
    console.log('2. Upload public/icon-256.png');
    console.log('3. Download as icon.ico');
    console.log('4. Save to public/icon.ico');
    console.log('5. Run: npm run electron:build:win');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

convertIcon();
