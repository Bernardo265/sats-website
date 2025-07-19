import React from 'react';
import SEOHead from '../components/common/SEOHead';
import { generateStructuredData } from '../utils/seo';

function About() {
  const aboutPageData = {
    title: 'About SafeSats - Leading Bitcoin Platform | Our Mission & Vision',
    description: 'Learn about SafeSats mission to make Bitcoin accessible and secure for everyone. Discover our team, values, and commitment to revolutionizing cryptocurrency trading.',
    keywords: 'about safesats, bitcoin platform, cryptocurrency company, blockchain technology, bitcoin mission, crypto team, digital assets',
    url: '/about',
    type: 'website',
    image: '/images/safesats-about-og.jpg'
  };

  const breadcrumbData = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ];

  return (
    <div className="px-6 py-20">
      <SEOHead
        pageData={aboutPageData}
        structuredData={generateStructuredData('organization', aboutPageData)}
      />
      <SEOHead
        structuredData={generateStructuredData('breadcrumb', breadcrumbData)}
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            About <span className="text-green-400">SafeSats</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            We're on a mission to make Bitcoin simple, secure,and accessible for everyone. 
            Learn about our journey, values, and the team behind SafeSats.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Our <span className="text-green-400">Mission</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              At SafeSats, we believe that everyone should have access to the financial freedom that Bitcoin provides. 
              Our platform is designed to remove the barriers and complexities that often prevent people from entering 
              the cryptocurrency space.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We're committed to providing a secure, user-friendly, and transparent platform that empowers individuals 
              to take control of their financial future through Bitcoin.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-2xl p-8 border border-green-400/30">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-400 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Lightning Fast</h3>
              <p className="text-gray-300">
                Experience instant Bitcoin transactions with our optimized platform designed for speed and efficiency.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Our <span className="text-green-400">Values</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              These core principles guide everything we do at SafeSats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Security */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
              <div className="w-16 h-16 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Security First</h3>
              <p className="text-gray-300">
                Your funds and data are protected by industry-leading security measures and encryption protocols.
              </p>
            </div>

            {/* Transparency */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
              <div className="w-16 h-16 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Transparency</h3>
              <p className="text-gray-300">
                We believe in complete transparency with clear fees, open communication, and honest business practices.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
              <div className="w-16 h-16 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-gray-300">
                We continuously innovate to provide cutting-edge solutions that make Bitcoin trading easier and more accessible.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Meet Our <span className="text-green-400">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The passionate individuals working to revolutionize Bitcoin trading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
              <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-2xl">GG</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Grand Gombwa</h3>
              <p className="text-green-400 mb-4">CEO & Founder</p>
              <p className="text-gray-300 text-sm">
                10+ years in fintech and blockchain technology. Passionate about making cryptocurrency accessible to everyone.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
              <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-2xl">KP</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Kennedy Phiri</h3>
              <p className="text-green-400 mb-4">CTO</p>
              <p className="text-gray-300 text-sm">
                Expert in cybersecurity and blockchain development. Ensures SafeSats maintains the highest security standards.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
              <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-2xl">WP</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Wilfred Phiri</h3>
              <p className="text-green-400 mb-4">Head of Operations</p>
              <p className="text-gray-300 text-sm">
                Experienced operations leader focused on delivering exceptional customer experiences and platform reliability.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-green-400/10 to-green-600/10 rounded-2xl p-12 border border-green-400/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">MK100M+</div>
              <div className="text-gray-300">Volume Traded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
