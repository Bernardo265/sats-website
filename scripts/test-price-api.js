#!/usr/bin/env node

/**
 * Price API Test Script
 * Tests the CoinGecko API connectivity and response format
 */

const https = require('https');
const fetch = require('node-fetch');

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

async function testPriceAPI() {
  log('\n🔍 SafeSats Price API Test', colors.bold + colors.blue);
  log('=' .repeat(50), colors.blue);

  const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true&include_market_cap=true';

  // Test 1: Basic connectivity
  log('\n1. Testing Basic Connectivity...', colors.yellow);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SafeSats-Website/1.0'
      },
      timeout: 10000
    });

    log(`✅ Response Status: ${response.status} ${response.statusText}`, colors.green);
    log(`✅ Response Headers:`, colors.green);
    
    for (const [key, value] of response.headers.entries()) {
      log(`   ${key}: ${value}`, colors.reset);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Test 2: Response format
    log('\n2. Testing Response Format...', colors.yellow);
    
    const data = await response.json();
    log(`✅ Response received successfully`, colors.green);
    log(`✅ Response data:`, colors.green);
    log(JSON.stringify(data, null, 2), colors.reset);

    // Test 3: Data validation
    log('\n3. Validating Data Structure...', colors.yellow);
    
    if (!data.bitcoin) {
      throw new Error('Missing bitcoin data in response');
    }

    const btcData = data.bitcoin;
    const requiredFields = ['usd', 'usd_24h_change', 'usd_24h_vol', 'usd_market_cap', 'last_updated_at'];
    
    for (const field of requiredFields) {
      if (btcData[field] === undefined) {
        log(`⚠️  Missing field: ${field}`, colors.yellow);
      } else {
        log(`✅ Field present: ${field} = ${btcData[field]}`, colors.green);
      }
    }

    // Test 4: Calculate derived values
    log('\n4. Testing Price Calculations...', colors.yellow);
    
    const btcUsdPrice = btcData.usd;
    const priceChange24h = btcData.usd_24h_change || 0;
    const volume24h = btcData.usd_24h_vol || 0;
    const marketCap = btcData.usd_market_cap || 0;
    const lastUpdated = btcData.last_updated_at;
    const MWK_USD_RATE = 1730;

    // Calculate MWK price
    const btcMwkPrice = btcUsdPrice * MWK_USD_RATE;

    // Calculate 24h high/low estimates
    const high24h = btcUsdPrice + Math.abs(priceChange24h);
    const low24h = btcUsdPrice - Math.abs(priceChange24h);

    log(`✅ BTC USD Price: $${btcUsdPrice.toLocaleString()}`, colors.green);
    log(`✅ BTC MWK Price: MWK ${btcMwkPrice.toLocaleString()}`, colors.green);
    log(`✅ 24h Change: ${priceChange24h.toFixed(2)}%`, colors.green);
    log(`✅ 24h Volume: $${volume24h.toLocaleString()}`, colors.green);
    log(`✅ Market Cap: $${marketCap.toLocaleString()}`, colors.green);
    log(`✅ High 24h: $${high24h.toLocaleString()}`, colors.green);
    log(`✅ Low 24h: $${low24h.toLocaleString()}`, colors.green);
    log(`✅ Last Updated: ${new Date(lastUpdated * 1000).toISOString()}`, colors.green);

    return true;

  } catch (error) {
    log(`❌ API test failed: ${error.message}`, colors.red);
    
    if (error.code === 'ENOTFOUND') {
      log('🔍 DNS resolution failed - check internet connection', colors.blue);
    } else if (error.code === 'ECONNREFUSED') {
      log('🔍 Connection refused - API might be down', colors.blue);
    } else if (error.code === 'ETIMEDOUT') {
      log('🔍 Request timed out - network or API issues', colors.blue);
    } else if (error.message.includes('fetch')) {
      log('🔍 Fetch error - might be CORS or network issue', colors.blue);
    }
    
    return false;
  }
}

async function testAlternativeAPIs() {
  log('\n5. Testing Alternative APIs...', colors.yellow);
  
  const alternatives = [
    {
      name: 'CoinGecko Simple',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    },
    {
      name: 'CoinGecko Ping',
      url: 'https://api.coingecko.com/api/v3/ping'
    }
  ];

  for (const api of alternatives) {
    try {
      log(`\n   Testing ${api.name}...`, colors.blue);
      
      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SafeSats-Website/1.0'
        },
        timeout: 5000
      });

      if (response.ok) {
        const data = await response.json();
        log(`   ✅ ${api.name}: Working`, colors.green);
        log(`   Response: ${JSON.stringify(data)}`, colors.reset);
      } else {
        log(`   ❌ ${api.name}: HTTP ${response.status}`, colors.red);
      }
    } catch (error) {
      log(`   ❌ ${api.name}: ${error.message}`, colors.red);
    }
  }
}

async function main() {
  try {
    const success = await testPriceAPI();
    await testAlternativeAPIs();
    
    log('\n' + '=' .repeat(50), colors.blue);
    
    if (success) {
      log('🎉 Price API Test SUCCESSFUL!', colors.bold + colors.green);
      log('\nThe CoinGecko API is working correctly.', colors.green);
    } else {
      log('❌ Price API Test FAILED!', colors.bold + colors.red);
      log('\nPossible issues:', colors.blue);
      log('- Network connectivity problems', colors.reset);
      log('- CoinGecko API rate limiting', colors.reset);
      log('- CORS restrictions in browser', colors.reset);
      log('- Firewall blocking requests', colors.reset);
    }
    
  } catch (error) {
    log(`❌ Test script error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the test
main();
