#!/usr/bin/env node

/**
 * Database Connection Verification Script
 * Verifies that the SafeSats database is properly connected and operational
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

async function verifyDatabaseConnection() {
  log('\n🔍 SafeSats Database Connection Verification', colors.bold + colors.blue);
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

  // Test database connection
  log('\n2. Testing Database Connection...', colors.yellow);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      log(`❌ Connection failed: ${error.message}`, colors.red);
      return false;
    }

    log('✅ Database connection successful!', colors.green);

    // Test authentication
    log('\n3. Testing Authentication...', colors.yellow);
    
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      log(`⚠️  Auth check warning: ${authError.message}`, colors.yellow);
    } else {
      log('✅ Authentication system accessible', colors.green);
    }

    // Test table access
    log('\n4. Testing Table Access...', colors.yellow);
    
    const tables = ['profiles', 'portfolios', 'transactions', 'orders'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (tableError) {
          log(`❌ Table '${table}': ${tableError.message}`, colors.red);
        } else {
          log(`✅ Table '${table}': Accessible`, colors.green);
        }
      } catch (err) {
        log(`❌ Table '${table}': ${err.message}`, colors.red);
      }
    }

    // Test realtime
    log('\n5. Testing Realtime Connection...', colors.yellow);
    
    try {
      const channel = supabase.channel('test-channel');
      log('✅ Realtime channel created successfully', colors.green);
      
      // Clean up
      supabase.removeChannel(channel);
    } catch (err) {
      log(`⚠️  Realtime warning: ${err.message}`, colors.yellow);
    }

    return true;

  } catch (error) {
    log(`❌ Database verification failed: ${error.message}`, colors.red);
    return false;
  }
}

async function main() {
  try {
    const success = await verifyDatabaseConnection();
    
    log('\n' + '=' .repeat(50), colors.blue);
    
    if (success) {
      log('🎉 Database Verification SUCCESSFUL!', colors.bold + colors.green);
      log('\nYour SafeSats database is properly configured and operational.', colors.green);
      log('\nNext steps:', colors.blue);
      log('- Start your development server: npm start', colors.reset);
      log('- Run database tests: npm test -- --testPathPattern=database', colors.reset);
      log('- Check health monitoring in browser console', colors.reset);
    } else {
      log('❌ Database Verification FAILED!', colors.bold + colors.red);
      log('\nPlease check your configuration and try again.', colors.red);
      process.exit(1);
    }
    
  } catch (error) {
    log(`❌ Verification script error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the verification
main();
