# PowerShell script to recreate package.json files if they're missing
# This is a backup solution if the submodule fix doesn't work

Write-Host "🔧 Recreating package.json files..." -ForegroundColor Green

# Landing page package.json
$landingPackageJson = @'
{
  "name": "gururo-tools-landing-page",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:app": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.8",
    "lucide-react": "^0.513.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.19.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.19.0",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "globals": "^15.14.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^6.1.0"
  }
}
'@

# JobNest package.json
$jobnestPackageJson = @'
{
  "name": "sgp1",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build --outDir ../../dist/jobnest",
    "build:app": "vite build --outDir ../../dist/jobnest",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@headlessui/react": "^2.2.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.3",
    "@react-oauth/google": "^0.12.1",
    "@uiw/react-md-editor": "^4.0.5",
    "axios": "^1.8.2",
    "chart.js": "^4.4.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^11.6.1",
    "framer-motion": "^12.4.7",
    "html2pdf.js": "^0.10.3",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^0.475.0",
    "react": "^19.0.0",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "react-hot-toast": "^2.5.2",
    "react-icons": "^5.5.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.2.0",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.2",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.19.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.19.0",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "globals": "^15.14.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^6.3.5"
  }
}
'@

# Resume Refiner package.json
$resumeRefinerPackageJson = @'
{
  "name": "resume-refiner-ai",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build --outDir ../../dist/resume-refiner",
    "build:app": "vite build --outDir ../../dist/resume-refiner",
    "preview": "vite preview"
  },
  "dependencies": {
    "@headlessui/react": "^2.2.4",
    "@heroicons/react": "^2.2.0",
    "axios": "^1.9.0",
    "lucide-react": "^0.513.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.3.8",
    "react-icons": "^4.12.0",
    "react-router-dom": "^7.6.2",
    "tailwind-merge": "^3.3.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.4",
    "tailwindcss": "^3.4.17",
    "vite": "^6.3.5"
  }
}
'@

# Create directories if they don't exist
if (!(Test-Path "apps/landing")) { New-Item -ItemType Directory -Path "apps/landing" -Force }
if (!(Test-Path "apps/jobnest")) { New-Item -ItemType Directory -Path "apps/jobnest" -Force }
if (!(Test-Path "apps/resume-refiner")) { New-Item -ItemType Directory -Path "apps/resume-refiner" -Force }

# Write package.json files
$landingPackageJson | Out-File -FilePath "apps/landing/package.json" -Encoding UTF8
$jobnestPackageJson | Out-File -FilePath "apps/jobnest/package.json" -Encoding UTF8
$resumeRefinerPackageJson | Out-File -FilePath "apps/resume-refiner/package.json" -Encoding UTF8

Write-Host "✅ Created apps/landing/package.json" -ForegroundColor Green
Write-Host "✅ Created apps/jobnest/package.json" -ForegroundColor Green
Write-Host "✅ Created apps/resume-refiner/package.json" -ForegroundColor Green

# Add and commit the files
git add apps/*/package.json
git commit -m "Recreate package.json files for Vercel deployment"
git push origin main

Write-Host "🎉 Package.json files recreated and committed!" -ForegroundColor Green
