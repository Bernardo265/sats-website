import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CMSProvider } from './contexts/CMSContext';
import { AuthProvider } from './contexts/AuthContext';
import { TradingProvider } from './contexts/TradingContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Help from './pages/Help';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
import Compliance from './pages/Compliance';
import BitcoinPrice from './pages/BitcoinPrice';
import StartTrading from './pages/StartTrading';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import Orders from './pages/Orders';
import AdminRoutes from './routes/AdminRoutes';
import Unauthorized from './pages/Unauthorized';

function AppRouter() {
  return (
    <AuthProvider>
      <TradingProvider>
        <CMSProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
              <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
              <Route path="/help" element={<Layout><Help /></Layout>} />

              {/* Blog Routes */}
              <Route path="/blog" element={<Layout><BlogList /></Layout>} />
              <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />

              <Route path="/compliance" element={<Layout><Compliance /></Layout>} />
              <Route path="/bitcoin-price" element={<Layout><BitcoinPrice /></Layout>} />
              <Route path="/start-trading" element={<Layout><StartTrading /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />

              {/* Trading Routes */}
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/trading" element={<Layout><Trading /></Layout>} />
              <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
              <Route path="/orders" element={<Layout><Orders /></Layout>} />

              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />

              {/* Unauthorized Page */}
              <Route path="/unauthorized" element={<Layout><Unauthorized /></Layout>} />
            </Routes>
          </Router>
        </CMSProvider>
      </TradingProvider>
    </AuthProvider>
  );
}

export default AppRouter;
