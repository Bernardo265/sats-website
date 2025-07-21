import { supabase } from '../lib/supabase';
import authService from './authService';

/**
 * Media Management Service
 */
class MediaService {
  constructor() {
    this.bucketName = 'blog-media';
    this.allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      video: ['video/mp4', 'video/webm', 'video/ogg'],
      audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.maxImageSize = 5 * 1024 * 1024; // 5MB for images
  }

  /**
   * Get media type from MIME type
   */
  getMediaType(mimeType) {
    for (const [type, mimes] of Object.entries(this.allowedTypes)) {
      if (mimes.includes(mimeType)) {
        return type;
      }
    }
    return 'other';
  }

  /**
   * Validate file before upload
   */
  validateFile(file) {
    const errors = [];

    // Check file size
    const maxSize = this.getMediaType(file.type) === 'image' ? this.maxImageSize : this.maxFileSize;
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Check file type
    const mediaType = this.getMediaType(file.type);
    if (mediaType === 'other' && !Object.values(this.allowedTypes).flat().includes(file.type)) {
      errors.push('File type not supported');
    }

    return {
      isValid: errors.length === 0,
      errors,
      mediaType
    };
  }

  /**
   * Generate unique filename
   */
  generateFilename(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
  }

  /**
   * Upload file to Supabase storage
   */
  async uploadFile(file, options = {}) {
    try {
      // Check permissions
      const canUpload = await authService.canPerform(authService.permissions.UPLOAD_MEDIA);
      if (!canUpload) {
        throw new Error('Insufficient permissions to upload media');
      }

      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Generate filename
      const filename = this.generateFilename(file.name);
      const filePath = `${user.id}/${filename}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      // Get image dimensions if it's an image
      let width = null;
      let height = null;
      if (validation.mediaType === 'image') {
        try {
          const dimensions = await this.getImageDimensions(file);
          width = dimensions.width;
          height = dimensions.height;
        } catch (error) {
          console.warn('Could not get image dimensions:', error);
        }
      }

      // Save media record to database
      const mediaData = {
        filename,
        original_filename: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        media_type: validation.mediaType,
        width,
        height,
        alt_text: options.altText || '',
        caption: options.caption || '',
        uploaded_by: user.id,
        is_public: options.isPublic !== false,
        metadata: options.metadata || {}
      };

      const { data, error } = await supabase
        .from('media_library')
        .insert(mediaData)
        .select()
        .single();

      if (error) {
        // If database insert fails, clean up uploaded file
        await supabase.storage
          .from(this.bucketName)
          .remove([filePath]);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Get image dimensions
   */
  getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not load image'));
      };
      
      img.src = url;
    });
  }

  /**
   * Get media files with pagination and filters
   */
  async getMedia(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        mediaType = null,
        search = null,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('media_library')
        .select(`
          *,
          uploader:profiles!uploaded_by(id, full_name)
        `, { count: 'exact' });

      // Apply filters
      if (mediaType) {
        query = query.eq('media_type', mediaType);
      }

      if (search) {
        query = query.or(`original_filename.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        media: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error getting media:', error);
      throw error;
    }
  }

  /**
   * Get single media item
   */
  async getMediaItem(mediaId) {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select(`
          *,
          uploader:profiles!uploaded_by(id, full_name)
        `)
        .eq('id', mediaId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting media item:', error);
      throw error;
    }
  }

  /**
   * Update media item
   */
  async updateMedia(mediaId, updateData) {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .update(updateData)
        .eq('id', mediaId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating media:', error);
      throw error;
    }
  }

  /**
   * Delete media item
   */
  async deleteMedia(mediaId) {
    try {
      // Check permissions
      const canDelete = await authService.canPerform(authService.permissions.DELETE_MEDIA);
      if (!canDelete) {
        throw new Error('Insufficient permissions to delete media');
      }

      // Get media item
      const mediaItem = await this.getMediaItem(mediaId);
      if (!mediaItem) {
        throw new Error('Media item not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(this.bucketName)
        .remove([mediaItem.file_path]);

      if (storageError) {
        console.warn('Error deleting from storage:', storageError);
      }

      // Delete from database
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }

  /**
   * Bulk delete media items
   */
  async bulkDeleteMedia(mediaIds) {
    try {
      const canDelete = await authService.canPerform(authService.permissions.DELETE_MEDIA);
      if (!canDelete) {
        throw new Error('Insufficient permissions to delete media');
      }

      const results = [];
      
      for (const mediaId of mediaIds) {
        try {
          await this.deleteMedia(mediaId);
          results.push({ id: mediaId, success: true });
        } catch (error) {
          results.push({ id: mediaId, success: false, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk deleting media:', error);
      throw error;
    }
  }

  /**
   * Get media usage statistics
   */
  async getMediaStats() {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('media_type, file_size')
        .eq('is_public', true);

      if (error) throw error;

      const stats = {
        total: data.length,
        totalSize: data.reduce((sum, item) => sum + item.file_size, 0),
        byType: {}
      };

      // Group by media type
      data.forEach(item => {
        if (!stats.byType[item.media_type]) {
          stats.byType[item.media_type] = {
            count: 0,
            size: 0
          };
        }
        stats.byType[item.media_type].count++;
        stats.byType[item.media_type].size += item.file_size;
      });

      return stats;
    } catch (error) {
      console.error('Error getting media stats:', error);
      throw error;
    }
  }

  /**
   * Search media by filename or alt text
   */
  async searchMedia(query, mediaType = null) {
    try {
      let dbQuery = supabase
        .from('media_library')
        .select('*')
        .or(`original_filename.ilike.%${query}%,alt_text.ilike.%${query}%,caption.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (mediaType) {
        dbQuery = dbQuery.eq('media_type', mediaType);
      }

      const { data, error } = await dbQuery;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching media:', error);
      throw error;
    }
  }

  /**
   * Get recently uploaded media
   */
  async getRecentMedia(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting recent media:', error);
      throw error;
    }
  }
}

// Create singleton instance
const mediaService = new MediaService();

export default mediaService;
