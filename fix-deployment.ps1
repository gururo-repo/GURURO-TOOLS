# PowerShell script to fix Vercel deployment issues
# Run this script in the root directory of your project

Write-Host "🔧 Fixing Vercel Deployment Issues..." -ForegroundColor Green

# Step 1: Remove Git submodules
Write-Host "📦 Step 1: Removing Git submodules..." -ForegroundColor Yellow

try {
    # Remove submodules from Git cache
    git rm --cached apps/landing
    Write-Host "✅ Removed apps/landing from Git cache" -ForegroundColor Green
} catch {
    Write-Host "⚠️ apps/landing may not be a submodule or already removed" -ForegroundColor Yellow
}

try {
    git rm --cached node_modules/gururo-tools-landing-page
    Write-Host "✅ Removed node_modules/gururo-tools-landing-page from Git cache" -ForegroundColor Green
} catch {
    Write-Host "⚠️ node_modules/gururo-tools-landing-page may not be a submodule or already removed" -ForegroundColor Yellow
}

# Remove .gitmodules file if it exists
if (Test-Path .gitmodules) {
    Remove-Item .gitmodules
    Write-Host "✅ Removed .gitmodules file" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No .gitmodules file found" -ForegroundColor Blue
}

# Step 2: Add directories as regular files
Write-Host "📁 Step 2: Adding directories as regular files..." -ForegroundColor Yellow

git add apps/
git add node_modules/gururo-tools-landing-page/
Write-Host "✅ Added apps/ and node_modules/gururo-tools-landing-page/ as regular directories" -ForegroundColor Green

# Step 3: Verify package.json files exist
Write-Host "📄 Step 3: Verifying package.json files..." -ForegroundColor Yellow

$packageFiles = @(
    "apps/landing/package.json",
    "apps/jobnest/package.json", 
    "apps/resume-refiner/package.json"
)

foreach ($file in $packageFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file is missing!" -ForegroundColor Red
        exit 1
    }
}

# Step 4: Test build locally
Write-Host "🔨 Step 4: Testing build locally..." -ForegroundColor Yellow

try {
    npm run build
    Write-Host "✅ Local build successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Local build failed. Check the output above for errors." -ForegroundColor Red
    exit 1
}

# Step 5: Commit and push changes
Write-Host "📤 Step 5: Committing and pushing changes..." -ForegroundColor Yellow

git commit -m "Fix: Convert submodules to regular directories for Vercel deployment"
git push origin main

Write-Host "🎉 Deployment fix complete!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Blue
Write-Host "1. Check Vercel deployment logs" -ForegroundColor White
Write-Host "2. Test the deployed application" -ForegroundColor White
Write-Host "3. Verify API endpoints work" -ForegroundColor White

# Step 6: Display current git status
Write-Host "📊 Current Git Status:" -ForegroundColor Blue
git status --short
