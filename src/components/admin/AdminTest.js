import React, { useState } from 'react';
import { testLogin, testAdminAccess, makeUserAdmin, quickAdminSetup } from '../../utils/testLogin';

const AdminTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const addResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { message, type, timestamp }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const handleTestLogin = async () => {
    setLoading(true);
    addResult('Testing login...', 'info');
    
    try {
      const result = await testLogin();
      if (result.success) {
        addResult('✅ Login successful!', 'success');
        addResult(`User: ${result.user.email}`, 'info');
      } else {
        addResult(`❌ Login failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const handleTestAdminAccess = async () => {
    setLoading(true);
    addResult('Checking admin access...', 'info');
    
    try {
      const hasAccess = await testAdminAccess();
      if (hasAccess) {
        addResult('✅ User has admin access!', 'success');
      } else {
        addResult('❌ User does not have admin access', 'error');
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const handleMakeAdmin = async () => {
    setLoading(true);
    addResult('Granting admin access...', 'info');
    
    try {
      const success = await makeUserAdmin();
      if (success) {
        addResult('✅ Admin access granted!', 'success');
      } else {
        addResult('❌ Failed to grant admin access', 'error');
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const handleQuickSetup = async () => {
    setLoading(true);
    addResult('Starting quick admin setup...', 'info');
    
    try {
      const success = await quickAdminSetup();
      if (success) {
        addResult('🎉 Quick setup complete! You can now access /admin', 'success');
      } else {
        addResult('❌ Quick setup failed', 'error');
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin System Test</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Test Login
          </button>
          
          <button
            onClick={handleTestAdminAccess}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Check Admin Access
          </button>
          
          <button
            onClick={handleMakeAdmin}
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            Grant Admin Access
          </button>
          
          <button
            onClick={handleQuickSetup}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Quick Setup (All-in-One)
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Test Results</h3>
          <button
            onClick={clearResults}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Results
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 min-h-32 max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Processing...</span>
            </div>
          )}
          
          {results.length === 0 && !loading && (
            <p className="text-gray-500 text-center">Click a button above to run tests</p>
          )}
          
          {results.map((result, index) => (
            <div key={index} className="mb-2 font-mono text-sm">
              <span className="text-gray-400">[{result.timestamp}]</span>
              <span className={`ml-2 ${getResultColor(result.type)}`}>
                {result.message}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. <strong>Test Login</strong> - Verify the credentials work</li>
            <li>2. <strong>Check Admin Access</strong> - See if user has admin role</li>
            <li>3. <strong>Grant Admin Access</strong> - Give the user admin permissions</li>
            <li>4. <strong>Quick Setup</strong> - Do all steps at once</li>
          </ol>
          <p className="text-sm text-blue-700 mt-2">
            After successful setup, navigate to <code className="bg-blue-100 px-1 rounded">/admin</code> to access the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;