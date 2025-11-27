/**
 * Fix HTML paths for Electron
 *
 * This script fixes the paths in the exported HTML files to work with Electron's file:// protocol
 */

const fs = require('fs');
const path = require('path');

function fixHtmlFile(filePath) {
  console.log(`Fixing: ${filePath}`);

  let html = fs.readFileSync(filePath, 'utf8');

  // Fix paths for Electron file:// protocol
  // Add ./ prefix to _next paths that don't have it
  html = html.replace(/href="(_next\/[^"]+)"/g, 'href="./$1"');
  html = html.replace(/src="(_next\/[^"]+)"/g, 'src="./$1"');

  // Fix paths in inline scripts (self.__next_f.push)
  html = html.replace(/"_next\//g, '"./_next/');

  // Avoid double ./ prefix
  html = html.replace(/"\.\.\/_next\//g, '"./_next/');
  html = html.replace(/href="\.\/\.\/(_next)/g, 'href="./$1');
  html = html.replace(/src="\.\/\.\/(_next)/g, 'src="./$1');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

function fixAllHtmlFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fixAllHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      fixHtmlFile(filePath);
    }
  });
}

const outDir = path.join(__dirname, '../out');

if (!fs.existsSync(outDir)) {
  console.error('❌ out/ directory not found. Please run "npm run build" first.');
  process.exit(1);
}

console.log('🔧 Fixing HTML paths for Electron...\n');
fixAllHtmlFiles(outDir);
console.log('\n✅ All HTML files fixed!');
