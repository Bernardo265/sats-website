// Loading Spinner Component for SafeSats
import React from 'react';
import { CurrencyCircleDollar } from 'phosphor-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  overlay = false,
  variant = 'default'
}) => {
  const getSizeClasses = () => {
    const sizes = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12',
      xlarge: 'w-16 h-16'
    };
    return sizes[size] || sizes.medium;
  };

  const getMessageSize = () => {
    const sizes = {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base',
      xlarge: 'text-lg'
    };
    return sizes[size] || sizes.medium;
  };

  const renderSpinner = () => {
    if (variant === 'bitcoin') {
      return (
        <div className="relative">
          <CurrencyCircleDollar 
            size={size === 'small' ? 16 : size === 'large' ? 48 : size === 'xlarge' ? 64 : 32} 
            className="text-green-400 animate-spin" 
          />
          <div className="absolute inset-0 animate-ping">
            <CurrencyCircleDollar 
              size={size === 'small' ? 16 : size === 'large' ? 48 : size === 'xlarge' ? 64 : 32} 
              className="text-green-400 opacity-30" 
            />
          </div>
        </div>
      );
    }

    if (variant === 'dots') {
      return (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      );
    }

    if (variant === 'pulse') {
      return (
        <div className={`${getSizeClasses()} bg-green-400 rounded-full animate-pulse`}></div>
      );
    }

    // Default spinner
    return (
      <div className={`${getSizeClasses()} border-2 border-gray-600 border-t-green-400 rounded-full animate-spin`}></div>
    );
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderSpinner()}
      {message && (
        <p className={`text-gray-300 ${getMessageSize()} text-center max-w-xs`}>
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-8">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Inline loading component for buttons
export const ButtonSpinner = ({ size = 16, className = '' }) => (
  <div 
    className={`border-2 border-gray-400 border-t-transparent rounded-full animate-spin ${className}`}
    style={{ width: size, height: size }}
  ></div>
);

// Page loading component
export const PageLoader = ({ message = 'Loading SafeSats...' }) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="text-center space-y-8">
      {/* Logo */}
      <div className="flex justify-center">
        <img 
          src="/images/logo.png" 
          alt="SafeSats" 
          className="h-16 w-auto opacity-80"
        />
      </div>
      
      {/* Loading animation */}
      <LoadingSpinner 
        size="large" 
        variant="bitcoin" 
        message={message}
      />
      
      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index}
        className="h-4 bg-gray-700 rounded animate-pulse"
        style={{ width: `${Math.random() * 40 + 60}%` }}
      ></div>
    ))}
  </div>
);

// Card skeleton loader
export const CardSkeleton = ({ className = '' }) => (
  <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 ${className}`}>
    <div className="space-y-4">
      <div className="h-6 bg-gray-700 rounded animate-pulse w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
      </div>
      <div className="flex space-x-3">
        <div className="h-10 bg-gray-700 rounded animate-pulse flex-1"></div>
        <div className="h-10 bg-gray-700 rounded animate-pulse w-24"></div>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
