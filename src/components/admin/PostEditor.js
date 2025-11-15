import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import MediaLibrary from './MediaLibrary';
import blogService from '../../services/blogService';
import mediaService from '../../services/mediaService';
import { usePermissions } from './AdminRoute';
import {
  PhotoIcon,
  EyeIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const isEditing = Boolean(id);

  const [post, setPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    category_id: '',
    featured_image_id: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    allow_comments: true,
    is_featured: false,
    scheduled_at: ''
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load categories and tags
      const [categoriesData, tagsData] = await Promise.all([
        blogService.getCategories(true),
        blogService.getTags(true)
      ]);

      setCategories(categoriesData);
      setTags(tagsData);

      // Load post if editing
      if (isEditing) {
        const postData = await blogService.getPost(id);
        setPost({
          ...postData,
          scheduled_at: postData.scheduled_at ? 
            new Date(postData.scheduled_at).toISOString().slice(0, 16) : ''
        });

        // Set selected tags
        if (postData.tags) {
          setSelectedTags(postData.tags.map(tag => tag.blog_tags.id));
        }

        // Set featured image
        if (postData.featured_image) {
          setFeaturedImage(postData.featured_image);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePost = () => {
    const newErrors = {};

    if (!post.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!post.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (post.status === 'scheduled' && !post.scheduled_at) {
      newErrors.scheduled_at = 'Scheduled date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status = null) => {
    if (!validatePost()) return;

    try {
      setSaving(true);

      const postData = {
        ...post,
        status: status || post.status,
        tags: selectedTags,
        scheduled_at: post.scheduled_at || null
      };

      let savedPost;
      if (isEditing) {
        savedPost = await blogService.updatePost(id, postData);
      } else {
        savedPost = await blogService.createPost(postData);
      }

      navigate(`/admin/posts/${savedPost.id}`);
    } catch (error) {
      console.error('Error saving post:', error);
      setErrors({ general: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    handleSave('published');
  };

  const handleSchedule = () => {
    if (!post.scheduled_at) {
      setErrors({ scheduled_at: 'Please select a date and time' });
      return;
    }
    handleSave('scheduled');
  };

  const handleMediaSelect = (media) => {
    setPost({ ...post, featured_image_id: media.id });
    setFeaturedImage(media);
    setShowMediaLibrary(false);
  };

  const removeFeaturedImage = () => {
    setPost({ ...post, featured_image_id: '' });
    setFeaturedImage(null);
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
      </div>

      {errors.general && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter post title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="auto-generated-from-title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Brief description of the post"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              value={post.content}
              onChange={(content) => setPost({ ...post, content })}
              placeholder="Write your post content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={post.meta_title}
                  onChange={(e) => setPost({ ...post, meta_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="SEO title (60 characters max)"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={post.meta_description}
                  onChange={(e) => setPost({ ...post, meta_description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="SEO description (160 characters max)"
                  maxLength={160}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={post.meta_keywords}
                  onChange={(e) => setPost({ ...post, meta_keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Publish</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-medium capitalize">{post.status}</span>
              </div>

              {post.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    value={post.scheduled_at}
                    onChange={(e) => setPost({ ...post, scheduled_at: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.scheduled_at ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.scheduled_at && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduled_at}</p>
                  )}
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Save Draft
                </button>

                {hasPermission('publish_post') && (
                  <>
                    <button
                      onClick={handlePublish}
                      disabled={saving}
                      className="w-full px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                      {saving ? 'Publishing...' : 'Publish Now'}
                    </button>

                    <button
                      onClick={handleSchedule}
                      disabled={saving}
                      className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      Schedule
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Featured Image</h3>
            
            {featuredImage ? (
              <div className="space-y-3">
                <img
                  src={featuredImage.file_url}
                  alt={featuredImage.alt_text}
                  className="w-full h-32 object-cover rounded-md"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowMediaLibrary(true)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Change
                  </button>
                  <button
                    onClick={removeFeaturedImage}
                    className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowMediaLibrary(true)}
                className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 text-center"
              >
                <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Select Featured Image</p>
              </button>
            )}
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Category</h3>
            <select
              value={post.category_id}
              onChange={(e) => setPost({ ...post, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Tags</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tags.map(tag => (
                <label key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Post Options */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Options</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={post.allow_comments}
                  onChange={(e) => setPost({ ...post, allow_comments: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Allow Comments</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={post.is_featured}
                  onChange={(e) => setPost({ ...post, is_featured: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Post</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaLibrary(false)}
          mode="select"
        />
      )}
    </div>
  );
};

export default PostEditor;
