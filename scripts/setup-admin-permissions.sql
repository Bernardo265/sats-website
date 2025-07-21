-- Setup Admin Permissions for Price Management Testing
-- Run this script to grant price management permissions to test users

-- First, let's create a test admin user permissions entry
-- Replace 'your-user-id-here' with the actual user ID from auth.users

-- Example: Grant price management permissions to a user
-- INSERT INTO public.admin_permissions (
--   user_id,
--   role,
--   can_manage_prices,
--   can_override_prices,
--   can_disable_auto_updates,
--   can_view_price_audit,
--   permissions,
--   granted_by,
--   is_active
-- ) VALUES (
--   'your-user-id-here',  -- Replace with actual user ID
--   'admin',
--   true,
--   true,
--   true,
--   true,
--   '["manage_prices", "override_prices", "view_price_audit", "disable_auto_updates"]'::jsonb,
--   'your-user-id-here',  -- Replace with actual user ID (self-granted for testing)
--   true
-- );

-- Update existing user profile to admin role
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE id = 'your-user-id-here';  -- Replace with actual user ID

-- Check current users and their roles
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  ap.can_manage_prices,
  ap.can_override_prices,
  ap.can_disable_auto_updates,
  ap.can_view_price_audit,
  ap.is_active as admin_permissions_active
FROM public.profiles p
LEFT JOIN public.admin_permissions ap ON p.id = ap.user_id
WHERE p.role IN ('admin', 'super_admin', 'editor')
ORDER BY p.created_at DESC;

-- Example of how to grant permissions to the first admin user found:
-- WITH first_admin AS (
--   SELECT id FROM public.profiles 
--   WHERE role IN ('admin', 'super_admin') 
--   ORDER BY created_at ASC 
--   LIMIT 1
-- )
-- INSERT INTO public.admin_permissions (
--   user_id,
--   role,
--   can_manage_prices,
--   can_override_prices,
--   can_disable_auto_updates,
--   can_view_price_audit,
--   permissions,
--   granted_by,
--   is_active
-- )
-- SELECT 
--   fa.id,
--   'admin',
--   true,
--   true,
--   true,
--   true,
--   '["manage_prices", "override_prices", "view_price_audit", "disable_auto_updates"]'::jsonb,
--   fa.id,
--   true
-- FROM first_admin fa
-- WHERE NOT EXISTS (
--   SELECT 1 FROM public.admin_permissions 
--   WHERE user_id = fa.id
-- );

-- Grant permissions to all existing admin users
INSERT INTO public.admin_permissions (
  user_id,
  role,
  can_manage_prices,
  can_override_prices,
  can_disable_auto_updates,
  can_view_price_audit,
  permissions,
  granted_by,
  is_active
)
SELECT 
  p.id,
  p.role,
  true,
  true,
  true,
  true,
  '["manage_prices", "override_prices", "view_price_audit", "disable_auto_updates"]'::jsonb,
  p.id,
  true
FROM public.profiles p
WHERE p.role IN ('admin', 'super_admin')
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_permissions ap 
    WHERE ap.user_id = p.id
  );

-- Verify the setup
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  ap.can_manage_prices,
  ap.can_override_prices,
  ap.can_disable_auto_updates,
  ap.can_view_price_audit,
  ap.is_active as admin_permissions_active,
  ap.created_at as permissions_granted_at
FROM public.profiles p
LEFT JOIN public.admin_permissions ap ON p.id = ap.user_id
WHERE p.role IN ('admin', 'super_admin', 'editor')
ORDER BY p.created_at DESC;
