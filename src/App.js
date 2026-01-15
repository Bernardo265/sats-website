import React, { useEffect } from 'react';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import './App.css';
import './styles/transitions.css';
import AppRouter from './AppRouter';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';

// Import test utilities in development
if (process.env.NODE_ENV === 'development') {
  import('./utils/testLogin');
}

function App() {
  useEffect(() => {
    // Admin-only platform - no trading services needed
    console.log('🔄 SafeSats admin platform loaded');
    console.log('ℹ️ Trading services disabled - admin-only platform');
    
    // Set environment flag to disable trading services
    window.DISABLE_TRADING_SERVICES = true;
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
