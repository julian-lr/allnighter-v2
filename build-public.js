#!/usr/bin/env node

/**
 * Build script to create public directory for deployment
 * Copies all necessary files to a public folder
 */

import fs from 'fs';
import path from 'path';

// Clean and create public directory
if (fs.existsSync('public')) {
  fs.rmSync('public', { recursive: true, force: true });
}
fs.mkdirSync('public');

// Files and directories to copy
const itemsToCopy = [
  'index.html',
  'manifest.json', 
  'sw.js',
  'css',
  'img', 
  'js',
  'pages'
];

// Copy function
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    const items = fs.readdirSync(src);
    items.forEach(item => {
      copyRecursive(path.join(src, item), path.join(dest, item));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy all items
itemsToCopy.forEach(item => {
  if (fs.existsSync(item)) {
    console.log(`Copying ${item}...`);
    copyRecursive(item, path.join('public', item));
  } else {
    console.warn(`Warning: ${item} not found, skipping...`);
  }
});

console.log('✅ Public directory created successfully!');
console.log('📁 Contents:', fs.readdirSync('public'));
