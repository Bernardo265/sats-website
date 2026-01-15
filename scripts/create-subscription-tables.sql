-- Email Subscription System Database Schema
-- Email Lists Table
CREATE TABLE IF NOT EXISTS email_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Subscribers Table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'pending')),
  source VARCHAR(50) DEFAULT 'website',
  metadata JSONB DEFAULT '{}',
  unsubscribe_token UUID DEFAULT gen_random_uuid(),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Subscriber Lists Junction Table
CREATE TABLE IF NOT EXISTS email_subscriber_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES email_subscribers(id) ON DELETE CASCADE,
  list_id UUID REFERENCES email_lists(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(subscriber_id, list_id)
);

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  template_type VARCHAR(50) DEFAULT 'newsletter',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Campaign Sends Table (tracks individual sends)
CREATE TABLE IF NOT EXISTS email_campaign_sends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES email_subscribers(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table (enhance existing or create if not exists)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  featured_image_id UUID,
  og_image_id UUID,
  category_id UUID,
  author_id UUID REFERENCES auth.users(id),
  reading_time INTEGER,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  seo_title VARCHAR(255),
  seo_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6B7280',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#6B7280',
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);  

-- Blog Post Tags Junction Table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  UNIQUE(post_id, tag_id)
);

-- Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  author_website VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Library Table
CREATE TABLE IF NOT EXISTS media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER,
  alt_text VARCHAR(255),
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles Table (enhance existing or create if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'author', 'editor', 'admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);

-- RLS (Row Level Security) Policies
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Subscribers can only view their own data
CREATE POLICY "Users can view own subscriber data" ON email_subscribers
  FOR SELECT USING (auth.uid()::text = email OR auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- Only admins can manage subscribers
CREATE POLICY "Admins can manage subscribers" ON email_subscribers
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- Blog posts policies
CREATE POLICY "Anyone can view published posts" ON blog_posts
  FOR SELECT USING (status = 'published' OR auth.jwt() ->> 'role' IN ('author', 'editor', 'admin', 'super_admin'));

CREATE POLICY "Authors can manage own posts" ON blog_posts
  FOR ALL USING (auth.uid() = author_id OR auth.jwt() ->> 'role' IN ('editor', 'admin', 'super_admin'));

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Functions for common operations

-- Generate slug function
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Calculate reading time function
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Assume 200 words per minute reading speed
  RETURN CEIL(array_length(string_to_array(content, ' '), 1) / 200.0);
END;
$$ LANGUAGE plpgsql;

-- Get blog statistics function
CREATE OR REPLACE FUNCTION get_blog_stats()
RETURNS TABLE(
  total_posts BIGINT,
  published_posts BIGINT,
  draft_posts BIGINT,
  total_comments BIGINT,
  approved_comments BIGINT,
  total_views BIGINT,
  total_likes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM blog_posts WHERE deleted_at IS NULL),
    (SELECT COUNT(*) FROM blog_posts WHERE status = 'published' AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM blog_posts WHERE status = 'draft' AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM blog_comments),
    (SELECT COUNT(*) FROM blog_comments WHERE status = 'approved'),
    (SELECT COALESCE(SUM(view_count), 0) FROM blog_posts),
    (SELECT COALESCE(SUM(like_count), 0) FROM blog_posts);
END;
$$ LANGUAGE plpgsql;

-- Get subscription statistics function
CREATE OR REPLACE FUNCTION get_subscription_stats()
RETURNS TABLE(
  total_subscribers BIGINT,
  active_subscribers BIGINT,
  unsubscribed_subscribers BIGINT,
  total_campaigns BIGINT,
  sent_campaigns BIGINT,
  total_opens BIGINT,
  total_clicks BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM email_subscribers),
    (SELECT COUNT(*) FROM email_subscribers WHERE status = 'active'),
    (SELECT COUNT(*) FROM email_subscribers WHERE status = 'unsubscribed'),
    (SELECT COUNT(*) FROM email_campaigns),
    (SELECT COUNT(*) FROM email_campaigns WHERE status = 'sent'),
    (SELECT COALESCE(SUM(open_count), 0) FROM email_campaigns),
    (SELECT COALESCE(SUM(click_count), 0) FROM email_campaigns);
END;
$$ LANGUAGE plpgsql;

-- Publish scheduled posts function
CREATE OR REPLACE FUNCTION publish_scheduled_posts()
RETURNS INTEGER AS $$
DECLARE
  published_count INTEGER := 0;
BEGIN
  UPDATE blog_posts 
  SET 
    status = 'published',
    published_at = NOW()
  WHERE 
    status = 'scheduled' 
    AND scheduled_at <= NOW()
    AND deleted_at IS NULL;
    
  GET DIAGNOSTICS published_count = ROW_COUNT;
  RETURN published_count;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_email_subscribers_updated_at BEFORE UPDATE ON email_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_tags_updated_at BEFORE UPDATE ON blog_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO email_lists (name, description) VALUES 
  ('Newsletter', 'Main newsletter subscribers'),
  ('Blog Updates', 'Subscribers who want blog post notifications'),
  ('Product Updates', 'Product and feature announcements')
ON CONFLICT DO NOTHING;

INSERT INTO blog_categories (name, slug, description, color) VALUES 
  ('Technology', 'technology', 'Tech news and tutorials', '#3B82F6'),
  ('Business', 'business', 'Business insights and strategies', '#10B981'),
  ('Lifestyle', 'lifestyle', 'Lifestyle and personal development', '#F59E0B'),
  ('News', 'news', 'Latest news and updates', '#EF4444')
ON CONFLICT DO NOTHING;

-- Create default admin user profile (you'll need to update the ID)
-- INSERT INTO profiles (id, full_name, role) VALUES 
--   ('your-user-id-here', 'Admin User', 'super_admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

COMMENT ON TABLE email_subscribers IS 'Stores email newsletter subscribers';
COMMENT ON TABLE email_campaigns IS 'Email marketing campaigns';
COMMENT ON TABLE blog_posts IS 'Blog posts and articles';
COMMENT ON TABLE profiles IS 'User profiles with role-based access';