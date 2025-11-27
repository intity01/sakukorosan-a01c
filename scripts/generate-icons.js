#!/usr/bin/env node

/**
 * Generate app icons for all platforms
 * Requires: npm install sharp
 */

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const SOURCE_ICON = path.join(__dirname, '../public/sakukoro-mascot.png')
const OUTPUT_DIR = path.join(__dirname, '../public/icons')

// Icon sizes for different platforms
const ICON_SIZES = {
  // Windows Store
  windows: [44, 50, 71, 89, 107, 142, 150, 284, 310],

  // macOS App Store
  macos: [16, 32, 64, 128, 256, 512, 1024],

  // Android (Play Store, AppGallery)
  android: [36, 48, 72, 96, 144, 192, 512],

  // iOS (App Store)
  ios: [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024],

  // Web/PWA
  web: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512]
}

async function generateIcons() {
  console.log('🎨 Generating app icons...\n')

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Check if source icon exists
  if (!fs.existsSync(SOURCE_ICON)) {
    console.error('❌ Source icon not found:', SOURCE_ICON)
    process.exit(1)
  }

  const image = sharp(SOURCE_ICON)

  for (const [platform, sizes] of Object.entries(ICON_SIZES)) {
    console.log(`📱 Generating ${platform} icons...`)

    const platformDir = path.join(OUTPUT_DIR, platform)
    if (!fs.existsSync(platformDir)) {
      fs.mkdirSync(platformDir, { recursive: true })
    }

    for (const size of sizes) {
      const outputPath = path.join(platformDir, `icon-${size}x${size}.png`)

      await image
        .clone()
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath)

      console.log(`  ✅ ${size}x${size}`)
    }
  }

  // Generate ICO for Windows
  console.log('\n🪟 Generating Windows ICO...')
  // Note: sharp doesn't support ICO, use online converter or electron-icon-builder

  // Generate ICNS for macOS
  console.log('🍎 Generating macOS ICNS...')
  // Note: sharp doesn't support ICNS, use iconutil on macOS

  console.log('\n✅ Icon generation complete!')
  console.log(`📁 Output directory: ${OUTPUT_DIR}`)
  console.log('\n📝 Note: For ICO and ICNS files, use:')
  console.log('   - Windows: electron-icon-builder or online converter')
  console.log('   - macOS: iconutil command')
}

generateIcons().catch(console.error)
