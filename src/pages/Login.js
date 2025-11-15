import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import { useAuth } from '../contexts/AuthContext';
import { validateLoginForm } from '../utils/validation';
import { generateStructuredData } from '../utils/seo';

function Login() {
  const { login, loading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const loginPageData = {
    title: 'Sign In | SafeSats Bitcoin Trading Platform',
    description: 'Sign in to your SafeSats account to access your dashboard and prepare for Bitcoin trading.',
    keywords: 'safesats login, sign in, bitcoin trading login, cryptocurrency platform login',
    url: '/login',
    type: 'website'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Attempt login
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setErrors({ submit: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <SEOHead
        pageData={loginPageData}
        structuredData={generateStructuredData('webpage', loginPageData)}
      />
      
      <div className="px-6 py-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-2xl">₿</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/70">Sign in to your SafeSats account</p>
          </div>

          {/* Login Form */}
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-400 text-sm">{errors.submit}</span>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-white/20 focus:ring-orange-500/50 focus:border-orange-500/50'
                  }`}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-white font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-white/20 focus:ring-orange-500/50 focus:border-orange-500/50'
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-black font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center mt-6 pt-6 border-t border-white/10">
              <p className="text-white/60">
                Don't have an account?{' '}
                <Link to="/start-trading" className="text-orange-500 hover:text-orange-400 font-medium">
                  Join Early Access
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Links */}
          <div className="text-center mt-8 space-y-2">
            <Link 
              to="/help" 
              className="block text-white/60 hover:text-white text-sm transition-colors"
            >
              Need help? Contact Support
            </Link>
            <Link 
              to="/" 
              className="block text-white/60 hover:text-white text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
