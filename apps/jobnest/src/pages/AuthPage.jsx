import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api, { authRequest } from '../lib/axios';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Check for Google OAuth redirect with code parameter
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code) {
      // We have a code from Google redirect, process it
      setLoading(true);

      // Set login/register state based on what was passed to Google
      if (state === 'register') {
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }

      // Get the stored code verifier
      const storedCodeVerifier = localStorage.getItem('codeVerifier');

      if (storedCodeVerifier) {
        // Exchange the code for tokens
        api.post('/auth/google-token', {
          code: code,
          code_verifier: storedCodeVerifier,
          redirect_uri: window.location.origin + '/jobnest/auth'
        })
        .then(response => {
          // Handle successful authentication
          handleAuthSuccess(response.data);
          // Clean up
          localStorage.removeItem('codeVerifier');
        })
        .catch(error => {
          console.error('Google redirect auth error:', error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Google authentication failed. Please try again.';
          setError(errorMessage);
        })
        .finally(() => {
          setLoading(false);
          // Clean up URL to remove the code
          window.history.replaceState({}, document.title, '/auth');
        });
      } else {
        setError('Authentication failed: Missing verification code. Please try again.');
        setLoading(false);
        window.history.replaceState({}, document.title, '/auth');
      }
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleManualAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      console.log(`Sending ${isLogin ? 'login' : 'register'} request to ${endpoint}`);

      // Try the special auth request first to bypass potential CSRF issues
      let response;
      try {
        response = await authRequest('POST', endpoint, payload);
      } catch (authError) {
        console.warn('Auth request failed, trying regular API:', authError);
        // Fallback to regular API request
        response = await api.post(endpoint, payload);
      }
      const { data } = response;

      // Handle successful authentication
      handleAuthSuccess(data);
    } catch (error) {
      console.error('Auth error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      // Get more specific error message if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to authenticate. Please try again.';

      // Show more detailed error for debugging
      const detailedError = error.response?.status
        ? `${errorMessage} (Status: ${error.response.status})`
        : errorMessage;

      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };


  // Common function to handle successful authentication
  const handleAuthSuccess = (data) => {
    // Save token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));

    // Check if this is a returning user with a completed profile
    if (data.user.isProfileComplete) {
      // For returning users: Skip onboarding and show industry insights
      navigate('/industry-insights');
    } else {
      // For new users: Show the onboarding page
      navigate('/onboarding');
    }

    // Store current user data for future reference
    localStorage.setItem('previousUserData', JSON.stringify({
      email: data.user.email,
      lastLogin: new Date().toISOString()
    }));
  };





  // Handle Google OAuth success
  const handleGoogleOAuthSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Google OAuth success:', tokenResponse);

      // Send the access token to backend for verification
      const response = await api.post('/auth/google', {
        access_token: tokenResponse.access_token,
        isLogin: isLogin
      });

      console.log('Backend Google auth response:', response.data);
      handleAuthSuccess(response.data);
    } catch (error) {
      console.error('Google authentication error:', error);

      // Handle specific error cases
      if (error.response?.status === 404) {
        setError('Google authentication is not yet configured on the server. Please use email/password login for now.');
      } else {
        setError(error.response?.data?.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Simplified Google OAuth configuration using popup flow
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleOAuthSuccess(tokenResponse);
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setError('Google login failed. Please try another method.');
      setLoading(false);
    },
    scope: 'email profile'
  });



  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 my-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-cyan-100">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Google Sign-In Button at the top for better visibility */}
          <Button
            variant="outline"
            className="w-full border-zinc-700 hover:bg-zinc-800 mb-6"
            onClick={() => {
              googleLogin();
            }}
            disabled={loading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleManualAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-cyan-100">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-zinc-500" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-cyan-100">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-zinc-500" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-cyan-100">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-zinc-500" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-cyan-100">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-zinc-500" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-sm text-zinc-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-cyan-400 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;