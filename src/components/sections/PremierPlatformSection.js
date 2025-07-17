import React from 'react';

function PremierPlatformSection() {
  return (
    <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
      {/* Top gradient overlay for smooth transition from purchase section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-700/30 to-transparent pointer-events-none"></div>

      {/* Bottom gradient overlay for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-900/50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
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
  );
}

export default PremierPlatformSection;
