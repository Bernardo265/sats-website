// Error Handling Utilities for SafeSats
import { ERROR_CODES, ERROR_MESSAGES } from './paymentConstants';

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  // Log error for debugging and monitoring
  logError(error, context = {}) {
    const errorEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errorLog.unshift(errorEntry);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorEntry);
    }

    return errorEntry.id;
  }

  // Get user-friendly error message
  getUserMessage(error, fallback = 'An unexpected error occurred') {
    if (typeof error === 'string') {
      return ERROR_MESSAGES[error] || error || fallback;
    }

    if (error?.message) {
      // Check if it's a known error code
      if (ERROR_MESSAGES[error.message]) {
        return ERROR_MESSAGES[error.message];
      }

      // Handle network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return 'Network connection error. Please check your internet connection and try again.';
      }

      // Handle timeout errors
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }

      // Handle authentication errors
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        return 'Authentication failed. Please log in again.';
      }

      // Handle server errors
      if (error.message.includes('500') || error.message.includes('server')) {
        return 'Server error. Please try again later.';
      }

      return error.message;
    }

    return fallback;
  }

  // Handle API errors specifically
  handleApiError(error, context = {}) {
    this.logError(error, { ...context, type: 'api_error' });

    // Extract meaningful error information
    let errorCode = ERROR_CODES.API_ERROR;
    let userMessage = 'Service temporarily unavailable. Please try again later.';

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorCode = ERROR_CODES.VALIDATION_ERROR;
          userMessage = data?.message || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorCode = ERROR_CODES.UNAUTHORIZED;
          userMessage = 'Authentication failed. Please log in again.';
          break;
        case 403:
          errorCode = ERROR_CODES.UNAUTHORIZED;
          userMessage = 'Access denied. You don\'t have permission to perform this action.';
          break;
        case 404:
          errorCode = ERROR_CODES.API_ERROR;
          userMessage = 'Service not found. Please try again later.';
          break;
        case 429:
          errorCode = ERROR_CODES.API_ERROR;
          userMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorCode = ERROR_CODES.API_ERROR;
          userMessage = 'Server error. Please try again later.';
          break;
        default:
          userMessage = data?.message || `Request failed with status ${status}`;
      }
    } else if (error.request) {
      // Network error
      errorCode = ERROR_CODES.NETWORK_ERROR;
      userMessage = 'Network connection error. Please check your internet connection.';
    } else {
      // Other error
      userMessage = error.message || 'An unexpected error occurred.';
    }

    return {
      code: errorCode,
      message: userMessage,
      originalError: error
    };
  }

  // Handle payment-specific errors
  handlePaymentError(error, paymentMethod = null) {
    const context = { 
      type: 'payment_error', 
      paymentMethod,
      timestamp: new Date().toISOString()
    };
    
    this.logError(error, context);

    // Payment-specific error handling
    if (typeof error === 'string') {
      switch (error) {
        case ERROR_CODES.INSUFFICIENT_FUNDS:
          return {
            code: ERROR_CODES.INSUFFICIENT_FUNDS,
            message: 'Insufficient funds in your wallet. Please top up and try again.',
            action: 'topup'
          };
        case ERROR_CODES.INVALID_PHONE_NUMBER:
          return {
            code: ERROR_CODES.INVALID_PHONE_NUMBER,
            message: 'Invalid phone number format. Please enter a valid number.',
            action: 'retry'
          };
        case ERROR_CODES.TRANSACTION_TIMEOUT:
          return {
            code: ERROR_CODES.TRANSACTION_TIMEOUT,
            message: 'Transaction timed out. Please check your payment status.',
            action: 'check_status'
          };
        default:
          return {
            code: ERROR_CODES.PAYMENT_FAILED,
            message: ERROR_MESSAGES[error] || 'Payment failed. Please try again.',
            action: 'retry'
          };
      }
    }

    // Handle error objects
    const apiError = this.handleApiError(error, context);
    return {
      ...apiError,
      action: 'retry'
    };
  }

  // Retry mechanism with exponential backoff
  async retryOperation(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        this.logError(error, { 
          type: 'retry_attempt', 
          attempt, 
          maxRetries 
        });

        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // Validate input and return validation errors
  validateInput(data, rules) {
    const errors = {};

    Object.keys(rules).forEach(field => {
      const value = data[field];
      const rule = rules[field];

      if (rule.required && (!value || value.toString().trim() === '')) {
        errors[field] = `${rule.label || field} is required`;
        return;
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message || `Invalid ${rule.label || field} format`;
        return;
      }

      if (value && rule.min && value < rule.min) {
        errors[field] = `${rule.label || field} must be at least ${rule.min}`;
        return;
      }

      if (value && rule.max && value > rule.max) {
        errors[field] = `${rule.label || field} must not exceed ${rule.max}`;
        return;
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
        return;
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${rule.label || field} must not exceed ${rule.maxLength} characters`;
        return;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Get error log for debugging
  getErrorLog() {
    return this.errorLog;
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
  }

  // Report error to external service (placeholder)
  async reportError(error, context = {}) {
    try {
      // In production, send to error reporting service
      if (process.env.NODE_ENV === 'production') {
        // Example: await sendToSentry(error, context);
        console.log('Error reported:', { error, context });
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
}

// Export singleton instance
export default new ErrorHandler();
