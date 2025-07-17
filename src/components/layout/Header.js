import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
          to="/contact" 
          className="hidden md:block bg-white text-black px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 hover:bg-gray-200"
        >
          Get Started
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
              to="/contact" 
              className="bg-white text-black px-6 py-2 rounded-lg transition-all duration-300 w-full hover:bg-gray-200 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
