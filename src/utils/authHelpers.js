/**
 * Authentication Helper Functions
 * Provides enhanced authentication utilities with better error handling
 */

import { supabase } from '../lib/supabase';

/**
 * Enhanced registration function with comprehensive error handling
 */
export const enhancedRegister = async (userData) => {
  try {
    console.log('🔄 Enhanced registration starting...', userData.email);

    // Pre-flight validation
    if (!userData.email || !userData.password || !userData.fullName) {
      throw new Error('Missing required fields');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Password validation
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Prepare signup data
    const signUpData = {
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
          phone: userData.phone
        },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    };

    console.log('📤 Sending signup request...');

    // Attempt registration with timeout
    const registrationPromise = supabase.auth.signUp(signUpData);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - please try again')), 30000)
    );

    const { data, error } = await Promise.race([registrationPromise, timeoutPromise]);

    console.log('📥 Registration response:', { 
      hasData: !!data, 
      hasUser: !!data?.user, 
      hasError: !!error 
    });

    if (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }

    if (!data.user) {
      throw new Error('No user data received from server');
    }

    console.log('✅ Registration successful:', data.user.id);
    return { success: true, user: data.user };

  } catch (error) {
    console.error('❌ Enhanced registration error:', error);
    
    // Categorize and handle different error types
    if (error.message.includes('fetch')) {
      throw new Error('Network connection error. Please check your internet connection and try again.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    } else if (error.message.includes('already registered')) {
      throw new Error('An account with this email already exists. Please try logging in instead.');
    } else if (error.message.includes('invalid email')) {
      throw new Error('Please enter a valid email address.');
    } else if (error.message.includes('password')) {
      throw new Error('Password must be at least 6 characters long.');
    } else if (error.message.includes('CORS')) {
      throw new Error('Connection error. Please try refreshing the page.');
    }
    
    throw error;
  }
};

/**
 * Test network connectivity to Supabase
 */
export const testSupabaseConnectivity = async () => {
  try {
    console.log('🔍 Testing Supabase connectivity...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Connectivity test failed:', error);
      return { connected: false, error: error.message };
    }

    console.log('✅ Connectivity test passed');
    return { connected: true };
  } catch (error) {
    console.error('❌ Connectivity test error:', error);
    return { connected: false, error: error.message };
  }
};

/**
 * Test authentication endpoint specifically
 */
export const testAuthEndpoint = async () => {
  try {
    console.log('🔍 Testing auth endpoint...');
    
    // Use a test email that should trigger a known response
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    // We expect this to fail with "already registered" or "invalid email"
    if (error) {
      if (error.message.includes('already registered') || 
          error.message.includes('invalid email') ||
          error.status === 422 || error.status === 400) {
        console.log('✅ Auth endpoint reachable (expected error)');
        return { reachable: true, expectedError: true };
      } else {
        console.error('❌ Auth endpoint error:', error);
        return { reachable: false, error: error.message };
      }
    }

    console.log('✅ Auth endpoint working');
    return { reachable: true };
  } catch (error) {
    console.error('❌ Auth endpoint test error:', error);
    return { reachable: false, error: error.message };
  }
};

/**
 * Comprehensive system check
 */
export const runSystemCheck = async () => {
  console.log('🔍 Running comprehensive system check...');
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
      hasSupabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
      debugMode: process.env.REACT_APP_DEBUG_MODE === 'true'
    },
    connectivity: await testSupabaseConnectivity(),
    authEndpoint: await testAuthEndpoint(),
    browser: {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      localStorage: typeof localStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined'
    }
  };

  console.log('📊 System check results:', results);
  return results;
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyError = (error) => {
  if (!error) return 'An unknown error occurred';
  
  const message = error.message || error.toString();
  
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network connection error. Please check your internet connection and try again.';
  } else if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  } else if (message.includes('already registered')) {
    return 'An account with this email already exists. Please try logging in instead.';
  } else if (message.includes('invalid email')) {
    return 'Please enter a valid email address.';
  } else if (message.includes('password')) {
    return 'Password must be at least 6 characters long.';
  } else if (message.includes('CORS')) {
    return 'Connection error. Please try refreshing the page.';
  } else if (message.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  return message;
};
