import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/transitions.css';
import AppRouter from './AppRouter';

function App() {
  return (
    <HelmetProvider>
      <AppRouter />
    </HelmetProvider>
  );
}

export default App;
