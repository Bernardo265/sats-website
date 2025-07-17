import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../../contexts/CMSContext';

function AdminBlogPosts() {
  const { blogPosts, deleteBlogPost, updateBlogPost } = useCMS();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter posts based on status and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && post.published) ||
      (filter === 'draft' && !post.published);
    
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (postId) => {
    if (deleteConfirm === postId) {
      deleteBlogPost(postId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(postId);
    }
  };

  const handleTogglePublish = (post) => {
    updateBlogPost(post.id, { published: !post.published });
  };

  const getCategoryColor = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-400 text-black';
      case 'blue':
        return 'bg-blue-400 text-white';
      case 'orange':
        return 'bg-orange-400 text-white';
      case 'purple':
        return 'bg-purple-400 text-white';
      default:
        return 'bg-green-400 text-black';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 mt-2">Manage your blog content</p>
        </div>
        <Link
          to="/admin/blog-posts/new"
          className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Create New Post
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
            />
          </div>

          {/* Filter */}
          <div className="flex space-x-2">
            {['all', 'published', 'draft'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors capitalize ${
                  filter === filterOption
                    ? 'bg-green-400 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.categoryColor)}`}>
                        {post.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.published 
                          ? 'bg-green-400/20 text-green-400' 
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-3 line-clamp-2">{post.excerpt}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {/* Toggle Publish */}
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        post.published
                          ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
                          : 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                      }`}
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>

                    {/* Edit */}
                    <Link
                      to={`/admin/blog-posts/edit/${post.id}`}
                      className="px-3 py-2 bg-blue-400/20 text-blue-400 hover:bg-blue-400/30 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        deleteConfirm === post.id
                          ? 'bg-red-500 text-white'
                          : 'bg-red-400/20 text-red-400 hover:bg-red-400/30'
                      }`}
                    >
                      {deleteConfirm === post.id ? 'Confirm' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first blog post to get started.'
              }
            </p>
            {(!searchTerm && filter === 'all') && (
              <Link
                to="/admin/blog-posts/new"
                className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Create First Post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBlogPosts;
