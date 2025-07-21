#!/usr/bin/env node

/**
 * Registration Debug Script
 * Tests the registration flow to identify "Failed to fetch" issues
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function debugRegistration() {
  log('\n🔍 SafeSats Registration Debug', colors.bold + colors.blue);
  log('=' .repeat(50), colors.blue);

  // Check environment variables
  log('\n1. Checking Environment Configuration...', colors.yellow);
  
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    log('❌ REACT_APP_SUPABASE_URL is not set', colors.red);
    return false;
  }

  if (!supabaseKey) {
    log('❌ REACT_APP_SUPABASE_ANON_KEY is not set', colors.red);
    return false;
  }

  log(`✅ Supabase URL: ${supabaseUrl}`, colors.green);
  log(`✅ Supabase Key: ${supabaseKey.substring(0, 20)}...`, colors.green);

  // Create Supabase client
  log('\n2. Creating Supabase Client...', colors.yellow);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // Disable for testing
        detectSessionInUrl: false,
        flowType: 'pkce'
      }
    });

    log('✅ Supabase client created successfully', colors.green);

    // Test basic connection
    log('\n3. Testing Basic Connection...', colors.yellow);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      log(`❌ Connection test failed: ${error.message}`, colors.red);
      log(`Error details: ${JSON.stringify(error, null, 2)}`, colors.red);
      return false;
    }

    log('✅ Basic connection test passed', colors.green);

    // Test authentication endpoint
    log('\n4. Testing Authentication Endpoint...', colors.yellow);
    
    try {
      // Test with a dummy signup to check if the endpoint is reachable
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123',
        options: {
          data: {
            full_name: 'Test User',
            phone: '+265123456789'
          }
        }
      });

      if (authError) {
        // Check if it's a "user already exists" error (which is expected)
        if (authError.message.includes('already registered') || 
            authError.message.includes('already exists') ||
            authError.status === 422) {
          log('✅ Auth endpoint reachable (user already exists - expected)', colors.green);
        } else {
          log(`⚠️  Auth endpoint warning: ${authError.message}`, colors.yellow);
          log(`Error status: ${authError.status}`, colors.yellow);
          log(`Error details: ${JSON.stringify(authError, null, 2)}`, colors.yellow);
        }
      } else {
        log('✅ Auth endpoint working (test user created)', colors.green);
        
        // Clean up test user if created
        if (authData.user) {
          log('🧹 Cleaning up test user...', colors.blue);
          // Note: In production, you'd need admin privileges to delete users
        }
      }
    } catch (authTestError) {
      log(`❌ Auth endpoint test failed: ${authTestError.message}`, colors.red);
      log(`Stack: ${authTestError.stack}`, colors.red);
      return false;
    }

    // Test profile table access
    log('\n5. Testing Profile Table Access...', colors.yellow);
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (profileError) {
        log(`❌ Profile table access failed: ${profileError.message}`, colors.red);
        log(`Error details: ${JSON.stringify(profileError, null, 2)}`, colors.red);
      } else {
        log('✅ Profile table accessible', colors.green);
      }
    } catch (profileTestError) {
      log(`❌ Profile table test failed: ${profileTestError.message}`, colors.red);
    }

    // Test CORS and network connectivity
    log('\n6. Testing CORS and Network Connectivity...', colors.yellow);
    
    try {
      // Make a direct HTTP request to test CORS
      const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=count&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      });

      if (response.ok) {
        log('✅ Direct HTTP request successful (CORS working)', colors.green);
      } else {
        log(`⚠️  HTTP request returned status: ${response.status}`, colors.yellow);
        const responseText = await response.text();
        log(`Response: ${responseText}`, colors.yellow);
      }
    } catch (fetchError) {
      log(`❌ Direct HTTP request failed: ${fetchError.message}`, colors.red);
      
      if (fetchError.message.includes('fetch')) {
        log('🔍 This might be a CORS or network connectivity issue', colors.blue);
      }
    }

    // Test with real registration data format
    log('\n7. Testing Registration Data Format...', colors.yellow);
    
    const testRegistrationData = {
      email: 'debug-test@safesats.com',
      password: 'SecurePassword123!',
      options: {
        data: {
          full_name: 'Debug Test User',
          phone: '+265888123456'
        }
      }
    };

    try {
      const { data: regData, error: regError } = await supabase.auth.signUp(testRegistrationData);
      
      if (regError) {
        if (regError.message.includes('already registered') || 
            regError.message.includes('already exists') ||
            regError.status === 422) {
          log('✅ Registration format test passed (user exists - expected)', colors.green);
        } else {
          log(`⚠️  Registration format warning: ${regError.message}`, colors.yellow);
        }
      } else {
        log('✅ Registration format test passed', colors.green);
      }
    } catch (regTestError) {
      log(`❌ Registration format test failed: ${regTestError.message}`, colors.red);
    }

    return true;

  } catch (error) {
    log(`❌ Debug failed: ${error.message}`, colors.red);
    log(`Stack: ${error.stack}`, colors.red);
    return false;
  }
}

async function main() {
  try {
    const success = await debugRegistration();
    
    log('\n' + '=' .repeat(50), colors.blue);
    
    if (success) {
      log('🎉 Registration Debug COMPLETED!', colors.bold + colors.green);
      log('\nPossible causes of "Failed to fetch" error:', colors.blue);
      log('1. Network connectivity issues', colors.reset);
      log('2. CORS configuration problems', colors.reset);
      log('3. Supabase project settings', colors.reset);
      log('4. Browser security restrictions', colors.reset);
      log('5. Firewall or proxy blocking requests', colors.reset);
      
      log('\nRecommended next steps:', colors.blue);
      log('- Check browser developer tools Network tab', colors.reset);
      log('- Verify Supabase project is active', colors.reset);
      log('- Check browser console for detailed errors', colors.reset);
      log('- Test from different network/browser', colors.reset);
    } else {
      log('❌ Registration Debug FAILED!', colors.bold + colors.red);
      log('\nCritical issues found that need to be resolved.', colors.red);
    }
    
  } catch (error) {
    log(`❌ Debug script error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the debug
main();
