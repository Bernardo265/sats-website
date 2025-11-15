import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseHelpers } from '../lib/supabase';
import { enhancedRegister, getUserFriendlyError, runSystemCheck } from '../utils/authHelpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
        } else if (session?.user) {
          await handleUserSession(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await handleUserSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        await handleUserSession(session.user);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Handle user session and fetch profile
  const handleUserSession = async (authUser) => {
    try {
      const profile = await supabaseHelpers.getUserProfile(authUser.id);

      const userData = {
        id: authUser.id,
        email: authUser.email,
        fullName: profile?.full_name || authUser.user_metadata?.full_name || '',
        phone: profile?.phone || authUser.user_metadata?.phone || '',
        emailVerified: authUser.email_confirmed_at !== null,
        accountStatus: profile?.account_status || 'pending_verification',
        createdAt: authUser.created_at,
        updatedAt: profile?.updated_at || authUser.updated_at
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Still set basic user data even if profile fetch fails
      setUser({
        id: authUser.id,
        email: authUser.email,
        emailVerified: authUser.email_confirmed_at !== null,
        accountStatus: 'pending_verification'
      });
      setIsAuthenticated(true);
    }
  };

  // Register new user with enhanced error handling
  const register = async (userData) => {
    try {
      setLoading(true);

      console.log('🔄 Starting enhanced registration process...', userData.email);

      // Run system check if debug mode is enabled
      if (process.env.REACT_APP_DEBUG_MODE === 'true') {
        const systemCheck = await runSystemCheck();
        console.log('🔍 System check completed:', systemCheck);
      }

      // Use enhanced registration function
      const result = await enhancedRegister(userData);

      if (result.success && result.user) {
        console.log('✅ Enhanced registration successful:', result.user.id);

        // Update profile with additional data
        try {
          console.log('🔄 Creating user profile...');
          await supabaseHelpers.upsertUserProfile({
            id: result.user.id,
            full_name: userData.fullName,
            phone: userData.phone,
            email_verified: false,
            account_status: 'pending_verification'
          });
          console.log('✅ User profile created successfully');
        } catch (profileError) {
          console.error('⚠️ Error creating profile (continuing anyway):', profileError);
          // Continue even if profile creation fails
        }

        console.log('🎉 Registration completed successfully');

        return {
          success: true,
          user: result.user,
          message: 'Registration successful! Please check your email to verify your account.'
        };
      }

      return { success: false, error: 'Registration failed - no user data received' };
    } catch (error) {
      console.error('❌ Enhanced registration error:', error);

      return {
        success: false,
        error: getUserFriendlyError(error)
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // User session will be handled by the auth state change listener
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      // User state will be cleared by the auth state change listener
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    try {
      if (!user?.email) {
        throw new Error('No user email found');
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) {
        throw error;
      }

      return { success: true, message: 'Verification email sent successfully!' };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: error.message || 'Failed to resend verification email'
      };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);

      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      // Update profile in database
      const updatedProfile = await supabaseHelpers.upsertUserProfile({
        id: user.id,
        ...updates
      });

      // Update local user state
      const updatedUser = {
        ...user,
        fullName: updatedProfile.full_name || user.fullName,
        phone: updatedProfile.phone || user.phone,
        accountStatus: updatedProfile.account_status || user.accountStatus,
        updatedAt: updatedProfile.updated_at
      };

      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Password reset email sent! Check your inbox.'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send password reset email'
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    resendVerificationEmail,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


