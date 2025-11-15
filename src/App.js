import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/transitions.css';
import AppRouter from './AppRouter';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  useEffect(() => {
    // Initialize services on app startup with enhanced error handling
    const initializeServices = async () => {
      try {
        console.log('🔄 Initializing SafeSats services...');

        const config = {
          enablePriceService: process.env.REACT_APP_ENABLE_TRADING_SIMULATOR !== 'false',
          enableRealtime: process.env.REACT_APP_REALTIME_ENABLED !== 'false',
          priceUpdateInterval: parseInt(process.env.REACT_APP_PRICE_UPDATE_INTERVAL) || 30000,
          tradingConfig: {
            tradingFee: parseFloat(process.env.REACT_APP_DEFAULT_TRADING_FEE) || 0.001,
            minTradeAmount: parseInt(process.env.REACT_APP_MIN_TRADE_AMOUNT) || 1000,
            maxTradeAmount: parseInt(process.env.REACT_APP_MAX_TRADE_AMOUNT) || 1000000
          },
          mwkUsdRate: parseFloat(process.env.REACT_APP_MWK_USD_RATE) || 1730
        };

        const result = await serviceManager.initialize(config);

        if (result.success) {
          console.log('✅ Services initialized successfully');
        } else {
          console.warn('⚠️ Services initialized with warnings');
        }

        if (process.env.REACT_APP_DEBUG_MODE === 'true') {
          console.log('🔍 Service Manager Debug Info:', serviceManager.getDebugInfo());
        }
      } catch (error) {
        console.error('❌ Failed to initialize services:', error.message);
        console.warn('⚠️ App will continue with limited functionality');

        // Don't prevent app from loading - just log the error
        if (process.env.REACT_APP_DEBUG_MODE === 'true') {
          console.error('Full error details:', error);
        }
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      serviceManager.shutdown();
    };
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
