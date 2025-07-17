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
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminBlogPosts from './pages/admin/AdminBlogPosts';
import AdminBlogPostEdit from './pages/admin/AdminBlogPostEdit';
import AdminCategories from './pages/admin/AdminCategories';
import AdminMediaLibrary from './pages/admin/AdminMediaLibrary';
import AdminAnalytics from './pages/admin/AdminAnalytics';

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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/blog-posts" element={<AdminLayout><AdminBlogPosts /></AdminLayout>} />
          <Route path="/admin/blog-posts/new" element={<AdminLayout><AdminBlogPostEdit /></AdminLayout>} />
          <Route path="/admin/blog-posts/edit/:id" element={<AdminLayout><AdminBlogPostEdit /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
          <Route path="/admin/media" element={<AdminLayout><AdminMediaLibrary /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
        </Routes>
      </Router>
    </CMSProvider>
  );
}

export default AppRouter;
