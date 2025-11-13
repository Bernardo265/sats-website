// Payment Context for SafeSats
import React, { createContext, useContext, useReducer } from 'react';
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_CONFIG,
  TRANSACTION_STATUS,
  TRANSACTION_TYPES
} from '../utils/paymentConstants';
// import airtelMoneyService from '../services/airtelMoneyService';
// import transactionService from '../services/transactionService';

// Initial state
const initialState = {
  // Payment methods
  availablePaymentMethods: Object.values(PAYMENT_METHOD_CONFIG).filter(method => method.isActive),
  selectedPaymentMethod: null,
  
  // Transaction state
  currentTransaction: null,
  transactionHistory: [],
  
  // UI state
  isLoading: false,
  error: null,
  successMessage: null,
  
  // Bitcoin data
  bitcoinPrice: null,
  bitcoinAmount: 0,
  fiatAmount: 0,
  
  // User data
  paymentMethods: []
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  
  SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
  SET_BITCOIN_PRICE: 'SET_BITCOIN_PRICE',
  SET_AMOUNTS: 'SET_AMOUNTS',
  
  START_TRANSACTION: 'START_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  COMPLETE_TRANSACTION: 'COMPLETE_TRANSACTION',
  FAIL_TRANSACTION: 'FAIL_TRANSACTION',
  
  ADD_TRANSACTION_HISTORY: 'ADD_TRANSACTION_HISTORY',
  SET_USER_WALLET: 'SET_USER_WALLET',
  SET_USER_PAYMENT_METHODS: 'SET_USER_PAYMENT_METHODS'
};

// Reducer function
function paymentReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error
      };
      
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        successMessage: null
      };
      
    case ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        successMessage: action.payload,
        error: null,
        isLoading: false
      };
      
    case ACTION_TYPES.CLEAR_MESSAGES:
      return {
        ...state,
        error: null,
        successMessage: null
      };
      
    case ACTION_TYPES.SET_PAYMENT_METHOD:
      return {
        ...state,
        selectedPaymentMethod: action.payload
      };
      
    case ACTION_TYPES.SET_BITCOIN_PRICE:
      return {
        ...state,
        bitcoinPrice: action.payload
      };
      
    case ACTION_TYPES.SET_AMOUNTS:
      return {
        ...state,
        fiatAmount: action.payload.fiatAmount,
        bitcoinAmount: action.payload.bitcoinAmount
      };
      
    case ACTION_TYPES.START_TRANSACTION:
      return {
        ...state,
        currentTransaction: {
          ...action.payload,
          status: TRANSACTION_STATUS.PENDING,
          createdAt: new Date().toISOString()
        },
        isLoading: true,
        error: null
      };
      
    case ACTION_TYPES.UPDATE_TRANSACTION:
      return {
        ...state,
        currentTransaction: state.currentTransaction ? {
          ...state.currentTransaction,
          ...action.payload,
          updatedAt: new Date().toISOString()
        } : null
      };
      
    case ACTION_TYPES.COMPLETE_TRANSACTION:
      const completedTransaction = {
        ...state.currentTransaction,
        ...action.payload,
        status: TRANSACTION_STATUS.COMPLETED,
        completedAt: new Date().toISOString()
      };
      
      return {
        ...state,
        currentTransaction: null,
        transactionHistory: [completedTransaction, ...state.transactionHistory],
        isLoading: false,
        successMessage: 'Transaction completed successfully!'
      };
      
    case ACTION_TYPES.FAIL_TRANSACTION:
      const failedTransaction = {
        ...state.currentTransaction,
        ...action.payload,
        status: TRANSACTION_STATUS.FAILED,
        failedAt: new Date().toISOString()
      };
      
      return {
        ...state,
        currentTransaction: null,
        transactionHistory: [failedTransaction, ...state.transactionHistory],
        isLoading: false,
        error: action.payload.error || 'Transaction failed'
      };
      
    case ACTION_TYPES.ADD_TRANSACTION_HISTORY:
      return {
        ...state,
        transactionHistory: [action.payload, ...state.transactionHistory]
      };
      
    case ACTION_TYPES.SET_USER_WALLET:
      return {
        ...state,
        userWallet: action.payload
      };
      
    case ACTION_TYPES.SET_USER_PAYMENT_METHODS:
      return {
        ...state,
        paymentMethods: action.payload
      };
      
    default:
      return state;
  }
}

// Create context
const PaymentContext = createContext();

// Payment provider component
export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
  };

  const setSuccess = (message) => {
    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: message });
  };

  const clearMessages = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_MESSAGES });
  };

  const selectPaymentMethod = (methodId) => {
    const method = PAYMENT_METHOD_CONFIG[methodId];
    if (method && method.isActive) {
      dispatch({ type: ACTION_TYPES.SET_PAYMENT_METHOD, payload: method });
    }
  };

  const setBitcoinPrice = (price) => {
    dispatch({ type: ACTION_TYPES.SET_BITCOIN_PRICE, payload: price });
  };

  const setAmounts = (fiatAmount, bitcoinAmount) => {
    dispatch({ 
      type: ACTION_TYPES.SET_AMOUNTS, 
      payload: { fiatAmount, bitcoinAmount } 
    });
  };

  // Calculate Bitcoin amount from fiat amount
  const calculateBitcoinAmount = (fiatAmount) => {
    if (!state.bitcoinPrice || !fiatAmount) return 0;
    return fiatAmount / state.bitcoinPrice;
  };

  // Calculate fiat amount from Bitcoin amount
  const calculateFiatAmount = (bitcoinAmount) => {
    if (!state.bitcoinPrice || !bitcoinAmount) return 0;
    return bitcoinAmount * state.bitcoinPrice;
  };

  // Initiate Airtel Money payment
  const initiateAirtelMoneyPayment = async (paymentData) => {
    console.log('Mocked initiateAirtelMoneyPayment', paymentData);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSuccess('Mocked payment successful!');
    return { success: true, transactionId: 'mock-transaction-id' };
  };

  // Poll transaction status
  const pollTransactionStatus = async (airtelTransactionId, safesatsTransactionId, maxAttempts = 12) => {
    // Commented out due to missing services
    console.log('pollTransactionStatus called, but is a no-op due to missing services.');
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    setSuccess,
    clearMessages,
    selectPaymentMethod,
    setBitcoinPrice,
    setAmounts,
    calculateBitcoinAmount,
    calculateFiatAmount,
    initiateAirtelMoneyPayment,
    pollTransactionStatus
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook to use payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;
