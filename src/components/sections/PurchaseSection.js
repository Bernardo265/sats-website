import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

function PurchaseSection() {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();
  return (
    <section
      ref={ref}
      className={`relative z-10 px-6 py-20 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-700 transition-all duration-1000 ${
        hasIntersected ? 'section-visible' : 'section-hidden'
      }`}
    >
      {/* Top gradient overlay for smooth transition from hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-800/30 to-transparent pointer-events-none"></div>

      {/* Bottom gradient overlay for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-700/50 pointer-events-none"></div>

      {/* Section divider at bottom */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <div className="section-divider"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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
  );
}

export default PurchaseSection;
