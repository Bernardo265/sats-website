// Toast Notification Component for SafeSats
import React, { useEffect, useState } from 'react';
import { CheckCircle, Warning, Info, X } from 'phosphor-react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300); // Animation duration
  };

  const getToastStyles = () => {
    const baseStyles = `
      fixed z-50 max-w-sm w-full p-4 rounded-lg shadow-lg border backdrop-blur-sm
      transform transition-all duration-300 ease-in-out
    `;

    const positionStyles = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    const typeStyles = {
      success: 'bg-green-500/20 border-green-500/30 text-green-400',
      error: 'bg-red-500/20 border-red-500/30 text-red-400',
      warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      info: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
    };

    const animationStyles = isExiting 
      ? 'opacity-0 scale-95 translate-y-2' 
      : 'opacity-100 scale-100 translate-y-0';

    return `${baseStyles} ${positionStyles[position]} ${typeStyles[type]} ${animationStyles}`;
  };

  const getIcon = () => {
    const iconProps = { size: 20, weight: 'fill' };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-400" />;
      case 'error':
        return <Warning {...iconProps} className="text-red-400" />;
      case 'warning':
        return <Warning {...iconProps} className="text-yellow-400" />;
      case 'info':
      default:
        return <Info {...iconProps} className="text-blue-400" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">
            {message}
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
