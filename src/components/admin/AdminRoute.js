import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

/**
 * Admin Route Guard Component
 * Protects admin routes and checks permissions
 */
const AdminRoute = ({ 
  children, 
  requiredPermission = null, 
  requiredRole = 'author',
  fallbackPath = '/login' 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return;

      if (!isAuthenticated || !user) {
        setHasAccess(false);
        setChecking(false);
        return;
      }

      try {
        // Get user with role information
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          setHasAccess(false);
          setChecking(false);
          return;
        }

        const userRole = currentUser.profile?.role || 'user';

        // Check role requirement
        const hasRole = authService.hasRole(userRole, requiredRole);
        if (!hasRole) {
          setHasAccess(false);
          setChecking(false);
          return;
        }

        // Check specific permission if required
        if (requiredPermission) {
          const hasPermission = authService.hasPermission(userRole, requiredPermission);
          setHasAccess(hasPermission);
        } else {
          setHasAccess(true);
        }

        setChecking(false);
      } catch (error) {
        console.error('Error checking admin access:', error);
        setHasAccess(false);
        setChecking(false);
      }
    };

    checkAccess();
  }, [user, isAuthenticated, loading, requiredPermission, requiredRole]);

  // Show loading state
  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Redirect if no access
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render protected content
  return children;
};

/**
 * Permission-based component wrapper
 */
export const PermissionWrapper = ({ 
  permission, 
  role = null, 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (!user) {
          setHasAccess(false);
          setChecking(false);
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          setHasAccess(false);
          setChecking(false);
          return;
        }

        const userRole = currentUser.profile?.role || 'user';

        // Check role if specified
        if (role && !authService.hasRole(userRole, role)) {
          setHasAccess(false);
          setChecking(false);
          return;
        }

        // Check permission
        const hasPermission = authService.hasPermission(userRole, permission);
        setHasAccess(hasPermission);
        setChecking(false);
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasAccess(false);
        setChecking(false);
      }
    };

    checkPermission();
  }, [user, permission, role]);

  if (checking) {
    return <div className="animate-pulse bg-gray-200 h-4 rounded"></div>;
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

/**
 * Role-based component wrapper
 */
export const RoleWrapper = ({ 
  role, 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth();
  const [hasRole, setHasRole] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        if (!user) {
          setHasRole(false);
          setChecking(false);
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          setHasRole(false);
          setChecking(false);
          return;
        }

        const userRole = currentUser.profile?.role || 'user';
        const hasRequiredRole = authService.hasRole(userRole, role);
        setHasRole(hasRequiredRole);
        setChecking(false);
      } catch (error) {
        console.error('Error checking role:', error);
        setHasRole(false);
        setChecking(false);
      }
    };

    checkRole();
  }, [user, role]);

  if (checking) {
    return <div className="animate-pulse bg-gray-200 h-4 rounded"></div>;
  }

  if (!hasRole) {
    return fallback;
  }

  return children;
};

/**
 * Hook for checking permissions
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        if (!user) {
          setPermissions([]);
          setUserRole('user');
          setLoading(false);
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          setPermissions([]);
          setUserRole('user');
          setLoading(false);
          return;
        }

        const role = currentUser.profile?.role || 'user';
        const userPermissions = await authService.getUserPermissions();
        
        setUserRole(role);
        setPermissions(userPermissions);
        setLoading(false);
      } catch (error) {
        console.error('Error loading permissions:', error);
        setPermissions([]);
        setUserRole('user');
        setLoading(false);
      }
    };

    loadPermissions();
  }, [user]);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasRole = (role) => {
    return authService.hasRole(userRole, role);
  };

  const canPerform = async (permission) => {
    return await authService.canPerform(permission);
  };

  return {
    permissions,
    userRole,
    loading,
    hasPermission,
    hasRole,
    canPerform,
    isAdmin: hasRole('editor'),
    isSuperAdmin: hasRole('super_admin')
  };
};

export default AdminRoute;
