const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Configuration
const obfuscatorConfig = require('./obfuscator.config.json');

// Directories
const sourceDir = path.join(__dirname, 'out');
const excludeDirs = ['node_modules', '_next/static/chunks/webpack'];
const excludeFiles = ['polyfills', 'main', 'webpack', 'preload'];

// Function to check if path should be excluded
function shouldExclude(filePath) {
  return excludeDirs.some(dir => filePath.includes(dir)) ||
         excludeFiles.some(file => path.basename(filePath).includes(file));
}

// Function to obfuscate a file
function obfuscateFile(filePath) {
  if (shouldExclude(filePath)) {
    console.log(`⏭️  Skipping: ${filePath}`);
    return;
  }

  try {
    const code = fs.readFileSync(filePath, 'utf8');

    // Skip if file is too large (> 500KB) to avoid performance issues
    if (code.length > 500000) {
      console.log(`⏭️  File too large, skipping: ${filePath}`);
      return;
    }

    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscatorConfig);
    fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
    console.log(`✅ Obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error obfuscating ${filePath}:`, error.message);
  }
}

// Function to recursively obfuscate directory
function obfuscateDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      obfuscateDirectory(filePath);
    } else if (path.extname(filePath) === '.js') {
      obfuscateFile(filePath);
    }
  });
}

// Main execution
console.log('🔐 Starting code obfuscation...\n');

if (!fs.existsSync(sourceDir)) {
  console.error('❌ Error: out directory not found. Please run "npm run build" first.');
  process.exit(1);
}

obfuscateDirectory(sourceDir);

// Also obfuscate electron main files
const electronDir = path.join(__dirname, 'electron');
if (fs.existsSync(electronDir)) {
  console.log('\n🔐 Obfuscating Electron files...\n');
  obfuscateDirectory(electronDir);
}

console.log('\n✅ Code obfuscation completed!');
