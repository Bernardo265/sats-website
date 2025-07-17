import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="relative z-10 bg-black text-white">
      {/* Sponsors Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-8">
            <h3 className="text-2xl font-bold text-white">
              Trusted by Leading <span className="text-green-400">Partners</span>
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {/* Partner/Sponsor Logos */}
              <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center p-2">
                <img 
                  src="/images/mukuru.png" 
                  alt="Mukuru Partner" 
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center p-2">
                <img 
                  src="/images/airtel-money.png" 
                  alt="Airtel Money Partner" 
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center p-2">
                <img 
                  src="/images/matser-card.png" 
                  alt="Master Card Partner" 
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center p-2">
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
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/safesats" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/safesats" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-green-400 transition-colors">Blog</Link></li>
              <li><Link to="/help" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-green-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-green-400 transition-colors">Contact Us</Link></li>
              <li><a href="mailto:support@safesats.com" className="text-gray-400 hover:text-green-400 transition-colors">Email Support</a></li>
              <li><a href="tel:+1234567890" className="text-gray-400 hover:text-green-400 transition-colors">Phone Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</Link></li>
              <li><a href="/cookie-policy" className="text-gray-400 hover:text-green-400 transition-colors">Cookie Policy</a></li>
              <li><a href="/compliance" className="text-gray-400 hover:text-green-400 transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 SafeSats. All rights reserved. | Empowering secure Bitcoin transactions worldwide.
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
