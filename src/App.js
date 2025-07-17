import './App.css';
import { useState } from 'react';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Bitcoin symbols - Updated to white */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl text-white transform rotate-12 float-animation">₿</div>
        <div className="absolute top-40 right-20 text-4xl text-white transform -rotate-12 float-animation" style={{animationDelay: '1s'}}>₿</div>
        <div className="absolute bottom-40 left-20 text-5xl text-white transform rotate-45 float-animation" style={{animationDelay: '2s'}}>₿</div>
        <div className="absolute bottom-20 right-40 text-3xl text-white transform -rotate-45 float-animation" style={{animationDelay: '0.5s'}}>₿</div>
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-1">
            <img
              src="/images/logo.png"
              alt="SafeSats Logo"
              className="h-10 w-auto"
            />
            <span className="text-white font-semibold text-sm">SafeSats</span>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <div className="relative group">
              <a href="/resources" className="text-gray-300 hover:text-white transition-colors flex items-center">
                Resources
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
            <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Get Started Button - Updated to black and white */}
          <button className="hidden md:block bg-white text-black px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 hover:bg-gray-200">
            Get Started
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 px-6 py-4">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/resources" className="text-gray-300 hover:text-white transition-colors">Resources</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <button className="bg-white text-black px-6 py-2 rounded-lg transition-all duration-300 w-full hover:bg-gray-200">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
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

            {/* Download Buttons - Updated to black and white */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 hover:bg-gray-200">
                Download iOS App
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 border border-white">
                Download Android App
              </button>
            </div>

            {/* Payment Methods */}
            <div className="pt-8">
              <p className="text-gray-400 text-sm mb-4">Accepted payment methods:</p>
              <div className="flex items-center space-x-4">
                {/* Payment method logos - updated to black and white */}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">M</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">S</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">B</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">V</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">MC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Mobile App Mockup - Hidden on mobile/tablet */}
          <div className="hidden xl:flex justify-center lg:justify-end phone-mockup-container">
            <div className="relative">
              {/* Phone Frame - Updated to black and white */}
              <div className="w-80 h-[650px] bg-gradient-to-b from-gray-800 to-black rounded-[3.5rem] p-3 phone-shadow">
                {/* Phone Screen - Black and white theme */}
                <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-8 flex flex-col items-center justify-between relative overflow-hidden">
                  {/* Background gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800/20 via-gray-900/30 to-black/90 rounded-[3rem]"></div>

                  {/* Content with relative positioning */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">

                    {/* Top Section - Logo and SafeSats text - Updated to black and white */}
                    <div className="flex flex-col items-center space-y-6 pt-12">
                      {/* SafeSats Logo in Phone - Black and white theme */}
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-300">
                        <span className="text-black font-bold text-3xl">$</span>
                      </div>

                      {/* SafeSats Text - More subtle/translucent */}
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
      </main>

      {/* Premier Platform Section */}
      <section className="relative z-10 px-6 py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              The Premier Platform for<br />
              <span className="text-white">Bitcoin buying & selling</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Safesats the premier platform, ensures security & convenient bitcoin
              buying & selling with a diverse range of cryptocurrencies.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Trustworthy & Security Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-400/30 transition-all duration-300 group">
              <div className="space-y-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-green-400/10 rounded-xl flex items-center justify-center group-hover:bg-green-400/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Trustworthy & Security</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Place your trust in Safesats for your cryptocurrency holdings. We're a reliable trading
                    platform that regularly validates the safety of your funds through.
                  </p>
                </div>
              </div>
            </div>

            {/* Swift Transactions Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-400/30 transition-all duration-300 group">
              <div className="space-y-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-green-400/10 rounded-xl flex items-center justify-center group-hover:bg-green-400/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Swift Transactions</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Place your trust in Safesats for your cryptocurrency holdings. We're a reliable trading
                    platform that regularly validates the safety of your funds through.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Bitcoin Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Side - 3D Phone Illustration */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-400 rounded-lg transform rotate-12 opacity-80 animate-pulse"></div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-300 rounded-full opacity-60 animate-bounce"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-green-500 rounded-lg transform -rotate-12 opacity-70"></div>

                {/* Bitcoin Symbol */}
                <div className="absolute top-12 left-12 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">₿</span>
                </div>

                {/* Main Phone */}
                <div className="w-80 h-[500px] bg-gradient-to-b from-gray-700 to-gray-900 rounded-[3rem] p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-600 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
                    {/* Screen Content */}
                    <div className="text-center text-white">
                      <div className="text-6xl font-bold mb-4">BUY</div>
                      <div className="w-16 h-1 bg-white mx-auto rounded-full"></div>
                    </div>

                    {/* Floating Bitcoin Icons */}
                    <div className="absolute top-8 right-8 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-sm">₿</span>
                    </div>
                    <div className="absolute bottom-12 left-8 w-6 h-6 bg-orange-300 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">₿</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 -right-12 w-20 h-20 border-4 border-green-400 rounded-full opacity-30"></div>
                <div className="absolute bottom-16 -right-8 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Purchase Bitcoin in<br />
                  <span className="text-green-400">Easy Steps</span>
                </h2>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Create a Safesats Account</h3>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Verify Your Account</h3>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Add a Payment Method</h3>
                    <p className="text-gray-300 text-sm">Add your credit card or other payment methods to buy Bitcoin. Safesats supports over 7 payment methods.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Buy Bitcoin</h3>
                    <p className="text-gray-300 text-sm">Easy purchase Bitcoin on Safesats with straightforward guide for hassle-free transactions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
