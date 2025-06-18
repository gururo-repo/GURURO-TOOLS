import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Debug environment variables
console.log('🔍 JobNest Environment Debug:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  hasClientId: !!import.meta.env.VITE_GOOGLE_CLIENT_ID
});

// Get Google Client ID with fallback
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '903842057627-bkrl6ud9f9ogcejgaaiuoa4rih2eoiba.apps.googleusercontent.com';

console.log('🚀 Using Google Client ID:', googleClientId);
console.log('🔧 Client ID source:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Environment Variable' : 'Fallback');

// Make it available globally for debugging
window.debugInfo = {
  googleClientId,
  envVars: import.meta.env,
  isProduction: import.meta.env.NODE_ENV === 'production'
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
