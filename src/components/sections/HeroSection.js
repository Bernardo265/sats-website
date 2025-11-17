import React from 'react';
import { Link } from 'react-router-dom';
import BitcoinPriceWidget from '../common/BitcoinPriceWidget';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import useAnimatedCounter from '../../hooks/useAnimatedCounter';

function HeroSection() {
  // Intersection observer for stats animation
  const [statsRef, isStatsVisible] = useIntersectionObserver();

  // Animated counters for statistics
  const usersCount = useAnimatedCounter(50, 2000, isStatsVisible, 'K+');
  const volumeCount = useAnimatedCounter(100, 2500, isStatsVisible, 'M+');
  const uptimeCount = useAnimatedCounter(99.9, 2000, isStatsVisible, '%');

  return (
    <section className="relative px-6 py-12 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 overflow-hidden">
      {/* Enhanced ambient background glow with dynamic movement */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl ambient-move"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl ambient-move" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-safesats-orange/2 rounded-full blur-3xl ambient-move" style={{animationDelay: '6s'}}></div>

      {/* Gradient overlay for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-800/50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Hero Content */}
        <div className="space-y-8 hero-content">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              The SafeSats Way to<br />
              <span className="text-white">Buy Bitcoin</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Safesats provides a secure, fast and user friendly platform
              for buying Bitcoin with local payment methods.
            </p>
          </div>

          {/* Bitcoin Price Widget */}
          <div className="max-w-sm">
            <BitcoinPriceWidget size="default" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex ">
              <Link
                to="/buy"
                className="bg-green-400 text-black px-8 py-4 rounded-lg font-semibold btn-enhanced-hover glow-green text-center overflow-hidden group"
                onClick={(e) => e.preventDefault()}
              >
                <span className="relative z-10">Buy Bitcoin Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              <span className="absolute block -top-2.5 -right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full transform rotate-6 shadow-md">
                Coming Soon
              </span>
            </div>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold btn-enhanced-hover hover:bg-white hover:text-black text-center relative overflow-hidden group"
            >
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Stats with animated counters */}
          <div ref={statsRef} className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">MK100M+</div>
              <div className="text-gray-400 text-sm">Volume Traded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="pt-8">
            <p className="text-white/60 text-sm mb-4">Accepted payment methods:</p>
            <div className="flex items-center space-x-4">
              {/* Payment method logos */}
              <div className="w-20 h-20 flex items-center justify-center p-1 relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/airtel-money.png"
                  alt="Airtel Money"
                  className="w-full h-full object-contain"
                />
                {/* Active indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-400 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Available Now!
                </div>
              </div>
              <div className="w-20 h-20 flex items-center justify-center p-1 relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/mpamba.png" 
                  alt="Mpamba" 
                  className="w-full h-full object-contain"
                />
                {/* Active indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-400 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Available Now!
                </div>
              </div>
              <div className="w-20 h-20 flex items-center justify-center p-1 relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/matser-card.png"
                  alt="Master Card"
                  className="w-full h-full object-contain"
                />
                {/* Active indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-400 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Available Now!
                </div>
              </div>
              <div className="w-20 h-20 flex items-center justify-center p-1 relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/VISA-logo.png"
                  alt="Master Card"
                  className="w-full h-full object-contain"
                />
                {/* Active indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-400 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Available Now!
                </div>
              </div>              
            </div>
          </div>
        </div>

        {/* Right Side - Mobile App Mockup - Hidden on mobile/tablet */}
        <div className="hidden xl:flex justify-center lg:justify-end phone-mockup-container">
          <div className="relative">
            {/* Phone Frame with tilt animation */}
            <div className="w-80 h-[650px] bg-gradient-to-b from-gray-800 to-black rounded-[3.5rem] p-3 phone-shadow phone-tilt">
              {/* Phone Screen */}
              <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-8 flex flex-col items-center justify-between relative overflow-hidden">
                {/* Background gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/20 via-gray-900/30 to-black/90 rounded-[3rem]"></div>

                {/* Content with relative positioning */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">

                  {/* Top Section - Logo and SafeSats text */}
                  <div className="flex flex-col items-center space-y-6 pt-12">
                    {/* SafeSats Logo in Phone */}
                    <div className="w-24 h-24 bg- rounded-full flex items-center justify-center shadow-xl border border-gray-300">
                      <img
                        src="/images/logo.png"
                        alt="SafeSats Logo"
                        className="w-16 h-16 object-contain"
                      />
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
                      Buy Sats
                    </button>
                    <button className="border-2 border-white w-full text-white/90 py-4 rounded-2xl font-medium text-lg  bg-transparent hover:text-white transition-all duration-300">
                      Sell Sats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/60 text-sm">Scroll to explore</span>
          <svg className="w-6 h-6 text-safesats-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
