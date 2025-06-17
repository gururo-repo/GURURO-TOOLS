#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync, readdirSync } from 'fs';

console.log('🚀 Starting Vercel build process...');
console.log('📍 Current working directory:', process.cwd());
console.log('📁 Directory contents:', readdirSync('.'));

// Clean dist directory
if (existsSync('dist')) {
  rmSync('dist', { recursive: true, force: true });
}
mkdirSync('dist', { recursive: true });

// Install dependencies and build each app individually
console.log('📦 Installing dependencies for landing page...');
try {
  process.chdir('apps/landing');
  console.log('📍 Current directory:', process.cwd());
  console.log('📄 Package.json exists:', existsSync('package.json'));

  execSync('npm install', { stdio: 'inherit' });

  console.log('📦 Building landing page...');
  // Landing page builds directly to dist root
  execSync('npm run build', { stdio: 'inherit' });

  process.chdir('../..');
} catch (error) {
  console.error('❌ Landing page build failed:', error.message);
  process.exit(1);
}

console.log('📦 Installing dependencies for JobNest...');
try {
  process.chdir('apps/jobnest');
  console.log('📍 Current directory:', process.cwd());
  console.log('📄 Package.json exists:', existsSync('package.json'));

  execSync('npm install', { stdio: 'inherit' });
  console.log('📦 Building JobNest...');
  execSync('npm run build', { stdio: 'inherit' });
  process.chdir('../..');
} catch (error) {
  console.error('❌ JobNest build failed:', error.message);
  process.exit(1);
}

console.log('📦 Installing dependencies for Resume Refiner...');
try {
  process.chdir('apps/resume-refiner');
  console.log('📍 Current directory:', process.cwd());
  console.log('📄 Package.json exists:', existsSync('package.json'));

  execSync('npm install', { stdio: 'inherit' });
  console.log('📦 Building Resume Refiner...');
  execSync('npm run build', { stdio: 'inherit' });
  process.chdir('../..');
} catch (error) {
  console.error('❌ Resume Refiner build failed:', error.message);
  process.exit(1);
}

// Verify dist structure
console.log('✅ Build complete!');
console.log('📁 Final dist/ contents:');
try {
  const distContents = readdirSync('dist', { withFileTypes: true });
  distContents.forEach(item => {
    const type = item.isDirectory() ? '📁' : '📄';
    console.log(`  ${type} ${item.name}`);
    
    if (item.isDirectory()) {
      try {
        const subContents = readdirSync(`dist/${item.name}`);
        subContents.slice(0, 3).forEach(subItem => {
          console.log(`    📄 ${subItem}`);
        });
        if (subContents.length > 3) {
          console.log(`    ... and ${subContents.length - 3} more files`);
        }
      } catch (e) {
        console.log(`    (could not read contents)`);
      }
    }
  });
} catch (error) {
  console.log('❌ Could not read dist directory:', error.message);
  process.exit(1);
}

// Ensure we have an index.html in the root
if (!existsSync('dist/index.html')) {
  console.error('❌ No index.html found in dist root!');
  process.exit(1);
}

console.log('🎉 Vercel build successful!');
