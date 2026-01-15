import { supabase } from '../lib/supabase';

/**
 * Test login function for development/debugging
 * This function can be called from the browser console or used in development
 */
export const testLogin = async (email = 'kennedyphiri2018@gmail.com', password = '123456789Beat') => {
  try {
    console.log('🔄 Attempting login with:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('Error details:', error);
      return { success: false, error: error.message };
    } else {
      console.log('✅ Login successful:', data.user);
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      console.log('Email verified:', data.user.email_confirmed_at !== null);
      
      // Check if user has a profile
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('⚠️ Profile fetch error:', profileError.message);
        } else if (profile) {
          console.log('👤 User profile:', profile);
          console.log('Role:', profile.role || 'No role set');
        } else {
          console.log('📝 No profile found - will be created automatically');
        }
      } catch (profileError) {
        console.warn('⚠️ Error checking profile:', profileError.message);
      }

      return { success: true, user: data.user };
    }
  } catch (error) {
    console.error('❌ Unexpected error during login:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test admin access for the logged-in user
 */
export const testAdminAccess = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('❌ No authenticated user found');
      return false;
    }

    console.log('🔍 Checking admin access for user:', user.email);

    // Check user profile and role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ Error fetching profile:', profileError.message);
      return false;
    }

    console.log('👤 User profile:', profile);
    console.log('Current role:', profile?.role || 'No role set');

    const adminRoles = ['author', 'editor', 'admin', 'super_admin'];
    const hasAdminAccess = adminRoles.includes(profile?.role);

    if (hasAdminAccess) {
      console.log('✅ User has admin access with role:', profile.role);
    } else {
      console.log('❌ User does not have admin access');
      console.log('💡 To grant admin access, run this SQL in Supabase:');
      console.log(`UPDATE profiles SET role = 'super_admin' WHERE id = '${user.id}';`);
    }

    return hasAdminAccess;
  } catch (error) {
    console.error('❌ Error checking admin access:', error);
    return false;
  }
};

/**
 * Create or update user profile with admin role
 */
export const makeUserAdmin = async (userId = null, role = 'super_admin') => {
  try {
    let targetUserId = userId;
    
    if (!targetUserId) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('❌ No authenticated user found');
        return false;
      }
      targetUserId = user.id;
    }

    console.log('🔄 Making user admin:', targetUserId);

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: targetUserId,
        role: role,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating profile:', error.message);
      return false;
    }

    console.log('✅ User profile updated:', data);
    console.log('New role:', data.role);
    return true;
  } catch (error) {
    console.error('❌ Error making user admin:', error);
    return false;
  }
};

/**
 * Quick setup function to login and make user admin
 */
export const quickAdminSetup = async (email = 'kennedyphiri2018@gmail.com', password = '123456789Beat') => {
  console.log('🚀 Starting quick admin setup...');
  
  // Step 1: Login
  const loginResult = await testLogin(email, password);
  if (!loginResult.success) {
    console.error('❌ Login failed, cannot proceed with admin setup');
    return false;
  }

  // Step 2: Make user admin
  const adminResult = await makeUserAdmin(loginResult.user.id);
  if (!adminResult) {
    console.error('❌ Failed to grant admin access');
    return false;
  }

  // Step 3: Test admin access
  const hasAccess = await testAdminAccess();
  
  if (hasAccess) {
    console.log('🎉 Quick admin setup complete!');
    console.log('You can now access the admin panel at /admin');
    return true;
  } else {
    console.error('❌ Admin setup failed');
    return false;
  }
};

// Export for browser console access in development
if (process.env.NODE_ENV === 'development') {
  window.testLogin = testLogin;
  window.testAdminAccess = testAdminAccess;
  window.makeUserAdmin = makeUserAdmin;
  window.quickAdminSetup = quickAdminSetup;
  
  console.log('🔧 Development utilities loaded:');
  console.log('- testLogin() - Test login with default credentials');
  console.log('- testAdminAccess() - Check if current user has admin access');
  console.log('- makeUserAdmin() - Grant admin role to current user');
  console.log('- quickAdminSetup() - Complete setup: login + make admin');
}