import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import RegistrationForm from '../components/auth/RegistrationForm';
import BitcoinPriceWidget from '../components/common/BitcoinPriceWidget';
import RegistrationDebug from '../components/debug/RegistrationDebug';
import { useAuth } from '../contexts/AuthContext';
import { generateStructuredData } from '../utils/seo';

function StartTrading() {
  const { isAuthenticated } = useAuth();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const startTradingPageData = {
    title: 'Start Trading Bitcoin | Early Access | SafeSats',
    description: 'Join SafeSats early access program and be among the first to trade Bitcoin in Malawi. Secure registration, email verification, and exclusive benefits.',
    keywords: 'start trading bitcoin, early access, bitcoin trading malawi, cryptocurrency registration, safesats signup',
    url: '/start-trading',
    type: 'website',
    image: '/images/start-trading-og.jpg'
  };

  const breadcrumbData = [
    { name: 'Home', url: '/' },
    { name: 'Start Trading', url: '/start-trading' }
  ];

  const handleRegistrationSuccess = (user) => {
    setRegistrationSuccess(true);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <SEOHead
          pageData={startTradingPageData}
          structuredData={generateStructuredData('webpage', startTradingPageData)}
        />
        
        <div className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Success Message */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to SafeSats!</h1>
              <p className="text-green-400 text-lg mb-6">
                Your account has been created successfully. Please check your email to verify your account.
              </p>
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3">Next Steps:</h3>
                <ol className="text-white/80 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">1.</span>
                    <span>Check your email inbox for a verification message</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">2.</span>
                    <span>Click the verification link to activate your account</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">3.</span>
                    <span>Access your dashboard to prepare for trading</span>
                  </li>
                </ol>
              </div>
              <div className="mt-6">
                <a 
                  href="/dashboard" 
                  className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <SEOHead
        pageData={startTradingPageData}
        structuredData={generateStructuredData('webpage', startTradingPageData)}
      />
      <SEOHead
        structuredData={generateStructuredData('breadcrumb', breadcrumbData)}
      />
      
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-3xl">₿</span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Start Trading Bitcoin<br />
              <span className="text-orange-500">Early Access</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-8">
              Be among the first to experience SafeSats - Malawi's premier Bitcoin trading platform. 
              Join our early access program and get exclusive benefits when we launch.
            </p>
            
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-500 font-medium">Early Access Available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Benefits and Information */}
            <div className="space-y-8">
              {/* Early Access Benefits */}
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Early Access Benefits</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Priority Access</h3>
                      <p className="text-white/70 text-sm">Be first in line when full trading launches</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Exclusive Updates</h3>
                      <p className="text-white/70 text-sm">Get insider updates on platform development</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Special Rates</h3>
                      <p className="text-white/70 text-sm">Enjoy preferential trading fees as an early member</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Beta Testing</h3>
                      <p className="text-white/70 text-sm">Help shape the platform with your feedback</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Bitcoin Price */}
              <BitcoinPriceWidget 
                showDetailed={true}
                className="lg:sticky lg:top-8"
              />

              {/* Launch Timeline */}
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Launch Timeline</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="text-white font-semibold">Phase 1: Early Access</h3>
                      <p className="text-white/70 text-sm">Account registration and email verification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <h3 className="text-white font-semibold">Phase 2: Beta Testing</h3>
                      <p className="text-white/70 text-sm">Limited trading features for early users</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div>
                      <h3 className="text-white/70 font-semibold">Phase 3: Full Launch</h3>
                      <p className="text-white/50 text-sm">Complete trading platform with all features</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="lg:sticky lg:top-8 space-y-6">
              <RegistrationForm onSuccess={handleRegistrationSuccess} />

              {/* Debug Component - Remove in production */}
              {process.env.REACT_APP_DEBUG_MODE === 'true' && (
                <RegistrationDebug />
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-16 bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Getting Started with Bitcoin Trading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Learn the Basics</h3>
                <p className="text-white/70 text-sm">Understand Bitcoin fundamentals and trading concepts</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Secure Setup</h3>
                <p className="text-white/70 text-sm">Set up your account with proper security measures</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Start Trading</h3>
                <p className="text-white/70 text-sm">Begin with small amounts and grow your confidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartTrading;
