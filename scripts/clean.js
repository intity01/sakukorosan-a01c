#!/usr/bin/env node

/**
 * Clean build artifacts and temporary files
 */

const fs = require('fs')
const path = require('path')

const dirsToClean = [
  '.next',
  'out',
  'dist',
  'node_modules/.cache'
]

const filesToClean = [
  '*.log',
  '*.tsbuildinfo'
]

console.log('🧹 Cleaning build artifacts...\n')

// Clean directories
dirsToClean.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir)
  if (fs.existsSync(dirPath)) {
    console.log(`  Removing ${dir}/`)
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
})

// Clean files
filesToClean.forEach(pattern => {
  const files = fs.readdirSync(process.cwd())
  files.forEach(file => {
    if (file.match(new RegExp(pattern.replace('*', '.*')))) {
      console.log(`  Removing ${file}`)
      fs.unlinkSync(path.join(process.cwd(), file))
    }
  })
})

console.log('\n✅ Clean complete!')
