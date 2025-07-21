-- SafeSats Blog Content Management Database Schema
-- Run these commands in your Supabase SQL editor after the main schema

-- Create enum types for better data integrity
CREATE TYPE blog_post_status AS ENUM ('draft', 'published', 'scheduled', 'archived', 'deleted');
CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected', 'spam');
CREATE TYPE user_role AS ENUM ('user', 'author', 'editor', 'admin', 'super_admin');
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document', 'other');

-- Extend profiles table with admin roles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create blog categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6B7280', -- Hex color for category
  parent_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog tags table
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6B7280',
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media library table
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  media_type media_type NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_id UUID REFERENCES public.media_library(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  status blog_post_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- Estimated reading time in minutes
  is_featured BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  allow_comments BOOLEAN DEFAULT TRUE,
  
  -- SEO fields
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords TEXT,
  og_title VARCHAR(60),
  og_description VARCHAR(160),
  og_image_id UUID REFERENCES public.media_library(id) ON DELETE SET NULL,
  
  -- Content versioning
  version INTEGER DEFAULT 1,
  parent_version_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create blog post tags junction table
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Create blog comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  author_website VARCHAR(255),
  content TEXT NOT NULL,
  status comment_status DEFAULT 'pending',
  ip_address INET,
  user_agent TEXT,
  like_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moderated_at TIMESTAMP WITH TIME ZONE,
  moderation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog post revisions table for version history
CREATE TABLE IF NOT EXISTS public.blog_post_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  revision_number INTEGER NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog analytics table
CREATE TABLE IF NOT EXISTS public.blog_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'share', 'comment'
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscription_source VARCHAR(50), -- 'blog', 'homepage', 'popup', etc.
  preferences JSONB DEFAULT '{}',
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled ON public.blog_posts(scheduled_at) WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON public.blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created ON public.blog_comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_active ON public.blog_categories(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON public.blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_usage ON public.blog_tags(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_media_library_type ON public.media_library(media_type);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON public.media_library(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_blog_analytics_post ON public.blog_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_event ON public.blog_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_created ON public.blog_analytics(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable Row Level Security
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
DECLARE
  user_role_val user_role;
BEGIN
  SELECT role INTO user_role_val
  FROM public.profiles
  WHERE id = user_id;

  RETURN COALESCE(user_role_val, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has admin privileges
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role(user_id) IN ('admin', 'super_admin', 'editor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user can edit content
CREATE OR REPLACE FUNCTION public.can_edit_content(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role(user_id) IN ('admin', 'super_admin', 'editor', 'author');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view active categories" ON public.blog_categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage categories" ON public.blog_categories
  FOR ALL USING (public.is_admin());

-- RLS Policies for blog_tags
CREATE POLICY "Anyone can view active tags" ON public.blog_tags
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage tags" ON public.blog_tags
  FOR ALL USING (public.is_admin());

-- RLS Policies for media_library
CREATE POLICY "Anyone can view public media" ON public.media_library
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can view their own media" ON public.media_library
  FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "Content creators can upload media" ON public.media_library
  FOR INSERT WITH CHECK (public.can_edit_content() AND uploaded_by = auth.uid());

CREATE POLICY "Users can update their own media" ON public.media_library
  FOR UPDATE USING (uploaded_by = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can delete media" ON public.media_library
  FOR DELETE USING (public.is_admin());

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Authors can view their own posts" ON public.blog_posts
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Admins can view all posts" ON public.blog_posts
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Content creators can create posts" ON public.blog_posts
  FOR INSERT WITH CHECK (public.can_edit_content() AND author_id = auth.uid());

CREATE POLICY "Authors can update their own posts" ON public.blog_posts
  FOR UPDATE USING (author_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can delete posts" ON public.blog_posts
  FOR DELETE USING (public.is_admin());

-- RLS Policies for blog_post_tags
CREATE POLICY "Anyone can view post tags for published posts" ON public.blog_post_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE id = post_id AND status = 'published' AND published_at <= NOW()
    )
  );

CREATE POLICY "Content creators can manage post tags" ON public.blog_post_tags
  FOR ALL USING (
    public.can_edit_content() AND (
      EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND (author_id = auth.uid() OR public.is_admin())
      )
    )
  );

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view approved comments" ON public.blog_comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own comments" ON public.blog_comments
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Admins can view all comments" ON public.blog_comments
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Authenticated users can create comments" ON public.blog_comments
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE id = post_id AND status = 'published' AND allow_comments = TRUE
    )
  );

CREATE POLICY "Users can update their own comments" ON public.blog_comments
  FOR UPDATE USING (author_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can moderate comments" ON public.blog_comments
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete comments" ON public.blog_comments
  FOR DELETE USING (public.is_admin());

-- RLS Policies for blog_post_revisions
CREATE POLICY "Authors can view revisions of their posts" ON public.blog_post_revisions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE id = post_id AND (author_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Content creators can create revisions" ON public.blog_post_revisions
  FOR INSERT WITH CHECK (
    public.can_edit_content() AND
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE id = post_id AND (author_id = auth.uid() OR public.is_admin())
    )
  );

-- RLS Policies for blog_analytics
CREATE POLICY "Admins can view all analytics" ON public.blog_analytics
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Anyone can insert analytics" ON public.blog_analytics
  FOR INSERT WITH CHECK (TRUE);

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Admins can manage newsletter subscribers" ON public.newsletter_subscribers
  FOR ALL USING (public.is_admin());

CREATE POLICY "Users can manage their own subscription" ON public.newsletter_subscribers
  FOR SELECT USING (
    auth.jwt() ->> 'email' = email OR public.is_admin()
  );

-- Database Functions for Blog Management

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate reading time
CREATE OR REPLACE FUNCTION public.calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_time INTEGER;
BEGIN
  -- Count words (approximate)
  word_count := array_length(string_to_array(regexp_replace(content, '<[^>]*>', '', 'g'), ' '), 1);

  -- Average reading speed: 200 words per minute
  reading_time := GREATEST(1, ROUND(word_count / 200.0));

  RETURN reading_time;
END;
$$ LANGUAGE plpgsql;

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.blog_tags
    SET usage_count = usage_count + 1
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.blog_tags
    SET usage_count = GREATEST(0, usage_count - 1)
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update post comment count
CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
    UPDATE public.blog_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
      UPDATE public.blog_posts
      SET comment_count = comment_count + 1
      WHERE id = NEW.post_id;
    ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
      UPDATE public.blog_posts
      SET comment_count = GREATEST(0, comment_count - 1)
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
    UPDATE public.blog_posts
    SET comment_count = GREATEST(0, comment_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to create post revision
CREATE OR REPLACE FUNCTION public.create_post_revision()
RETURNS TRIGGER AS $$
DECLARE
  revision_num INTEGER;
BEGIN
  -- Only create revision if content actually changed
  IF OLD.title != NEW.title OR OLD.content != NEW.content OR OLD.excerpt != NEW.excerpt THEN
    -- Get next revision number
    SELECT COALESCE(MAX(revision_number), 0) + 1
    INTO revision_num
    FROM public.blog_post_revisions
    WHERE post_id = NEW.id;

    -- Insert revision
    INSERT INTO public.blog_post_revisions (
      post_id, title, content, excerpt, revision_number, changed_by
    ) VALUES (
      NEW.id, OLD.title, OLD.content, OLD.excerpt, revision_num, auth.uid()
    );

    -- Update version number
    NEW.version = revision_num;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS INTEGER AS $$
DECLARE
  published_count INTEGER := 0;
BEGIN
  UPDATE public.blog_posts
  SET
    status = 'published',
    published_at = NOW(),
    updated_at = NOW()
  WHERE
    status = 'scheduled'
    AND scheduled_at <= NOW();

  GET DIAGNOSTICS published_count = ROW_COUNT;

  RETURN published_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get blog statistics
CREATE OR REPLACE FUNCTION public.get_blog_stats()
RETURNS TABLE(
  total_posts BIGINT,
  published_posts BIGINT,
  draft_posts BIGINT,
  scheduled_posts BIGINT,
  total_comments BIGINT,
  pending_comments BIGINT,
  total_views BIGINT,
  total_categories BIGINT,
  total_tags BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.blog_posts WHERE deleted_at IS NULL),
    (SELECT COUNT(*) FROM public.blog_posts WHERE status = 'published'),
    (SELECT COUNT(*) FROM public.blog_posts WHERE status = 'draft'),
    (SELECT COUNT(*) FROM public.blog_posts WHERE status = 'scheduled'),
    (SELECT COUNT(*) FROM public.blog_comments),
    (SELECT COUNT(*) FROM public.blog_comments WHERE status = 'pending'),
    (SELECT COALESCE(SUM(view_count), 0) FROM public.blog_posts),
    (SELECT COUNT(*) FROM public.blog_categories WHERE is_active = TRUE),
    (SELECT COUNT(*) FROM public.blog_tags WHERE is_active = TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_blog_tags_updated_at
  BEFORE UPDATE ON public.blog_tags
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to update tag usage count
CREATE TRIGGER update_tag_usage_trigger
  AFTER INSERT OR DELETE ON public.blog_post_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

-- Trigger to update post comment count
CREATE TRIGGER update_comment_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();

-- Trigger to create post revisions
CREATE TRIGGER create_post_revision_trigger
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.create_post_revision();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.generate_slug(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_reading_time(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_content(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_scheduled_posts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_blog_stats() TO authenticated;
