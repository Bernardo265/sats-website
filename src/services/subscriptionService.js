import { supabase } from '../lib/supabase';
import authService from './authService';

/**
 * Email Subscription Service
 * Handles newsletter subscriptions, email campaigns, and subscriber management
 */
class SubscriptionService {
  constructor() {
    this.tables = {
      SUBSCRIBERS: 'email_subscribers',
      CAMPAIGNS: 'email_campaigns',
      CAMPAIGN_SENDS: 'email_campaign_sends',
      TEMPLATES: 'email_templates',
      LISTS: 'email_lists',
      SUBSCRIBER_LISTS: 'email_subscriber_lists'
    };

    this.subscriberStatus = {
      ACTIVE: 'active',
      UNSUBSCRIBED: 'unsubscribed',
      BOUNCED: 'bounced',
      PENDING: 'pending'
    };

    this.campaignStatus = {
      DRAFT: 'draft',
      SCHEDULED: 'scheduled',
      SENDING: 'sending',
      SENT: 'sent',
      CANCELLED: 'cancelled'
    };
  }

  // ==================== SUBSCRIBERS ====================

  /**
   * Subscribe email to newsletter
   */
  async subscribe(email, options = {}) {
    try {
      const {
        firstName = null,
        lastName = null,
        source = 'website',
        listIds = [],
        metadata = {}
      } = options;

      // Check if email already exists
      const { data: existing, error: checkError } = await supabase
        .from(this.tables.SUBSCRIBERS)
        .select('id, status')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let subscriber;

      if (existing) {
        // Reactivate if unsubscribed
        if (existing.status === this.subscriberStatus.UNSUBSCRIBED) {
          const { data, error } = await supabase
            .from(this.tables.SUBSCRIBERS)
            .update({
              status: this.subscriberStatus.ACTIVE,
              resubscribed_at: new Date().toISOString(),
              unsubscribed_at: null
            })
            .eq('id', existing.id)
            .select()
            .single();

          if (error) throw error;
          subscriber = data;
        } else {
          subscriber = existing;
        }
      } else {
        // Create new subscriber
        const { data, error } = await supabase
          .from(this.tables.SUBSCRIBERS)
          .insert({
            email: email.toLowerCase(),
            first_name: firstName,
            last_name: lastName,
            status: this.subscriberStatus.ACTIVE,
            source,
            metadata,
            subscribed_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        subscriber = data;
      }

      // Add to lists if specified
      if (listIds.length > 0) {
        await this.addSubscriberToLists(subscriber.id, listIds);
      }

      return subscriber;
    } catch (error) {
      console.error('Error subscribing email:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe email from newsletter
   */
  async unsubscribe(email, token = null) {
    try {
      let query = supabase
        .from(this.tables.SUBSCRIBERS)
        .update({
          status: this.subscriberStatus.UNSUBSCRIBED,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase());

      // If token provided, verify it matches
      if (token) {
        query = query.eq('unsubscribe_token', token);
      }

      const { data, error } = await query.select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error unsubscribing email:', error);
      throw error;
    }
  }

  /**
   * Get all subscribers with filters and pagination
   */
  async getSubscribers(options = {}) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_USERS);
      if (!canManage) {
        throw new Error('Insufficient permissions to view subscribers');
      }

      const {
        page = 1,
        limit = 50,
        status = null,
        search = null,
        listId = null,
        sortBy = 'subscribed_at',
        sortOrder = 'desc'
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.tables.SUBSCRIBERS)
        .select(`
          *,
          lists:email_subscriber_lists(email_lists(id, name))
        `, { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      if (listId) {
        query = query.eq('email_subscriber_lists.list_id', listId);
      }

      // Apply sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        subscribers: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error getting subscribers:', error);
      throw error;
    }
  }

  /**
   * Get subscriber by email
   */
  async getSubscriber(email) {
    try {
      const { data, error } = await supabase
        .from(this.tables.SUBSCRIBERS)
        .select(`
          *,
          lists:email_subscriber_lists(email_lists(id, name))
        `)
        .eq('email', email.toLowerCase())
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting subscriber:', error);
      throw error;
    }
  }

  /**
   * Update subscriber
   */
  async updateSubscriber(subscriberId, updateData) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_USERS);
      if (!canManage) {
        throw new Error('Insufficient permissions to update subscribers');
      }

      const { data, error } = await supabase
        .from(this.tables.SUBSCRIBERS)
        .update(updateData)
        .eq('id', subscriberId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating subscriber:', error);
      throw error;
    }
  }

  // ==================== EMAIL LISTS ====================

  /**
   * Get all email lists
   */
  async getEmailLists() {
    try {
      const { data, error } = await supabase
        .from(this.tables.LISTS)
        .select(`
          *,
          subscriber_count:email_subscriber_lists(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting email lists:', error);
      throw error;
    }
  }

  /**
   * Create email list
   */
  async createEmailList(listData) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_USERS);
      if (!canManage) {
        throw new Error('Insufficient permissions to create email lists');
      }

      const { data, error } = await supabase
        .from(this.tables.LISTS)
        .insert(listData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating email list:', error);
      throw error;
    }
  }

  /**
   * Add subscriber to lists
   */
  async addSubscriberToLists(subscriberId, listIds) {
    try {
      const listData = listIds.map(listId => ({
        subscriber_id: subscriberId,
        list_id: listId,
        subscribed_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from(this.tables.SUBSCRIBER_LISTS)
        .upsert(listData, { onConflict: 'subscriber_id,list_id' })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding subscriber to lists:', error);
      throw error;
    }
  }

  // ==================== EMAIL CAMPAIGNS ====================

  /**
   * Get all campaigns
   */
  async getCampaigns(options = {}) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_USERS);
      if (!canManage) {
        throw new Error('Insufficient permissions to view campaigns');
      }

      const {
        page = 1,
        limit = 20,
        status = null,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.tables.CAMPAIGNS)
        .select(`
          *,
          template:email_templates(id, name),
          sends:email_campaign_sends(count)
        `, { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        campaigns: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error getting campaigns:', error);
      throw error;
    }
  }

  /**
   * Create email campaign
   */
  async createCampaign(campaignData) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_USERS);
      if (!canManage) {
        throw new Error('Insufficient permissions to create campaigns');
      }

      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from(this.tables.CAMPAIGNS)
        .insert({
          ...campaignData,
          created_by: user.id,
          status: this.campaignStatus.DRAFT
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  /**
   * Send campaign to blog subscribers when new post is published
   */
  async sendBlogNotification(postId) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_USERS);
      if (!canManage) {
        throw new Error('Insufficient permissions to send campaigns');
      }

      // Get the blog post
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles!author_id(full_name),
          category:blog_categories(name)
        `)
        .eq('id', postId)
        .single();

      if (postError) throw postError;

      // Get active subscribers
      const { data: subscribers, error: subError } = await supabase
        .from(this.tables.SUBSCRIBERS)
        .select('email, first_name')
        .eq('status', this.subscriberStatus.ACTIVE);

      if (subError) throw subError;

      // Create campaign for blog notification
      const campaign = await this.createCampaign({
        name: `New Blog Post: ${post.title}`,
        subject: `New Post: ${post.title}`,
        content: this.generateBlogNotificationContent(post),
        recipient_count: subscribers.length,
        metadata: { post_id: postId, type: 'blog_notification' }
      });

      // Here you would integrate with your email service provider
      // For now, we'll just log the campaign creation
      console.log(`Blog notification campaign created: ${campaign.id}`);

      return campaign;
    } catch (error) {
      console.error('Error sending blog notification:', error);
      throw error;
    }
  }

  /**
   * Generate blog notification email content
   */
  generateBlogNotificationContent(post) {
    return `
      <h2>New Blog Post: ${post.title}</h2>
      <p>By ${post.author.full_name} in ${post.category.name}</p>
      
      ${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
      
      <p><a href="${process.env.REACT_APP_SITE_URL}/blog/${post.slug}" 
           style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Read Full Post
      </a></p>
      
      <hr>
      <p><small>
        <a href="${process.env.REACT_APP_SITE_URL}/unsubscribe?email={{email}}&token={{unsubscribe_token}}">
          Unsubscribe
        </a>
      </small></p>
    `;
  }

  /**
   * Get subscription statistics
   */
  async getSubscriptionStats() {
    try {
      const canView = await authService.canPerform(authService.permissions.VIEW_ANALYTICS);
      if (!canView) {
        throw new Error('Insufficient permissions to view analytics');
      }

      const { data, error } = await supabase.rpc('get_subscription_stats');
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      throw error;
    }
  }

  /**
   * Export subscribers
   */
  async exportSubscribers(format = 'csv', filters = {}) {
    try {
      const canManage = await authService.canPerform(authService.permissions.MANAGE_USERS);
      if (!canManage) {
        throw new Error('Insufficient permissions to export subscribers');
      }

      const { data: subscribers } = await this.getSubscribers({
        ...filters,
        limit: 10000 // Large limit for export
      });

      if (format === 'csv') {
        return this.convertToCSV(subscribers.subscribers);
      }

      return subscribers.subscribers;
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      throw error;
    }
  }

  /**
   * Convert subscribers to CSV format
   */
  convertToCSV(subscribers) {
    const headers = ['Email', 'First Name', 'Last Name', 'Status', 'Subscribed At', 'Source'];
    const rows = subscribers.map(sub => [
      sub.email,
      sub.first_name || '',
      sub.last_name || '',
      sub.status,
      sub.subscribed_at,
      sub.source || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// Create singleton instance
const subscriptionService = new SubscriptionService();

export default subscriptionService;