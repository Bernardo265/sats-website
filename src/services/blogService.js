import { supabase } from '../lib/supabase';
import authService from './authService';

/**
 * Blog Content Management Service
 */
class BlogService {
  constructor() {
    this.tables = {
      POSTS: 'blog_posts',
      CATEGORIES: 'blog_categories',
      TAGS: 'blog_tags',
      POST_TAGS: 'blog_post_tags',
      COMMENTS: 'blog_comments',
      REVISIONS: 'blog_post_revisions',
      ANALYTICS: 'blog_analytics',
      MEDIA: 'media_library'
    };
  }

  // ==================== POSTS ====================

  /**
   * Get all posts with filters and pagination
   */
  async getPosts(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        status = null,
        category = null,
        author = null,
        search = null,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.tables.POSTS)
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url),
          category:blog_categories(id, name, slug, color),
          featured_image:media_library!featured_image_id(id, file_url, alt_text),
          tags:blog_post_tags(blog_tags(id, name, slug, color))
        `, { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category_id', category);
      }

      if (author) {
        query = query.eq('author_id', author);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        posts: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }

  /**
   * Get single post by ID or slug
   */
  async getPost(identifier, bySlug = false) {
    try {
      const field = bySlug ? 'slug' : 'id';
      
      const { data, error } = await supabase
        .from(this.tables.POSTS)
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url, bio),
          category:blog_categories(id, name, slug, color),
          featured_image:media_library!featured_image_id(id, file_url, alt_text),
          og_image:media_library!og_image_id(id, file_url, alt_text),
          tags:blog_post_tags(blog_tags(id, name, slug, color))
        `)
        .eq(field, identifier)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  }

  /**
   * Create new blog post
   */
  async createPost(postData) {
    try {
      // Check permissions
      const canCreate = await authService.canPerform(authService.permissions.CREATE_POST);
      if (!canCreate) {
        throw new Error('Insufficient permissions to create posts');
      }

      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Generate slug if not provided
      if (!postData.slug && postData.title) {
        const { data: slugData, error: slugError } = await supabase.rpc('generate_slug', {
          title: postData.title
        });
        if (!slugError) {
          postData.slug = slugData;
        }
      }

      // Calculate reading time
      if (postData.content) {
        const { data: readingTime, error: timeError } = await supabase.rpc('calculate_reading_time', {
          content: postData.content
        });
        if (!timeError) {
          postData.reading_time = readingTime;
        }
      }

      const { data, error } = await supabase
        .from(this.tables.POSTS)
        .insert({
          ...postData,
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add tags if provided
      if (postData.tags && postData.tags.length > 0) {
        await this.updatePostTags(data.id, postData.tags);
      }

      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Update blog post
   */
  async updatePost(postId, postData) {
    try {
      // Check if user can edit this post
      const existingPost = await this.getPost(postId);
      const canEdit = await authService.canEditPost(existingPost.author_id);
      
      if (!canEdit) {
        throw new Error('Insufficient permissions to edit this post');
      }

      // Update slug if title changed
      if (postData.title && postData.title !== existingPost.title) {
        const { data: slugData, error: slugError } = await supabase.rpc('generate_slug', {
          title: postData.title
        });
        if (!slugError) {
          postData.slug = slugData;
        }
      }

      // Recalculate reading time if content changed
      if (postData.content && postData.content !== existingPost.content) {
        const { data: readingTime, error: timeError } = await supabase.rpc('calculate_reading_time', {
          content: postData.content
        });
        if (!timeError) {
          postData.reading_time = readingTime;
        }
      }

      const { data, error } = await supabase
        .from(this.tables.POSTS)
        .update(postData)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      // Update tags if provided
      if (postData.tags !== undefined) {
        await this.updatePostTags(postId, postData.tags);
      }

      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  /**
   * Delete blog post
   */
  async deletePost(postId) {
    try {
      const existingPost = await this.getPost(postId);
      const canDelete = await authService.canDeletePost(existingPost.author_id);
      
      if (!canDelete) {
        throw new Error('Insufficient permissions to delete this post');
      }

      const { error } = await supabase
        .from(this.tables.POSTS)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', postId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  /**
   * Publish post
   */
  async publishPost(postId, publishAt = null) {
    try {
      const canPublish = await authService.canPerform(authService.permissions.PUBLISH_POST);
      if (!canPublish) {
        throw new Error('Insufficient permissions to publish posts');
      }

      const updateData = publishAt 
        ? { status: 'scheduled', scheduled_at: publishAt }
        : { status: 'published', published_at: new Date().toISOString() };

      const { data, error } = await supabase
        .from(this.tables.POSTS)
        .update(updateData)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  }

  /**
   * Update post tags
   */
  async updatePostTags(postId, tagIds) {
    try {
      // Remove existing tags
      await supabase
        .from(this.tables.POST_TAGS)
        .delete()
        .eq('post_id', postId);

      // Add new tags
      if (tagIds && tagIds.length > 0) {
        const tagData = tagIds.map(tagId => ({
          post_id: postId,
          tag_id: tagId
        }));

        const { error } = await supabase
          .from(this.tables.POST_TAGS)
          .insert(tagData);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error updating post tags:', error);
      throw error;
    }
  }

  // ==================== CATEGORIES ====================

  /**
   * Get all categories
   */
  async getCategories(activeOnly = false) {
    try {
      let query = supabase
        .from(this.tables.CATEGORIES)
        .select('*')
        .order('sort_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  /**
   * Create category
   */
  async createCategory(categoryData) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_CATEGORIES);
      if (!canManage) {
        throw new Error('Insufficient permissions to manage categories');
      }

      // Generate slug if not provided
      if (!categoryData.slug && categoryData.name) {
        const { data: slugData, error: slugError } = await supabase.rpc('generate_slug', {
          title: categoryData.name
        });
        if (!slugError) {
          categoryData.slug = slugData;
        }
      }

      const { data, error } = await supabase
        .from(this.tables.CATEGORIES)
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update category
   */
  async updateCategory(categoryId, categoryData) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_CATEGORIES);
      if (!canManage) {
        throw new Error('Insufficient permissions to manage categories');
      }

      const { data, error } = await supabase
        .from(this.tables.CATEGORIES)
        .update(categoryData)
        .eq('id', categoryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // ==================== TAGS ====================

  /**
   * Get all tags
   */
  async getTags(activeOnly = false) {
    try {
      let query = supabase
        .from(this.tables.TAGS)
        .select('*')
        .order('usage_count', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting tags:', error);
      throw error;
    }
  }

  /**
   * Create tag
   */
  async createTag(tagData) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_TAGS);
      if (!canManage) {
        throw new Error('Insufficient permissions to manage tags');
      }

      // Generate slug if not provided
      if (!tagData.slug && tagData.name) {
        const { data: slugData, error: slugError } = await supabase.rpc('generate_slug', {
          title: tagData.name
        });
        if (!slugError) {
          tagData.slug = slugData;
        }
      }

      const { data, error } = await supabase
        .from(this.tables.TAGS)
        .insert(tagData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  /**
   * Get blog statistics
   */
  async getBlogStats() {
    try {
      const canView = await authService.canPerform(authService.permissions.VIEW_ANALYTICS);
      if (!canView) {
        throw new Error('Insufficient permissions to view analytics');
      }

      const { data, error } = await supabase.rpc('get_blog_stats');
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error getting blog stats:', error);
      throw error;
    }
  }

  /**
   * Publish scheduled posts
   */
  async publishScheduledPosts() {
    try {
      const { data, error } = await supabase.rpc('publish_scheduled_posts');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error publishing scheduled posts:', error);
      throw error;
    }
  }
}

// Create singleton instance
const blogService = new BlogService();

export default blogService;
