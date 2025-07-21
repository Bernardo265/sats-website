import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import BitcoinPriceWidget from '../components/common/BitcoinPriceWidget';
import { useAuth } from '../contexts/AuthContext';
import { generateStructuredData } from '../utils/seo';

function Dashboard() {
  const { user, isAuthenticated, logout, resendVerificationEmail } = useAuth();
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/start-trading" replace />;
  }

  const dashboardPageData = {
    title: 'Dashboard | SafeSats Trading Platform',
    description: 'Access your SafeSats dashboard to view account status, Bitcoin prices, and prepare for trading.',
    keywords: 'safesats dashboard, bitcoin trading dashboard, account status, cryptocurrency platform',
    url: '/dashboard',
    type: 'website'
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    setResendMessage('');
    
    const result = await resendVerificationEmail();
    
    if (result.success) {
      setResendMessage('Verification email sent successfully! Please check your inbox.');
    } else {
      setResendMessage('Failed to send verification email. Please try again.');
    }
    
    setResendingEmail(false);
  };

  const getAccountStatusColor = () => {
    switch (user?.accountStatus) {
      case 'active': return 'text-green-400';
      case 'pending_verification': return 'text-yellow-400';
      case 'suspended': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAccountStatusText = () => {
    switch (user?.accountStatus) {
      case 'active': return 'Active';
      case 'pending_verification': return 'Pending Verification';
      case 'suspended': return 'Suspended';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <SEOHead
        pageData={dashboardPageData}
        structuredData={generateStructuredData('webpage', dashboardPageData)}
      />
      
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.fullName?.split(' ')[0]}!
              </h1>
              <p className="text-white/70">Manage your SafeSats account and prepare for trading</p>
            </div>
            <button
              onClick={logout}
              className="mt-4 md:mt-0 text-white/60 hover:text-white transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>

          {/* Email Verification Alert */}
          {!user?.emailVerified && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-yellow-400 font-semibold mb-2">Email Verification Required</h3>
                  <p className="text-white/80 mb-4">
                    Please verify your email address to activate your account and access all features.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleResendVerification}
                      disabled={resendingEmail}
                      className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                  </div>
                  {resendMessage && (
                    <p className={`mt-3 text-sm ${resendMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                      {resendMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Account Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Status */}
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Account Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Account Status</h3>
                    <p className={`font-semibold ${getAccountStatusColor()}`}>
                      {getAccountStatusText()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Email Status</h3>
                    <p className={`font-semibold ${user?.emailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {user?.emailVerified ? 'Verified' : 'Pending Verification'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Member Since</h3>
                    <p className="text-white font-semibold">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Trading Status</h3>
                    <p className="text-orange-400 font-semibold">Early Access</p>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <Link
                    to="/profile"
                    className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                  >
                    Edit Profile
                  </Link>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white/60 text-sm uppercase tracking-wide mb-1">Full Name</h3>
                    <p className="text-white">{user?.fullName || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-white/60 text-sm uppercase tracking-wide mb-1">Email Address</h3>
                    <p className="text-white">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-white/60 text-sm uppercase tracking-wide mb-1">Phone Number</h3>
                    <p className="text-white">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Trading Preparation */}
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Trading Preparation</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${user?.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-white">Email Verification</span>
                    </div>
                    <span className={`text-sm font-medium ${user?.emailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {user?.emailVerified ? 'Complete' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${user?.emailVerified ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <span className="text-white">Trading Simulator</span>
                    </div>
                    {user?.emailVerified ? (
                      <Link
                        to="/trading"
                        className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Start Trading
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm font-medium">Requires Email Verification</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-white">Identity Verification</span>
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Coming Soon</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-white">Payment Method Setup</span>
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Bitcoin Price & Updates */}
            <div className="space-y-8">
              {/* Live Bitcoin Price */}
              <BitcoinPriceWidget 
                showDetailed={true}
                refreshInterval={30000}
              />

              {/* Platform Updates */}
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Platform Updates</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="text-white font-semibold text-sm">Early Access Launch</h4>
                    <p className="text-white/70 text-xs">Registration is now open for early access members</p>
                    <span className="text-orange-500 text-xs">2 days ago</span>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="text-white font-semibold text-sm">Email Verification</h4>
                    <p className="text-white/70 text-xs">Email verification system is now active</p>
                    <span className="text-blue-500 text-xs">1 week ago</span>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-white font-semibold text-sm">Platform Development</h4>
                    <p className="text-white/70 text-xs">Core trading features are in development</p>
                    <span className="text-green-500 text-xs">2 weeks ago</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {user?.emailVerified && (
                    <>
                      <Link
                        to="/trading"
                        className="block w-full bg-orange-500 hover:bg-orange-600 text-black py-3 px-4 rounded-lg transition-colors text-center font-semibold"
                      >
                        Start Trading Simulator
                      </Link>

                      <Link
                        to="/portfolio"
                        className="block w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 py-3 px-4 rounded-lg transition-colors text-center"
                      >
                        View Portfolio
                      </Link>
                    </>
                  )}

                  <Link
                    to="/bitcoin-price"
                    className="block w-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-500 py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    View Bitcoin Prices
                  </Link>

                  <Link
                    to="/help"
                    className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    Help & Support
                  </Link>

                  <Link
                    to="/compliance"
                    className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    Legal Compliance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
