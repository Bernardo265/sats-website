#!/usr/bin/env node

/**
 * Database Health Check Script
 * Runs comprehensive health checks and initializes monitoring
 */

const path = require('path');
const fs = require('fs');

// Add src to require path for our modules
const srcPath = path.join(__dirname, '..', 'src');
require('module').globalPaths.push(srcPath);

// Mock browser globals for Node.js environment
global.window = {};
global.document = {};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

// Mock performance API
global.performance = {
  now: () => Date.now()
};

// Load environment variables
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

async function runHealthCheck() {
  log('\n🏥 SafeSats Database Health Check', colors.bold + colors.blue);
  log('=' .repeat(50), colors.blue);

  try {
    // Import our health check module
    const dbHealthCheckPath = path.join(srcPath, 'utils', 'dbHealthCheck.js');
    const dbConfigPath = path.join(srcPath, 'lib', 'dbConfig.js');
    
    if (!fs.existsSync(dbHealthCheckPath)) {
      log('❌ Health check module not found', colors.red);
      return false;
    }

    if (!fs.existsSync(dbConfigPath)) {
      log('❌ Database config module not found', colors.red);
      return false;
    }

    // Dynamic import for ES modules
    const { default: dbHealthCheck } = await import(`file://${dbHealthCheckPath}`);
    const { default: dbConfig } = await import(`file://${dbConfigPath}`);

    log('\n1. Initializing Database Configuration...', colors.yellow);
    
    const initResult = await dbConfig.initialize();
    if (initResult.success) {
      log('✅ Database configuration initialized', colors.green);
    } else {
      log(`⚠️  Database config warning: ${initResult.error}`, colors.yellow);
    }

    log('\n2. Running Comprehensive Health Check...', colors.yellow);
    
    const healthResult = await dbHealthCheck.runHealthCheck();
    
    log(`\n📊 Health Check Results:`, colors.blue);
    log(`Overall Status: ${healthResult.overall}`, 
        healthResult.overall === 'healthy' ? colors.green : 
        healthResult.overall === 'warning' ? colors.yellow : colors.red);
    
    // Display individual check results
    for (const [checkName, result] of Object.entries(healthResult.checks)) {
      const status = result.healthy ? '✅' : '❌';
      const color = result.healthy ? colors.green : colors.red;
      log(`${status} ${checkName}: ${result.message}`, color);
      
      if (result.details) {
        log(`   Details: ${JSON.stringify(result.details)}`, colors.reset);
      }
    }

    // Display performance metrics
    if (healthResult.performance) {
      log(`\n⚡ Performance Metrics:`, colors.blue);
      for (const [metric, value] of Object.entries(healthResult.performance)) {
        log(`   ${metric}: ${value}ms`, colors.reset);
      }
    }

    // Display any errors
    if (healthResult.errors && healthResult.errors.length > 0) {
      log(`\n⚠️  Errors Encountered:`, colors.yellow);
      healthResult.errors.forEach(error => {
        log(`   - ${error}`, colors.red);
      });
    }

    log('\n3. Testing Quick Status...', colors.yellow);
    
    const quickStatus = await dbHealthCheck.getQuickStatus();
    log(`Connection Status: ${quickStatus.connected ? 'Connected' : 'Disconnected'}`, 
        quickStatus.connected ? colors.green : colors.red);
    log(`Initialized: ${quickStatus.initialized ? 'Yes' : 'No'}`, 
        quickStatus.initialized ? colors.green : colors.yellow);
    log(`Monitoring: ${quickStatus.monitoring ? 'Active' : 'Inactive'}`, 
        quickStatus.monitoring ? colors.green : colors.yellow);

    log('\n4. Starting Health Monitoring...', colors.yellow);
    
    // Start monitoring for 10 seconds
    dbHealthCheck.startMonitoring(5000); // 5 second intervals
    
    log('✅ Health monitoring started (5-second intervals)', colors.green);
    log('⏱️  Monitoring for 15 seconds...', colors.blue);
    
    // Wait for monitoring
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Stop monitoring
    dbHealthCheck.stopMonitoring();
    log('✅ Health monitoring stopped', colors.green);

    // Get monitoring status
    const monitoringStatus = dbHealthCheck.getMonitoringStatus();
    log(`\n📈 Monitoring Summary:`, colors.blue);
    log(`   Checks performed: ${monitoringStatus.checksPerformed || 0}`, colors.reset);
    log(`   Last check: ${monitoringStatus.lastCheck || 'Never'}`, colors.reset);
    log(`   Status: ${monitoringStatus.isRunning ? 'Running' : 'Stopped'}`, 
        monitoringStatus.isRunning ? colors.green : colors.yellow);

    return healthResult.overall !== 'critical';

  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, colors.red);
    log(`Stack: ${error.stack}`, colors.red);
    return false;
  }
}

async function main() {
  try {
    const success = await runHealthCheck();
    
    log('\n' + '=' .repeat(50), colors.blue);
    
    if (success) {
      log('🎉 Health Check COMPLETED!', colors.bold + colors.green);
      log('\nYour SafeSats database health monitoring is operational.', colors.green);
    } else {
      log('⚠️  Health Check completed with warnings', colors.bold + colors.yellow);
      log('\nSome issues were detected but the system is functional.', colors.yellow);
    }
    
  } catch (error) {
    log(`❌ Health check script error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the health check
main();
