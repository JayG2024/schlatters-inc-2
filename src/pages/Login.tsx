import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../lib/utils';
import { LogIn, AlertCircle, Sun, Moon, UserPlus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message || 'Failed to create account');
          showToast({
            type: 'error',
            title: 'Sign Up Failed',
            message: error.message || 'Failed to create account'
          });
        } else {
          showToast({
            type: 'success',
            title: 'Account Created!',
            message: 'Please check your email to verify your account.'
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || 'Invalid email or password');
          showToast({
            type: 'error',
            title: 'Login Failed',
            message: error.message || 'Invalid email or password'
          });
        } else {
          showToast({
            type: 'success',
            title: 'Login Successful',
            message: 'Welcome back!'
          });
        }
      }
      // Navigation is handled by SupabaseAuthProvider
    } catch (err) {
      const errorMessage = isSignUp ? 'Failed to create account' : 'Invalid email or password';
      setError(errorMessage);
      showToast({
        type: 'error',
        title: isSignUp ? 'Sign Up Failed' : 'Login Failed',
        message: errorMessage
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-navy p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-brand-gold text-brand-navy rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold">S</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to Schlatter's Inc.
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isSignUp ? 'Create an account to get started' : 'Sign in to access your dashboard'}
              </p>
            </div>

            {error && (
              <div className={cn(
                "flex items-center gap-2 p-3 mb-4 text-sm rounded-lg",
                "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
              )}>
                <AlertCircle size={16} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600",
                    "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none",
                    "transition-all duration-200"
                  )}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600",
                    "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none",
                    "transition-all duration-200"
                  )}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-2.5 px-4 rounded-lg",
                  "bg-brand-gold hover:bg-brand-gold-dark text-brand-navy font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 dark:focus:ring-offset-gray-800",
                  "transition-all duration-200 transform hover:translate-y-[-1px]",
                  "flex items-center justify-center gap-2",
                  "shadow-lg hover:shadow-xl",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <span className="animate-pulse">{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                ) : (
                  <>
                    {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
                    <span>{isSignUp ? 'Create Account' : 'Sign in'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-sm text-brand-gold hover:text-brand-gold-dark font-medium transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;