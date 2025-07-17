import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
        {/* Left Side - Hero Content */}
        <div className="space-y-8 hero-content">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              The SafeSats Way to<br />
              <span className="text-white">Buy & Sell Bitcoin</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Safesats provides a secure, fast and user friendly platform
              for buying and selling Bitcoin with local payments methods.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/contact"
              className="bg-white text-black px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 hover:bg-gray-200 text-center"
            >
              Get Started Today
            </Link>
            <Link 
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-white hover:text-black text-center"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">$100M+</div>
              <div className="text-gray-400 text-sm">Volume Traded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="pt-8">
            <p className="text-gray-400 text-sm mb-4">Accepted payment methods:</p>
            <div className="flex items-center space-x-4">
              {/* Payment method logos */}
              <div className="w-10 h-10 flex items-center justify-center p-1">
                <img 
                  src="/images/mukuru.png" 
                  alt="Mukuru" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-10 h-10 flex items-center justify-center p-1">
                <img 
                  src="/images/airtel-money.png" 
                  alt="Airtel Money" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-10 h-10 flex items-center justify-center p-1">
                <img 
                  src="/images/matser-card.png" 
                  alt="Master Card" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-10 h-10 flex items-center justify-center p-1">
                <img 
                  src="/images/mpamba.png" 
                  alt="Mpamba" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Mobile App Mockup - Hidden on mobile/tablet */}
        <div className="hidden xl:flex justify-center lg:justify-end phone-mockup-container">
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-80 h-[650px] bg-gradient-to-b from-gray-800 to-black rounded-[3.5rem] p-3 phone-shadow">
              {/* Phone Screen */}
              <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-8 flex flex-col items-center justify-between relative overflow-hidden">
                {/* Background gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/20 via-gray-900/30 to-black/90 rounded-[3rem]"></div>

                {/* Content with relative positioning */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">

                  {/* Top Section - Logo and SafeSats text */}
                  <div className="flex flex-col items-center space-y-6 pt-12">
                    {/* SafeSats Logo in Phone */}
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-300">
                      <span className="text-black font-bold text-3xl">$</span>
                    </div>

                    {/* SafeSats Text */}
                    <div className="text-center">
                      <h3 className="text-white/60 text-2xl font-light tracking-[0.3em] uppercase">SafeSats</h3>
                    </div>
                  </div>

                  {/* Middle Section - Let's Create */}
                  <div className="text-center space-y-3">
                    <h4 className="text-white text-2xl font-semibold">Let's Create</h4>
                    <p className="text-white/80 text-base font-light">Welcome to SafeSats</p>
                  </div>

                  {/* Bottom Section - Buttons */}
                  <div className="w-full space-y-4 pb-8">
                    <button className="w-full bg-white/95 text-gray-700 py-4 rounded-2xl font-medium text-lg shadow-lg hover:bg-white transition-all duration-300">
                      I'm new here
                    </button>
                    <button className="w-full text-white/90 py-4 rounded-2xl font-medium text-lg border-0 bg-transparent hover:text-white transition-all duration-300">
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
