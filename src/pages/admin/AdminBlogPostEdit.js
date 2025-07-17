import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCMS } from '../../contexts/CMSContext';

function AdminBlogPostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogPost, createBlogPost, updateBlogPost, categories, generateSlug } = useCMS();
  
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    categoryColor: 'green',
    author: '',
    readTime: '',
    featuredImage: 'gradient-green',
    published: false
  });

  // Load post data if editing
  useEffect(() => {
    if (isEditing) {
      const post = getBlogPost(id);
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          categoryColor: post.categoryColor,
          author: post.author,
          readTime: post.readTime,
          featuredImage: post.featuredImage,
          published: post.published
        });
      } else {
        setError('Post not found');
      }
      setLoading(false);
    }
  }, [id, isEditing, getBlogPost]);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !isEditing) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  }, [formData.title, isEditing, generateSlug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleCategoryChange = (e) => {
    const categorySlug = e.target.value;
    const category = categories.find(cat => cat.slug === categorySlug);
    setFormData(prev => ({
      ...prev,
      category: categorySlug,
      categoryColor: category ? category.color : 'green'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const postData = {
        ...formData,
        date: isEditing ? formData.date : new Date().toISOString().split('T')[0]
      };

      let result;
      if (isEditing) {
        result = updateBlogPost(id, postData);
      } else {
        result = createBlogPost(postData);
      }

      if (result.success) {
        navigate('/admin/blog-posts');
      } else {
        setError(result.error || 'Failed to save post');
      }
    } catch (err) {
      setError('An error occurred while saving the post');
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block', 'link'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-gray-400 mt-2">
            {isEditing ? 'Update your blog post' : 'Write a new blog article'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/blog-posts')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Posts
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-400/20 border border-red-400/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 space-y-6">
          <h2 className="text-xl font-semibold text-white">Basic Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                placeholder="post-url-slug"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                placeholder="Author name"
              />
            </div>

            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-300 mb-2">
                Read Time
              </label>
              <input
                type="text"
                id="readTime"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                placeholder="5 min read"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-300 mb-2">
                Featured Image
              </label>
              <select
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
              >
                <option value="gradient-green">Green Gradient</option>
                <option value="gradient-blue">Blue Gradient</option>
                <option value="gradient-orange">Orange Gradient</option>
                <option value="gradient-purple">Purple Gradient</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 resize-vertical"
              placeholder="Brief description of the post..."
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Content</h2>
          <div className="bg-white rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              formats={quillFormats}
              style={{ minHeight: '300px' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400 focus:ring-2"
                />
                <span className="text-gray-300">Publish immediately</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/blog-posts')}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-green-400 hover:bg-green-500 disabled:bg-gray-600 text-black disabled:text-gray-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminBlogPostEdit;
