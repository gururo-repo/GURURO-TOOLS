import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import api from '../lib/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Sending forgot password request for email:', email);

      // Validate email format on frontend
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      // We'll attempt the API call
      const response = await api.post('/auth/forgot-password', { email });

      console.log('✅ Forgot password request successful:', response.data);

      // Even if there's an error (user doesn't exist), we show success for security
      setSuccess(true);
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Check for rate limit error (429)
      if (error.response?.status === 429) {
        setError('Too many password reset attempts. Please try again later.');
      }
      // Check for server errors
      else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      }
      // For email validation errors, show the specific message
      else if (error.response?.status === 400 && error.response?.data?.errors) {
        setError(error.response.data.errors[0]?.msg || 'Invalid email format.');
      }
      // For network errors
      else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Network error. Please check your connection and try again.');
      }
      // For any other error, still show success message for security
      else {
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 my-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-cyan-100">
            Reset Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-emerald-900/50 border-emerald-800 text-emerald-200 mb-4">
              <AlertDescription>
                If the email exists in our system, a password reset link has been sent.
                Please check your inbox and follow the instructions.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-cyan-100">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-zinc-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                    required
                  />
                </div>
              </div>

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
                {loading ? 'Processing...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-sm text-zinc-400">
            <Link to="/auth" className="text-cyan-400 hover:underline">
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;