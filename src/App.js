import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/transitions.css';
import AppRouter from './AppRouter';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
