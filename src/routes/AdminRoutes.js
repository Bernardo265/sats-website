import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from '../components/admin/AdminRoute';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import PostsList from '../components/admin/PostsList';
import PostEditor from '../components/admin/PostEditor';
import MediaLibrary from '../components/admin/MediaLibrary';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import PriceManagement from '../components/admin/PriceManagement';
import authService from '../services/authService';

// Lazy load components for better performance
const CategoriesManager = React.lazy(() => import('../components/admin/CategoriesManager'));
const TagsManager = React.lazy(() => import('../components/admin/TagsManager'));
const CommentsManager = React.lazy(() => import('../components/admin/CommentsManager'));
const UsersManager = React.lazy(() => import('../components/admin/UsersManager'));
const SettingsManager = React.lazy(() => import('../components/admin/SettingsManager'));

const AdminRoutes = () => {
  return (
    <AdminRoute requiredRole="author">
      <AdminLayout>
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        }>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<AdminDashboard />} />
            
            {/* Posts Management */}
            <Route 
              path="/posts" 
              element={
                <AdminRoute requiredPermission={authService.permissions.CREATE_POST}>
                  <PostsList />
                </AdminRoute>
              } 
            />
            <Route 
              path="/posts/new" 
              element={
                <AdminRoute requiredPermission={authService.permissions.CREATE_POST}>
                  <PostEditor />
                </AdminRoute>
              } 
            />
            <Route 
              path="/posts/:id" 
              element={
                <AdminRoute requiredPermission={authService.permissions.EDIT_OWN_POST}>
                  <PostEditor />
                </AdminRoute>
              } 
            />
            
            {/* Categories Management */}
            <Route 
              path="/categories" 
              element={
                <AdminRoute requiredPermission={authService.permissions.MANAGE_CATEGORIES}>
                  <CategoriesManager />
                </AdminRoute>
              } 
            />
            
            {/* Tags Management */}
            <Route 
              path="/tags" 
              element={
                <AdminRoute requiredPermission={authService.permissions.MANAGE_TAGS}>
                  <TagsManager />
                </AdminRoute>
              } 
            />
            
            {/* Comments Management */}
            <Route 
              path="/comments" 
              element={
                <AdminRoute requiredPermission={authService.permissions.MODERATE_COMMENTS}>
                  <CommentsManager />
                </AdminRoute>
              } 
            />
            
            {/* Media Library */}
            <Route 
              path="/media" 
              element={
                <AdminRoute requiredPermission={authService.permissions.UPLOAD_MEDIA}>
                  <MediaLibrary />
                </AdminRoute>
              } 
            />
            
            {/* Users Management */}
            <Route 
              path="/users" 
              element={
                <AdminRoute requiredPermission={authService.permissions.MANAGE_USERS}>
                  <UsersManager />
                </AdminRoute>
              } 
            />
            
            {/* Analytics */}
            <Route 
              path="/analytics" 
              element={
                <AdminRoute requiredPermission={authService.permissions.VIEW_ANALYTICS}>
                  <AnalyticsDashboard />
                </AdminRoute>
              } 
            />
            
            {/* Settings */}
            <Route
              path="/settings"
              element={
                <AdminRoute requiredPermission={authService.permissions.MANAGE_SETTINGS}>
                  <SettingsManager />
                </AdminRoute>
              }
            />

            {/* Price Management */}
            <Route
              path="/price-management"
              element={
                <AdminRoute requiredPermission="manage_prices">
                  <PriceManagement />
                </AdminRoute>
              }
            />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </React.Suspense>
      </AdminLayout>
    </AdminRoute>
  );
};

export default AdminRoutes;
