import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `transition-colors ${
      isActive(path) 
        ? 'text-green-400' 
        : 'text-gray-300 hover:text-white'
    }`;
  };

  return (
    <header className="relative z-10 px-6 py-4">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center space-y-1">
          <img 
            src="/images/logo.png" 
            alt="SafeSats Logo" 
            className="h-10 w-auto"
          />
          <span className="text-white font-semibold text-sm">SafeSats</span>
        </Link>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={navLinkClass('/')}>Home</Link>
          <Link to="/about" className={navLinkClass('/about')}>About</Link>
          <Link to="/bitcoin-price" className={navLinkClass('/bitcoin-price')}>
            <span className="flex items-center space-x-1">
              <span>₿ Price</span>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            </span>
          </Link>
          {isAuthenticated && user?.emailVerified && (
            <Link to="/trading" className={navLinkClass('/trading')}>
              <span className="flex items-center space-x-1">
                <span>Trading</span>
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
              </span>
            </Link>
          )}
          <Link to="/blog" className={navLinkClass('/blog')}>Blog</Link>
          <Link to="/help" className={navLinkClass('/help')}>Help</Link>
          <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Get Started Button */}
        <Link
          to="/start-trading"
          className="hidden md:block bg-orange-500 hover:bg-orange-600 text-black px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 font-semibold"
        >
          Start Trading
        </Link>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 px-6 py-4" data-testid="mobile-menu">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={navLinkClass('/')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={navLinkClass('/about')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/bitcoin-price"
              className={navLinkClass('/bitcoin-price')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center space-x-2">
                <span>₿ Bitcoin Price</span>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              </span>
            </Link>
            {isAuthenticated && user?.emailVerified && (
              <Link
                to="/trading"
                className={navLinkClass('/trading')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-2">
                  <span>Trading Simulator</span>
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                </span>
              </Link>
            )}
            <Link
              to="/blog"
              className={navLinkClass('/blog')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/help" 
              className={navLinkClass('/help')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Help
            </Link>
            <Link 
              to="/contact" 
              className={navLinkClass('/contact')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/start-trading"
              className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-2 rounded-lg transition-all duration-300 w-full text-center font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Trading
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
