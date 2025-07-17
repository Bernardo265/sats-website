import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../../contexts/CMSContext';
import { getAnalyticsOverview, initializeAnalytics } from '../../utils/analytics';

function AdminDashboard() {
  const { blogPosts, categories, getPublishedBlogPosts } = useCMS();
  const [analytics, setAnalytics] = useState(null);

  const publishedPosts = getPublishedBlogPosts();
  const draftPosts = blogPosts.filter(post => !post.published);

  useEffect(() => {
    initializeAnalytics();
    const analyticsData = getAnalyticsOverview();
    setAnalytics(analyticsData);
  }, []);
  const totalPosts = blogPosts.length;
  const totalCategories = categories.length;

  const recentPosts = blogPosts
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Posts',
      value: totalPosts,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      title: 'Published',
      value: publishedPosts.length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      title: 'Drafts',
      value: draftPosts.length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-yellow-500'
    },
    {
      title: 'Categories',
      value: totalCategories,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    {
      title: 'Total Views',
      value: analytics?.totalViews || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      title: 'Engagement',
      value: `${Math.round(analytics?.overallEngagement || 0)}%`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome to the SafeSats Content Management System</p>
        </div>
        <Link
          to="/admin/blog-posts/new"
          className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Create New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/blog-posts/new"
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-green-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-400/20 p-3 rounded-lg group-hover:bg-green-400/30 transition-colors">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Create New Post</h3>
              <p className="text-gray-400 text-sm">Write a new blog article</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/blog-posts"
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-400/20 p-3 rounded-lg group-hover:bg-blue-400/30 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Manage Posts</h3>
              <p className="text-gray-400 text-sm">Edit existing blog posts</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-400/20 p-3 rounded-lg group-hover:bg-purple-400/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Manage Categories</h3>
              <p className="text-gray-400 text-sm">Organize post categories</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-orange-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-orange-400/20 p-3 rounded-lg group-hover:bg-orange-400/30 transition-colors">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">View Analytics</h3>
              <p className="text-gray-400 text-sm">Track content performance</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Posts */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Posts</h2>
          <Link
            to="/admin/blog-posts"
            className="text-green-400 hover:text-green-300 text-sm transition-colors"
          >
            View All →
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{post.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-400 text-sm">By {post.author}</span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.published 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/admin/blog-posts/edit/${post.id}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No blog posts yet. Create your first post!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
