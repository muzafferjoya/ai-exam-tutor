import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Card from '../components/Card';
import { auth } from '../services/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'password', 'otp'
  const [useOTP, setUseOTP] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    if (useOTP) {
      // Send OTP
      const { error } = await auth.signInWithOTP(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Check your email for the login link or OTP code');
        setStep('otp');
      }
    } else {
      // Move to password step
      setStep('password');
    }
    setLoading(false);
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await auth.signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    }
    setLoading(false);
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP code');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await auth.verifyOTP(email, otp);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep('email');
    setEmail('');
    setPassword('');
    setOtp('');
    setError('');
    setSuccess('');
    setUseOTP(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AI Exam Tutor</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        <Card className="p-8">
          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="use-otp"
                    name="use-otp"
                    type="checkbox"
                    checked={useOTP}
                    onChange={(e) => setUseOTP(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="use-otp" className="ml-2 text-sm">
                    Use email OTP instead
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : useOTP ? 'Send OTP' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Password Step */}
          {step === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <div>
                <Label htmlFor="email-display">Email</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                  {email}
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                >
                  ← Back
                </Button>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleOTPVerification} className="space-y-6">
              <div>
                <Label htmlFor="email-display">Email</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                  {email}
                </div>
              </div>

              <div>
                <Label htmlFor="otp">Enter OTP Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Check your email for the 6-digit verification code
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEmailSubmit({ preventDefault: () => {} })}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify & Sign in'}
              </Button>
            </form>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
        </Card>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

