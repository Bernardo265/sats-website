import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Registration Debug Component
 * Helps debug registration issues in the browser environment
 */
const RegistrationDebug = () => {
  const [debugResults, setDebugResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message, details = null) => {
    setDebugResults(prev => [...prev, {
      test,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runDebugTests = async () => {
    setIsRunning(true);
    setDebugResults([]);

    // Test 1: Environment Variables
    addResult(
      'Environment Variables',
      process.env.REACT_APP_SUPABASE_URL ? 'PASS' : 'FAIL',
      process.env.REACT_APP_SUPABASE_URL ? 'Supabase URL configured' : 'Supabase URL missing',
      {
        url: process.env.REACT_APP_SUPABASE_URL,
        hasKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY
      }
    );

    // Test 2: Supabase Client
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      addResult(
        'Supabase Connection',
        error ? 'FAIL' : 'PASS',
        error ? `Connection failed: ${error.message}` : 'Connection successful',
        { error, data }
      );
    } catch (err) {
      addResult(
        'Supabase Connection',
        'FAIL',
        `Connection error: ${err.message}`,
        { error: err }
      );
    }

    // Test 3: Auth Endpoint
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
        options: {
          data: {
            full_name: 'Test User',
            phone: '+265123456789'
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered') || error.status === 422) {
          addResult(
            'Auth Endpoint',
            'PASS',
            'Auth endpoint reachable (expected error)',
            { error }
          );
        } else {
          addResult(
            'Auth Endpoint',
            'WARN',
            `Auth endpoint warning: ${error.message}`,
            { error }
          );
        }
      } else {
        addResult(
          'Auth Endpoint',
          'PASS',
          'Auth endpoint working',
          { data }
        );
      }
    } catch (err) {
      addResult(
        'Auth Endpoint',
        'FAIL',
        `Auth endpoint failed: ${err.message}`,
        { error: err }
      );
    }

    // Test 4: Network Connectivity
    try {
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/profiles?select=count&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      addResult(
        'Network/CORS',
        response.ok ? 'PASS' : 'WARN',
        response.ok ? 'Direct HTTP request successful' : `HTTP ${response.status}`,
        { status: response.status, statusText: response.statusText }
      );
    } catch (err) {
      addResult(
        'Network/CORS',
        'FAIL',
        `Network request failed: ${err.message}`,
        { error: err }
      );
    }

    // Test 5: Price API Test
    try {
      const priceApiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true';
      const priceResponse = await fetch(priceApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SafeSats-Website/1.0'
        }
      });

      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        addResult(
          'Price API (CoinGecko)',
          'PASS',
          `Bitcoin price fetched: $${priceData.bitcoin?.usd || 'N/A'}`,
          { priceData }
        );
      } else {
        addResult(
          'Price API (CoinGecko)',
          'FAIL',
          `HTTP ${priceResponse.status}: ${priceResponse.statusText}`,
          { status: priceResponse.status }
        );
      }
    } catch (priceError) {
      addResult(
        'Price API (CoinGecko)',
        'FAIL',
        `Price API failed: ${priceError.message}`,
        { error: priceError }
      );
    }

    // Test 6: Browser Environment
    addResult(
      'Browser Environment',
      'INFO',
      'Browser environment details',
      {
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        localStorage: typeof localStorage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        location: window.location.href
      }
    );

    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return 'text-green-400';
      case 'FAIL': return 'text-red-400';
      case 'WARN': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS': return '✅';
      case 'FAIL': return '❌';
      case 'WARN': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Registration Debug</h3>
        <button
          onClick={runDebugTests}
          disabled={isRunning}
          className="px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? 'Running...' : 'Run Debug Tests'}
        </button>
      </div>

      {debugResults.length > 0 && (
        <div className="space-y-4">
          {debugResults.map((result, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span>{getStatusIcon(result.status)}</span>
                  <span className="text-white font-medium">{result.test}</span>
                  <span className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>
                <span className="text-white/50 text-sm">{result.timestamp}</span>
              </div>
              
              <p className="text-white/80 text-sm mb-2">{result.message}</p>
              
              {result.details && (
                <details className="text-white/60 text-xs">
                  <summary className="cursor-pointer hover:text-white/80">Details</summary>
                  <pre className="mt-2 p-2 bg-black/30 rounded overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      {debugResults.length === 0 && !isRunning && (
        <div className="text-center text-white/60 py-8">
          Click "Run Debug Tests" to diagnose registration issues
        </div>
      )}
    </div>
  );
};

export default RegistrationDebug;
