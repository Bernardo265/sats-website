-- Complete Admin Database Setup for SafeSats Platform
-- This script creates all missing admin tables, functions, and views

-- =====================================================
-- 1. BLOG MANAGEMENT TABLES
-- =====================================================

-- Blog categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  meta_title TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog post tags junction table
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. MEDIA LIBRARY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio', 'document', 'other')),
  width INTEGER,
  height INTEGER,
  duration DECIMAL(10,2),
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ADMIN PRICE MANAGEMENT TABLES
-- =====================================================

-- Admin price overrides table
CREATE TABLE IF NOT EXISTS public.admin_price_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  symbol TEXT NOT NULL DEFAULT 'BTC',
  price_usd DECIMAL(15,2) NOT NULL CHECK (price_usd > 0),
  price_mwk DECIMAL(15,2) NOT NULL CHECK (price_mwk > 0),
  usd_mwk_rate DECIMAL(10,4) NOT NULL CHECK (usd_mwk_rate > 0),
  reason TEXT NOT NULL,
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  disable_auto_updates BOOLEAN DEFAULT FALSE,
  previous_price_usd DECIMAL(15,2),
  previous_price_mwk DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deactivated_at TIMESTAMP WITH TIME ZONE,
  deactivated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Admin price audit log table
CREATE TABLE IF NOT EXISTS public.admin_price_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create_override', 'update_override', 'deactivate_override', 'enable_auto_updates', 'disable_auto_updates')),
  override_id UUID REFERENCES public.admin_price_overrides(id) ON DELETE SET NULL,
  symbol TEXT NOT NULL DEFAULT 'BTC',
  old_price_usd DECIMAL(15,2),
  new_price_usd DECIMAL(15,2),
  old_price_mwk DECIMAL(15,2),
  new_price_mwk DECIMAL(15,2),
  reason TEXT,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin', 'super_admin')),
  permissions JSONB DEFAULT '[]'::jsonb,
  can_manage_prices BOOLEAN DEFAULT FALSE,
  can_override_prices BOOLEAN DEFAULT FALSE,
  can_disable_auto_updates BOOLEAN DEFAULT FALSE,
  can_view_price_audit BOOLEAN DEFAULT FALSE,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

-- Blog indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(is_featured, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON public.blog_comments(status);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_library_type ON public.media_library(media_type);
CREATE INDEX IF NOT EXISTS idx_media_library_uploader ON public.media_library(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_library_created ON public.media_library(created_at DESC);

-- Admin price management indexes
CREATE INDEX IF NOT EXISTS idx_admin_price_overrides_active ON public.admin_price_overrides(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_price_overrides_symbol ON public.admin_price_overrides(symbol, is_active);
CREATE INDEX IF NOT EXISTS idx_admin_price_overrides_admin_user ON public.admin_price_overrides(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_price_overrides_created_at ON public.admin_price_overrides(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_price_audit_log_admin_user ON public.admin_price_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_price_audit_log_action ON public.admin_price_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_price_audit_log_created_at ON public.admin_price_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_price_audit_log_override_id ON public.admin_price_audit_log(override_id);

CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON public.admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_role ON public.admin_permissions(role);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_active ON public.admin_permissions(is_active);

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all admin tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_price_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_price_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Blog policies (public read, admin write)
CREATE POLICY "Public can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can view all blog posts" ON public.blog_posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authors can manage their own posts" ON public.blog_posts
  FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'editor')
    )
  );

-- Media library policies
CREATE POLICY "Public can view public media" ON public.media_library
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own media" ON public.media_library
  FOR ALL USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all media" ON public.media_library
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'editor')
    )
  );

-- Admin price management policies
CREATE POLICY "Only admins can access price overrides" ON public.admin_price_overrides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions 
      WHERE user_id = auth.uid() 
      AND can_manage_prices = true 
      AND is_active = true
    )
  );

CREATE POLICY "Only admins can access price audit log" ON public.admin_price_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions 
      WHERE user_id = auth.uid() 
      AND can_view_price_audit = true 
      AND is_active = true
    )
  );

CREATE POLICY "Only admins can view admin permissions" ON public.admin_permissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_post_tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_comments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.admin_price_overrides TO authenticated;
GRANT SELECT, INSERT ON public.admin_price_audit_log TO authenticated;
GRANT SELECT ON public.admin_permissions TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- 7. DATABASE FUNCTIONS
-- =====================================================

-- Function to get active price override
CREATE OR REPLACE FUNCTION public.get_active_price_override(p_symbol TEXT DEFAULT 'BTC')
RETURNS TABLE(
  id UUID,
  price_usd DECIMAL(15,2),
  price_mwk DECIMAL(15,2),
  usd_mwk_rate DECIMAL(10,4),
  reason TEXT,
  admin_user_id UUID,
  admin_name TEXT,
  disable_auto_updates BOOLEAN,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    apo.id,
    apo.price_usd,
    apo.price_mwk,
    apo.usd_mwk_rate,
    apo.reason,
    apo.admin_user_id,
    p.full_name as admin_name,
    apo.disable_auto_updates,
    apo.expires_at,
    apo.created_at
  FROM public.admin_price_overrides apo
  LEFT JOIN public.profiles p ON apo.admin_user_id = p.id
  WHERE apo.symbol = p_symbol
    AND apo.is_active = TRUE
    AND (apo.expires_at IS NULL OR apo.expires_at > NOW())
  ORDER BY apo.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create price override
CREATE OR REPLACE FUNCTION public.create_price_override(
  p_admin_user_id UUID,
  p_symbol TEXT,
  p_price_usd DECIMAL(15,2),
  p_price_mwk DECIMAL(15,2),
  p_usd_mwk_rate DECIMAL(10,4),
  p_reason TEXT,
  p_duration_minutes INTEGER DEFAULT NULL,
  p_disable_auto_updates BOOLEAN DEFAULT FALSE,
  p_previous_price_usd DECIMAL(15,2) DEFAULT NULL,
  p_previous_price_mwk DECIMAL(15,2) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  override_id UUID;
  expires_at_val TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate expiration time if duration is provided
  IF p_duration_minutes IS NOT NULL THEN
    expires_at_val := NOW() + (p_duration_minutes || ' minutes')::INTERVAL;
  END IF;

  -- Deactivate any existing active overrides for this symbol
  UPDATE public.admin_price_overrides
  SET is_active = FALSE,
      deactivated_at = NOW(),
      deactivated_by = p_admin_user_id
  WHERE symbol = p_symbol AND is_active = TRUE;

  -- Create new override
  INSERT INTO public.admin_price_overrides (
    admin_user_id, symbol, price_usd, price_mwk, usd_mwk_rate, reason,
    duration_minutes, expires_at, disable_auto_updates,
    previous_price_usd, previous_price_mwk
  ) VALUES (
    p_admin_user_id, p_symbol, p_price_usd, p_price_mwk, p_usd_mwk_rate, p_reason,
    p_duration_minutes, expires_at_val, p_disable_auto_updates,
    p_previous_price_usd, p_previous_price_mwk
  ) RETURNING id INTO override_id;

  -- Log the action
  INSERT INTO public.admin_price_audit_log (
    admin_user_id, action, override_id, symbol,
    old_price_usd, new_price_usd, old_price_mwk, new_price_mwk, reason
  ) VALUES (
    p_admin_user_id, 'create_override', override_id, p_symbol,
    p_previous_price_usd, p_price_usd, p_previous_price_mwk, p_price_mwk, p_reason
  );

  RETURN override_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deactivate price override
CREATE OR REPLACE FUNCTION public.deactivate_price_override(
  p_override_id UUID,
  p_admin_user_id UUID,
  p_reason TEXT DEFAULT 'Manual deactivation'
)
RETURNS BOOLEAN AS $$
DECLARE
  override_record RECORD;
BEGIN
  -- Get the override record
  SELECT * INTO override_record
  FROM public.admin_price_overrides
  WHERE id = p_override_id AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Deactivate the override
  UPDATE public.admin_price_overrides
  SET is_active = FALSE,
      deactivated_at = NOW(),
      deactivated_by = p_admin_user_id
  WHERE id = p_override_id;

  -- Log the action
  INSERT INTO public.admin_price_audit_log (
    admin_user_id, action, override_id, symbol, reason
  ) VALUES (
    p_admin_user_id, 'deactivate_override', p_override_id, override_record.symbol, p_reason
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check admin permissions
CREATE OR REPLACE FUNCTION public.check_admin_price_permission(
  p_user_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  has_permission BOOLEAN := FALSE;
BEGIN
  SELECT
    CASE p_permission
      WHEN 'manage_prices' THEN ap.can_manage_prices
      WHEN 'override_prices' THEN ap.can_override_prices
      WHEN 'disable_auto_updates' THEN ap.can_disable_auto_updates
      WHEN 'view_price_audit' THEN ap.can_view_price_audit
      ELSE FALSE
    END INTO has_permission
  FROM public.admin_permissions ap
  WHERE ap.user_id = p_user_id
    AND ap.is_active = TRUE
    AND (ap.expires_at IS NULL OR ap.expires_at > NOW());

  RETURN COALESCE(has_permission, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_active_price_override(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_price_override(UUID, TEXT, DECIMAL, DECIMAL, DECIMAL, TEXT, INTEGER, BOOLEAN, DECIMAL, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION public.deactivate_price_override(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_admin_price_permission(UUID, TEXT) TO authenticated;

-- =====================================================
-- 8. VIEWS
-- =====================================================

-- Create view for admin price management dashboard
CREATE OR REPLACE VIEW public.admin_price_management_view AS
SELECT
  apo.id,
  apo.symbol,
  apo.price_usd,
  apo.price_mwk,
  apo.usd_mwk_rate,
  apo.reason,
  apo.duration_minutes,
  apo.expires_at,
  apo.is_active,
  apo.disable_auto_updates,
  apo.previous_price_usd,
  apo.previous_price_mwk,
  apo.created_at,
  apo.deactivated_at,
  p1.full_name as admin_name,
  p1.email as admin_email,
  p2.full_name as deactivated_by_name,
  CASE
    WHEN apo.expires_at IS NOT NULL AND apo.expires_at <= NOW() THEN 'expired'
    WHEN apo.is_active = FALSE THEN 'deactivated'
    WHEN apo.is_active = TRUE THEN 'active'
    ELSE 'unknown'
  END as status,
  CASE
    WHEN apo.expires_at IS NOT NULL THEN
      EXTRACT(EPOCH FROM (apo.expires_at - NOW())) / 60
    ELSE NULL
  END as minutes_remaining
FROM public.admin_price_overrides apo
LEFT JOIN public.profiles p1 ON apo.admin_user_id = p1.id
LEFT JOIN public.profiles p2 ON apo.deactivated_by = p2.id
ORDER BY apo.created_at DESC;

-- Grant permissions on views
GRANT SELECT ON public.admin_price_management_view TO authenticated;

-- =====================================================
-- 9. STORAGE BUCKETS
-- =====================================================

-- Create storage bucket for blog media (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-media',
  'blog-media',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog media
CREATE POLICY "Public can view blog media" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-media');

CREATE POLICY "Authenticated users can upload blog media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own blog media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own blog media" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-media' AND auth.uid()::text = (storage.foldername(name))[1]);
