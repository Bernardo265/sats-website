import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CMSProvider } from './contexts/CMSContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Help from './pages/Help';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import BitcoinPrice from './pages/BitcoinPrice';
import Compliance from './pages/Compliance';
import Unauthorized from './pages/Unauthorized';

// New Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import BlogManagement from './components/admin/BlogManagement';
import BlogEditor from './components/admin/BlogEditor';
import SubscriberManagement from './components/admin/SubscriberManagement';
import UserManagement from './components/admin/UserManagement';
import UnsubscribePage from './components/subscription/UnsubscribePage';
import AdminTest from './components/admin/AdminTest';

function AppRouter() {
  return (
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
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
            <Route path="/bitcoin-price" element={<Layout><BitcoinPrice /></Layout>} />
            <Route path="/compliance" element={<Layout><Compliance /></Layout>} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Admin Login */}
            <Route path="/login" element={<Login />} />

            {/* Subscription Routes */}
            <Route path="/unsubscribe" element={<UnsubscribePage />} />

            {/* Admin Test Route (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <Route path="/admin-test" element={<Layout><AdminTest /></Layout>} />
            )}

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="blog/new" element={<BlogEditor />} />
              <Route path="blog/edit/:id" element={<BlogEditor />} />
              <Route path="subscribers" element={<SubscriberManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Routes>
        </Router>
    </CMSProvider>
  );
}

export default AppRouter;
