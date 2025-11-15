import { supabase } from '../lib/supabase';

/**
 * Authentication and Authorization Service
 * Extends the existing auth system with admin roles and permissions
 */
class AuthService {
  constructor() {
    this.userRoles = {
      USER: 'user',
      AUTHOR: 'author',
      EDITOR: 'editor',
      ADMIN: 'admin',
      SUPER_ADMIN: 'super_admin'
    };

    this.permissions = {
      // Content permissions
      CREATE_POST: 'create_post',
      EDIT_OWN_POST: 'edit_own_post',
      EDIT_ANY_POST: 'edit_any_post',
      DELETE_OWN_POST: 'delete_own_post',
      DELETE_ANY_POST: 'delete_any_post',
      PUBLISH_POST: 'publish_post',
      
      // Media permissions
      UPLOAD_MEDIA: 'upload_media',
      DELETE_MEDIA: 'delete_media',
      
      // Comment permissions
      MODERATE_COMMENTS: 'moderate_comments',
      DELETE_COMMENTS: 'delete_comments',
      
      // Category/Tag permissions
      MANAGE_CATEGORIES: 'manage_categories',
      MANAGE_TAGS: 'manage_tags',
      
      // User management
      MANAGE_USERS: 'manage_users',
      ASSIGN_ROLES: 'assign_roles',
      
      // Analytics
      VIEW_ANALYTICS: 'view_analytics',
      
      // System
      MANAGE_SETTINGS: 'manage_settings',

      // Price Management
      MANAGE_PRICES: 'manage_prices',
      OVERRIDE_PRICES: 'override_prices',
      VIEW_PRICE_AUDIT: 'view_price_audit',
      DISABLE_AUTO_UPDATES: 'disable_auto_updates'
    };

    this.rolePermissions = {
      [this.userRoles.USER]: [],
      [this.userRoles.AUTHOR]: [
        this.permissions.CREATE_POST,
        this.permissions.EDIT_OWN_POST,
        this.permissions.DELETE_OWN_POST,
        this.permissions.UPLOAD_MEDIA
      ],
      [this.userRoles.EDITOR]: [
        this.permissions.CREATE_POST,
        this.permissions.EDIT_OWN_POST,
        this.permissions.EDIT_ANY_POST,
        this.permissions.DELETE_OWN_POST,
        this.permissions.PUBLISH_POST,
        this.permissions.UPLOAD_MEDIA,
        this.permissions.DELETE_MEDIA,
        this.permissions.MODERATE_COMMENTS,
        this.permissions.MANAGE_CATEGORIES,
        this.permissions.MANAGE_TAGS,
        this.permissions.VIEW_ANALYTICS
      ],
      [this.userRoles.ADMIN]: [
        this.permissions.CREATE_POST,
        this.permissions.EDIT_OWN_POST,
        this.permissions.EDIT_ANY_POST,
        this.permissions.DELETE_OWN_POST,
        this.permissions.DELETE_ANY_POST,
        this.permissions.PUBLISH_POST,
        this.permissions.UPLOAD_MEDIA,
        this.permissions.DELETE_MEDIA,
        this.permissions.MODERATE_COMMENTS,
        this.permissions.DELETE_COMMENTS,
        this.permissions.MANAGE_CATEGORIES,
        this.permissions.MANAGE_TAGS,
        this.permissions.MANAGE_USERS,
        this.permissions.VIEW_ANALYTICS,
        this.permissions.MANAGE_SETTINGS,
        this.permissions.MANAGE_PRICES,
        this.permissions.OVERRIDE_PRICES,
        this.permissions.VIEW_PRICE_AUDIT,
        this.permissions.DISABLE_AUTO_UPDATES
      ],
      [this.userRoles.SUPER_ADMIN]: Object.values(this.permissions)
    };
  }

  /**
   * Get current user with role information
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (!user) return null;

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      return {
        ...user,
        profile: profile || { role: this.userRoles.USER }
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Check if user has a specific role
   */
  hasRole(userRole, requiredRole) {
    const roleHierarchy = [
      this.userRoles.USER,
      this.userRoles.AUTHOR,
      this.userRoles.EDITOR,
      this.userRoles.ADMIN,
      this.userRoles.SUPER_ADMIN
    ];

    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(userRole, permission) {
    const permissions = this.rolePermissions[userRole] || [];
    return permissions.includes(permission);
  }

  /**
   * Check if current user can perform an action
   */
  async canPerform(permission) {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;

      const userRole = user.profile?.role || this.userRoles.USER;
      return this.hasPermission(userRole, permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Check if current user is admin
   */
  async isAdmin() {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;

      const userRole = user.profile?.role || this.userRoles.USER;
      return this.hasRole(userRole, this.userRoles.EDITOR);
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId, newRole) {
    try {
      // Check if current user can assign roles
      const canAssign = await this.canPerform(this.permissions.ASSIGN_ROLES);
      if (!canAssign) {
        throw new Error('Insufficient permissions to assign roles');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Get all users with their roles (admin only)
   */
  async getUsers(page = 1, limit = 50) {
    try {
      const canManage = await this.canPerform(this.permissions.MANAGE_USERS);
      if (!canManage) {
        throw new Error('Insufficient permissions to view users');
      }

      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        users: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Create admin route guard
   */
  createAdminGuard(requiredPermission = null) {
    return async () => {
      try {
        const user = await this.getCurrentUser();
        if (!user) return false;

        const userRole = user.profile?.role || this.userRoles.USER;
        
        // Check if user has admin role
        if (!this.hasRole(userRole, this.userRoles.AUTHOR)) {
          return false;
        }

        // Check specific permission if provided
        if (requiredPermission) {
          return this.hasPermission(userRole, requiredPermission);
        }

        return true;
      } catch (error) {
        console.error('Error in admin guard:', error);
        return false;
      }
    };
  }

  /**
   * Create role-based component wrapper
   */
  createRoleWrapper(requiredRole, fallbackComponent = null) {
    return async (component) => {
      try {
        const user = await this.getCurrentUser();
        if (!user) return fallbackComponent;

        const userRole = user.profile?.role || this.userRoles.USER;
        
        if (this.hasRole(userRole, requiredRole)) {
          return component;
        }

        return fallbackComponent;
      } catch (error) {
        console.error('Error in role wrapper:', error);
        return fallbackComponent;
      }
    };
  }

  /**
   * Get user permissions
   */
  async getUserPermissions() {
    try {
      const user = await this.getCurrentUser();
      if (!user) return [];

      const userRole = user.profile?.role || this.userRoles.USER;
      return this.rolePermissions[userRole] || [];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  /**
   * Check if user can edit specific post
   */
  async canEditPost(postAuthorId) {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;

      const userRole = user.profile?.role || this.userRoles.USER;
      
      // Can edit if it's their own post and they have edit_own_post permission
      if (user.id === postAuthorId && this.hasPermission(userRole, this.permissions.EDIT_OWN_POST)) {
        return true;
      }

      // Can edit if they have edit_any_post permission
      return this.hasPermission(userRole, this.permissions.EDIT_ANY_POST);
    } catch (error) {
      console.error('Error checking post edit permission:', error);
      return false;
    }
  }

  /**
   * Check if user can delete specific post
   */
  async canDeletePost(postAuthorId) {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;

      const userRole = user.profile?.role || this.userRoles.USER;
      
      // Can delete if it's their own post and they have delete_own_post permission
      if (user.id === postAuthorId && this.hasPermission(userRole, this.permissions.DELETE_OWN_POST)) {
        return true;
      }

      // Can delete if they have delete_any_post permission
      return this.hasPermission(userRole, this.permissions.DELETE_ANY_POST);
    } catch (error) {
      console.error('Error checking post delete permission:', error);
      return false;
    }
  }

  /**
   * Get role hierarchy for display
   */
  getRoleHierarchy() {
    return [
      { value: this.userRoles.USER, label: 'User', description: 'Basic user access' },
      { value: this.userRoles.AUTHOR, label: 'Author', description: 'Can create and edit own posts' },
      { value: this.userRoles.EDITOR, label: 'Editor', description: 'Can edit any post and moderate content' },
      { value: this.userRoles.ADMIN, label: 'Admin', description: 'Full content and user management access' },
      { value: this.userRoles.SUPER_ADMIN, label: 'Super Admin', description: 'Complete system access' }
    ];
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
