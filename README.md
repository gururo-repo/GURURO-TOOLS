# Tools Gururo - Unified Platform

A unified platform hosting multiple professional tools under one domain (tools.gururo.com).

## 🏗️ Architecture

This is a monorepo containing:
- **Landing Page** (`/`) - Main tools directory
- **JobNest** (`/jobnest`) - AI-powered career guidance platform
- **Resume Refiner** (`/resume-refiner`) - AI-powered resume optimization

## 📁 Project Structure

```
tools-gururo/
├── apps/
│   ├── landing/          # Landing page (React + Vite)
│   ├── jobnest/          # JobNest frontend (React + Vite)
│   └── resume-refiner/   # Resume Refiner frontend (React + Vite)
├── dist/                 # Built files for deployment
├── build.js              # Build script for all apps
├── package.json          # Root package.json with workspaces
└── vercel.json           # Vercel deployment configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd tools-gururo
npm run install:all
```

2. **Development:**
```bash
# Start landing page (default)
npm run dev

# Or start individual apps
npm run dev --workspace=jobnest
npm run dev --workspace=resume-refiner
```

3. **Build for production:**
```bash
npm run build
```

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel:**
   - Import project to Vercel
   - Set build command: `npm run build`
   - Set output directory: `dist`

2. **Environment Variables:**
   Set in Vercel dashboard:
   ```
   VITE_JOBNEST_API_URL=https://gururo-ai-powered-career-guidance.onrender.com
   VITE_RESUME_API_URL=https://resume-refiner-ai-backend.onrender.com/api
   ```

3. **Domain Configuration:**
   - Set custom domain: `tools.gururo.com`
   - Vercel will handle SSL automatically

### Backend CORS Configuration

Update your Render backend services to allow:
```
Access-Control-Allow-Origin: https://tools.gururo.com
```

## 🔧 Configuration

### Routing
- `/` → Landing page
- `/jobnest` → JobNest app
- `/jobnest/api/*` → Proxied to JobNest backend on Render
- `/resume-refiner` → Resume Refiner app  
- `/resume-refiner/api/*` → Proxied to Resume Refiner backend on Render

### API Endpoints
- **JobNest Backend:** `https://gururo-ai-powered-career-guidance.onrender.com`
- **Resume Refiner Backend:** `https://resume-refiner-ai-backend.onrender.com`

## 🛠️ Development

### Adding a New App

1. Create new app in `apps/` directory
2. Add to workspaces in root `package.json`
3. Update `build.js` script
4. Add routing in `vercel.json`
5. Update landing page with new tool

### Local Development URLs
- Landing: `http://localhost:5173`
- JobNest: `http://localhost:5173/jobnest`
- Resume Refiner: `http://localhost:5173/resume-refiner`

## 📦 Build Process

The build process:
1. Builds landing page → `dist/`
2. Builds JobNest → `dist/jobnest/`
3. Builds Resume Refiner → `dist/resume-refiner/`
4. Vercel serves all from single domain

## 🔗 Links

- **Production:** https://tools.gururo.com
- **JobNest:** https://tools.gururo.com/jobnest
- **Resume Refiner:** https://tools.gururo.com/resume-refiner

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes in appropriate app directory
4. Test locally with `npm run build`
5. Submit pull request

## 📝 Notes

- Each app maintains its own dependencies
- Shared build process via root package.json
- Individual apps can be developed independently
- Production builds are optimized for Vercel deployment
