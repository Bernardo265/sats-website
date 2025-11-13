// Payment System Constants for SafeSats
import config from './config';

// Payment Method Types
export const PAYMENT_METHODS = {
  AIRTEL_MONEY: 'airtel_money',
  MUKURU: 'mukuru',
  MASTER_CARD: 'master_card',
  VISA: 'visa',
  BANK_TRANSFER: 'bank_transfer',
  MPAMBA: 'mpamba'
};

// Payment Method Configuration
export const PAYMENT_METHOD_CONFIG = {
  [PAYMENT_METHODS.AIRTEL_MONEY]: {
    id: PAYMENT_METHODS.AIRTEL_MONEY,
    name: 'Airtel Money',
    displayName: 'Airtel Money',
    logo: '/images/airtel-money.png',
    description: 'Pay securely with your Airtel Money wallet',
    fee: config.payment.fees.airtelMoney, // 2% fee
    minAmount: config.payment.minAmount, // Minimum amount in local currency
    maxAmount: config.payment.maxAmount, // Maximum amount in local currency
    currency: 'USD', // Malawian Kwacha
    isActive: config.features.airtelMoney,
    processingTime: '5-10 minutes',
    requiredFields: ['phoneNumber'],
    supportedCountries: ['MW'], // Malawi
    apiEndpoint: '/api/payments/airtel-money'
  },
  // [PAYMENT_METHODS.MUKURU]: {
  //   id: PAYMENT_METHODS.MUKURU,
  //   name: 'Mukuru',
  //   displayName: 'Mukuru',
  //   logo: '/images/mukuru.png',
  //   description: 'International money transfer service',
  //   fee: 0.015, // 1.5% fee
  //   minAmount: 5000,
  //   maxAmount: 10000000,
  //   currency: 'MWK',
  //   isActive: false, // Not yet implemented
  //   processingTime: '1-3 business days',
  //   requiredFields: ['accountNumber', 'recipientName'],
  //   supportedCountries: ['MW', 'ZA', 'ZW'],
  //   apiEndpoint: '/api/payments/mukuru'
  // },
  [PAYMENT_METHODS.MASTER_CARD]: {
    id: PAYMENT_METHODS.MASTER_CARD,
    name: 'MasterCard',
    displayName: 'MasterCard',
    logo: '/images/matser-card.png',
    description: 'Pay with your MasterCard',
    fee: 0.035, // 3.5% fee
    minAmount: 1000,
    maxAmount: 20000000,
    currency: 'USD',
    isActive: false, // Not yet implemented
    processingTime: 'Instant',
    requiredFields: ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'],
    supportedCountries: ['MW', 'ZM', 'TZ', 'KE'],
    apiEndpoint: '/api/payments/mastercard'
  }
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};

// Transaction Types
export const TRANSACTION_TYPES = {
  BUY: 'buy'
};

// API Endpoints
export const API_ENDPOINTS = {
  AIRTEL_MONEY: {
    BASE_URL: config.airtelMoney.baseUrl,
    AUTH: '/auth/oauth2/token',
    PAYMENT: '/merchant/v1/payments/',
    STATUS: '/standard/v1/payments/',
    REFUND: '/standard/v1/payments/refund'
  },
  SAFESATS: {
    BASE_URL: config.api.baseUrl,
    TRANSACTIONS: '/transactions',
    BITCOIN_PRICE: '/bitcoin/price',
    PAYMENT_METHODS: '/payment-methods'
  }
};

// Error Codes
export const ERROR_CODES = {
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
  TRANSACTION_TIMEOUT: 'TRANSACTION_TIMEOUT',
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED'
};

// Error Messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.PAYMENT_FAILED]: 'Payment failed. Please try again or contact support.',
  [ERROR_CODES.INSUFFICIENT_FUNDS]: 'Insufficient funds in your wallet. Please top up and try again.',
  [ERROR_CODES.INVALID_PHONE_NUMBER]: 'Invalid phone number format. Please enter a valid Airtel Money number.',
  [ERROR_CODES.TRANSACTION_TIMEOUT]: 'Transaction timed out. Please check your payment status.',
  [ERROR_CODES.API_ERROR]: 'Service temporarily unavailable. Please try again later.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.UNAUTHORIZED]: 'Authentication failed. Please log in again.'
};

// Validation Rules
export const VALIDATION_RULES = {
  AIRTEL_MONEY_PHONE: {
    pattern: /^(\+265|0)?[89]\d{7}$/, // Malawi Airtel numbers
    message: 'Please enter a valid Airtel Money number (e.g., +265888123456 or 0888123456)'
  },
  AMOUNT: {
    min: 5000,
    max: 2000000,
    message: 'Amount must be between MWK 5,000 and MWK 2,000,000'
  }
};

// Bitcoin Configuration
export const BITCOIN_CONFIG = {
  NETWORK: process.env.REACT_APP_BITCOIN_NETWORK || 'testnet',
  CONFIRMATION_BLOCKS: 1,
  WALLET_GENERATION_TIMEOUT: 30000, // 30 seconds
  PRICE_UPDATE_INTERVAL: 60000 // 1 minute
};

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT: 30000,
  POLLING_INTERVAL: 5000,
  MAX_RETRIES: 3
};

export default {
  PAYMENT_METHODS,
  PAYMENT_METHOD_CONFIG,
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
  API_ENDPOINTS,
  ERROR_CODES,
  ERROR_MESSAGES,
  VALIDATION_RULES,
  BITCOIN_CONFIG,
  UI_CONFIG
};
