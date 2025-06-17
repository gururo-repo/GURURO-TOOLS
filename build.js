#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync } from 'fs';

console.log('🚀 Starting multi-app build process...');

// Clean dist directory
if (existsSync('dist')) {
  rmSync('dist', { recursive: true, force: true });
}
mkdirSync('dist', { recursive: true });

// Function to safely run build with dependency check
function safeBuild(appName, appPath) {
  console.log(`📦 Building ${appName}...`);
  process.chdir(appPath);

  try {
    // Try to install missing dependencies first
    console.log(`🔧 Ensuring dependencies for ${appName}...`);
    execSync('npm install', { stdio: 'inherit' });

    // Then build
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Build failed for ${appName}:`, error.message);
    console.log(`🔄 Trying to fix dependencies for ${appName}...`);

    // Try to install the specific missing dependency
    try {
      execSync('npm install @rollup/rollup-win32-x64-msvc', { stdio: 'inherit' });
      execSync('npm run build', { stdio: 'inherit' });
    } catch (retryError) {
      console.error(`❌ Retry failed for ${appName}:`, retryError.message);
      throw retryError;
    }
  }

  process.chdir('../..');
}

// Build landing page (root)
safeBuild('Landing Page', 'apps/landing');

// Copy landing page to root of dist
cpSync('dist/landing', 'dist', { recursive: true });
rmSync('dist/landing', { recursive: true, force: true });

// Build JobNest
safeBuild('JobNest', 'apps/jobnest');

// Build Resume Refiner
safeBuild('Resume Refiner', 'apps/resume-refiner');

console.log('✅ Build complete! All apps built to dist/ directory');
console.log('📁 Structure:');
console.log('  dist/');
console.log('  ├── index.html (landing page)');
console.log('  ├── jobnest/');
console.log('  └── resume-refiner/');
