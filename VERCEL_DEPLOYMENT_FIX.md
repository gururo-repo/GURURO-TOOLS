# 🔧 Vercel Deployment Fix

## ✅ **Issues Fixed**

1. **Rollup Dependency Issue**: Added platform-specific Rollup dependencies for Linux (Vercel's environment)
2. **Build Process**: Created a simpler, more reliable build command for Vercel
3. **Install Command**: Added `--legacy-peer-deps` flag to handle dependency conflicts

## 🚀 **Deploy Steps**

### **1. Commit the Fixes**
```bash
git add .
git commit -m "Fix Vercel deployment issues - add platform-specific dependencies"
git push origin main
```

### **2. Redeploy on Vercel**
- Go to your Vercel dashboard
- Click "Redeploy" on your project
- Or push the changes and it will auto-deploy

### **3. Alternative: Manual Vercel Configuration**
If the automatic deployment still fails, manually set these in Vercel dashboard:

**Build Settings:**
```
Build Command: npm run build:simple
Output Directory: dist
Install Command: npm install --legacy-peer-deps
```

**Environment Variables:**
```
VITE_JOBNEST_API_URL=https://gururo-ai-powered-career-guidance.onrender.com
VITE_RESUME_API_URL=https://resume-refiner-ai-backend.onrender.com/api
```

## 🔍 **What Changed**

### **1. Package.json Updates**
Added platform-specific Rollup dependencies:
- `@rollup/rollup-linux-x64-gnu` (for Vercel's Linux environment)
- `@rollup/rollup-darwin-x64` (for macOS)
- `@rollup/rollup-darwin-arm64` (for Apple Silicon)
- `@rollup/rollup-win32-x64-msvc` (for Windows)

### **2. Build Script Improvements**
- Created `build:simple` command that's more reliable for CI/CD
- Added platform detection for automatic dependency installation
- Improved error handling

### **3. Vercel Configuration**
- Updated `vercel.json` to use the simpler build command
- Added `--legacy-peer-deps` to handle dependency conflicts

## 🎯 **Expected Result**

After successful deployment:
- ✅ `https://your-project.vercel.app/` → Landing page
- ✅ `https://your-project.vercel.app/jobnest` → JobNest app
- ✅ `https://your-project.vercel.app/resume-refiner` → Resume Refiner app

## 🆘 **If Still Failing**

### **Option 1: Use Different Build Command**
In Vercel dashboard, try:
```
Build Command: npm run build:advanced
```

### **Option 2: Manual Build Steps**
Set build command to:
```
npm install --workspace=landing && npm install --workspace=jobnest && npm install --workspace=resume-refiner && npm run build:landing && npm run build:jobnest && npm run build:resume-refiner
```

### **Option 3: Separate App Deployments**
If monorepo continues to have issues, deploy each app separately:
1. Deploy `apps/landing` to `tools.gururo.com`
2. Deploy `apps/jobnest` to `jobnest.tools.gururo.com`
3. Deploy `apps/resume-refiner` to `resume-refiner.tools.gururo.com`

## 📞 **Support**

If deployment still fails:
1. Check Vercel build logs for specific errors
2. Try building locally with `npm run build:simple`
3. Ensure all dependencies are properly installed

---

**🎉 The fixes should resolve the Rollup dependency issue on Vercel!**
