import { supabase } from '../lib/supabase';
import authService from './authService';

/**
 * Comment Management Service
 */
class CommentService {
  constructor() {
    this.table = 'blog_comments';
  }

  /**
   * Get comments for a post
   */
  async getPostComments(postId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        status = 'approved',
        sortBy = 'created_at',
        sortOrder = 'asc'
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.table)
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url),
          replies:blog_comments!parent_id(
            *,
            author:profiles!author_id(id, full_name, avatar_url)
          )
        `, { count: 'exact' })
        .eq('post_id', postId)
        .is('parent_id', null); // Only top-level comments

      if (status) {
        query = query.eq('status', status);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        comments: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error getting post comments:', error);
      throw error;
    }
  }

  /**
   * Get all comments with moderation info
   */
  async getAllComments(options = {}) {
    try {
      const canModerate = await authService.canPerform(authService.permissions.MODERATE_COMMENTS);
      if (!canModerate) {
        throw new Error('Insufficient permissions to view all comments');
      }

      const {
        page = 1,
        limit = 50,
        status = null,
        postId = null,
        search = null,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.table)
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url),
          post:blog_posts!post_id(id, title, slug),
          moderator:profiles!moderated_by(id, full_name)
        `, { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (postId) {
        query = query.eq('post_id', postId);
      }

      if (search) {
        query = query.or(`content.ilike.%${search}%,author_name.ilike.%${search}%,author_email.ilike.%${search}%`);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        comments: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error getting all comments:', error);
      throw error;
    }
  }

  /**
   * Create a new comment
   */
  async createComment(commentData) {
    try {
      const user = await authService.getCurrentUser();
      
      // Prepare comment data
      const newComment = {
        post_id: commentData.postId,
        parent_id: commentData.parentId || null,
        content: commentData.content,
        status: 'pending' // All comments start as pending
      };

      if (user) {
        // Authenticated user
        newComment.author_id = user.id;
        newComment.author_name = user.profile?.full_name || user.email;
        newComment.author_email = user.email;
      } else {
        // Guest user
        if (!commentData.authorName || !commentData.authorEmail) {
          throw new Error('Name and email are required for guest comments');
        }
        newComment.author_name = commentData.authorName;
        newComment.author_email = commentData.authorEmail;
        newComment.author_website = commentData.authorWebsite || null;
      }

      // Add IP and user agent for moderation
      if (commentData.ipAddress) {
        newComment.ip_address = commentData.ipAddress;
      }
      if (commentData.userAgent) {
        newComment.user_agent = commentData.userAgent;
      }

      const { data, error } = await supabase
        .from(this.table)
        .insert(newComment)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  /**
   * Update comment
   */
  async updateComment(commentId, updateData) {
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Get existing comment
      const { data: existingComment, error: fetchError } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', commentId)
        .single();

      if (fetchError) throw fetchError;

      // Check if user can update this comment
      const canModerate = await authService.canPerform(authService.permissions.MODERATE_COMMENTS);
      const isOwner = existingComment.author_id === user.id;

      if (!canModerate && !isOwner) {
        throw new Error('Insufficient permissions to update this comment');
      }

      // If user is moderating, add moderation info
      if (canModerate && updateData.status && updateData.status !== existingComment.status) {
        updateData.moderated_by = user.id;
        updateData.moderated_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from(this.table)
        .update(updateData)
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId) {
    try {
      const canDelete = await authService.canPerform(authService.permissions.DELETE_COMMENTS);
      if (!canDelete) {
        throw new Error('Insufficient permissions to delete comments');
      }

      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Moderate comment (approve, reject, mark as spam)
   */
  async moderateComment(commentId, action, reason = null) {
    try {
      const canModerate = await authService.canPerform(authService.permissions.MODERATE_COMMENTS);
      if (!canModerate) {
        throw new Error('Insufficient permissions to moderate comments');
      }

      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const validActions = ['approved', 'rejected', 'spam'];
      if (!validActions.includes(action)) {
        throw new Error('Invalid moderation action');
      }

      const updateData = {
        status: action,
        moderated_by: user.id,
        moderated_at: new Date().toISOString()
      };

      if (reason) {
        updateData.moderation_reason = reason;
      }

      const { data, error } = await supabase
        .from(this.table)
        .update(updateData)
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error moderating comment:', error);
      throw error;
    }
  }

  /**
   * Bulk moderate comments
   */
  async bulkModerateComments(commentIds, action, reason = null) {
    try {
      const canModerate = await authService.canPerform(authService.permissions.MODERATE_COMMENTS);
      if (!canModerate) {
        throw new Error('Insufficient permissions to moderate comments');
      }

      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const results = [];
      
      for (const commentId of commentIds) {
        try {
          const result = await this.moderateComment(commentId, action, reason);
          results.push({ id: commentId, success: true, data: result });
        } catch (error) {
          results.push({ id: commentId, success: false, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk moderating comments:', error);
      throw error;
    }
  }

  /**
   * Get comment statistics
   */
  async getCommentStats() {
    try {
      const canView = await authService.canPerform(authService.permissions.VIEW_ANALYTICS);
      if (!canView) {
        throw new Error('Insufficient permissions to view comment statistics');
      }

      const { data, error } = await supabase
        .from(this.table)
        .select('status, created_at');

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: 0,
        approved: 0,
        rejected: 0,
        spam: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      };

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      data.forEach(comment => {
        // Count by status
        stats[comment.status]++;

        // Count by time period
        const commentDate = new Date(comment.created_at);
        if (commentDate >= today) {
          stats.today++;
        }
        if (commentDate >= weekAgo) {
          stats.thisWeek++;
        }
        if (commentDate >= monthAgo) {
          stats.thisMonth++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting comment stats:', error);
      throw error;
    }
  }

  /**
   * Get pending comments count
   */
  async getPendingCommentsCount() {
    try {
      const canModerate = await authService.canPerform(authService.permissions.MODERATE_COMMENTS);
      if (!canModerate) {
        return 0;
      }

      const { count, error } = await supabase
        .from(this.table)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      return count;
    } catch (error) {
      console.error('Error getting pending comments count:', error);
      return 0;
    }
  }

  /**
   * Like/unlike a comment
   */
  async toggleCommentLike(commentId) {
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // For now, just increment the like count
      // In a full implementation, you'd track individual likes in a separate table
      const { data, error } = await supabase
        .from(this.table)
        .select('like_count')
        .eq('id', commentId)
        .single();

      if (error) throw error;

      const { data: updatedComment, error: updateError } = await supabase
        .from(this.table)
        .update({ like_count: (data.like_count || 0) + 1 })
        .eq('id', commentId)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedComment;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }

  /**
   * Get comment replies
   */
  async getCommentReplies(parentId) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url)
        `)
        .eq('parent_id', parentId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting comment replies:', error);
      throw error;
    }
  }
}

// Create singleton instance
const commentService = new CommentService();

export default commentService;
