import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramLogo, FacebookLogo, LinkedinLogo } from 'phosphor-react';

// Custom X (Twitter) Logo SVG Component
const XLogo = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

function Footer() {
  return (
    <footer className="relative z-10 bg-black text-white">
      {/* Sponsors Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-8">
            <h3 className="text-2xl font-bold text-white">
              Trusted by Leading <span className="text-green-500">Partners</span>
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {/* Partner/Sponsor Logos */}
              <div className="w-20 h-20  flex items-center justify-center p-2">
                <img 
                  src="/images/mukuru.png" 
                  alt="Mukuru Partner" 
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="w-20 h-20 flex items-center justify-center p-2">
                <img 
                  src="/images/airtel-money.png" 
                  alt="Airtel Money Partner" 
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="w-20 h-20  flex items-center justify-center p-2">
                <img 
                  src="/images/matser-card.png" 
                  alt="Master Card Partner" 
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="w-20 h-20  flex items-center justify-center p-2">
                <img 
                  src="/images/mpamba.png" 
                  alt="Mpamba Partner" 
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex flex-col items-start space-y-3">
              <img 
                src="/images/logo.png" 
                alt="SafeSats Logo" 
                className="h-12 w-auto"
              />
              <span className="text-white font-semibold text-lg">SafeSats</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              The premier platform for secure Bitcoin buying and selling. 
              Join thousands of satisfied customers worldwide.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a
                href="https://twitter.com/safesats"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors group"
              >
                <XLogo size={24} className="text-gray-400 group-hover:text-black" />
              </a>
              <a
                href="https://facebook.com/safesats"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors group"
              >
                <FacebookLogo size={24} className="text-gray-400 group-hover:text-black" />
              </a>
              <a
                href="https://instagram.com/safesats"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors group"
              >
                <InstagramLogo size={24} className="text-gray-400 group-hover:text-black" />
              </a>
              <a
                href="https://linkedin.com/company/safesats"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group"
              >
                <LinkedinLogo size={24} className="text-gray-400 group-hover:text-black" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-green-500 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-green-500 transition-colors">Blog</Link></li>
              <li><Link to="/help" className="text-gray-400 hover:text-green-500 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-green-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-400 hover:text-green-500 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-green-500 transition-colors">Contact Us</Link></li>
              <li><a href="mailto:support@safesats.com" className="text-gray-400 hover:text-green-500 transition-colors">Email Support</a></li>
              <li><a href="tel:+1234567890" className="text-gray-400 hover:text-green-500 transition-colors">Phone Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-400 hover:text-green-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-green-500 transition-colors">Terms of Service</Link></li>
              <li><a href="/cookie-policy" className="text-gray-400 hover:text-green-500 transition-colors">Cookie Policy</a></li>
              <li><Link to="/compliance" className="text-gray-400 hover:text-green-500 transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Compliance Disclaimer */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Legal Compliance & Regulatory Information
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-white mb-2">Legal Framework</h5>
                  <p className="text-gray-300 leading-relaxed">
                    The Reserve Bank of Malawi (2018) cautions against cryptocurrencies but does not ban them.
                    The Payment Systems Act (2016) does not cover Bitcoin. Anti-Money Laundering/Combating the
                    Financing of Terrorism (AML/CTF) regulations (2017) and the Taxation Act (2006) apply to
                    cryptocurrency transactions.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-white mb-2">Compliance Analysis</h5>
                  <p className="text-gray-300 leading-relaxed">
                    Bitcoin is not legal tender in Malawi but is legal for private use. SafeSats' activities
                    comply with applicable laws when Anti-Money Laundering/Combating the Financing of Terrorism
                    (AML/CTF) and tax obligations are met.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice.
                Users are responsible for ensuring compliance with applicable laws and regulations in their jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 SafeSats. All rights reserved. | Empowering secure Bitcoin transactions worldwide.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>🔒 SSL Secured</span>
              <span>✓ Verified Platform</span>
              <span>🛡️ Insured</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
