import React from 'react';
import { Link } from 'react-router-dom';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';

function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">
              Track content performance, user engagement, and reading analytics
            </p>
          </div>
          
          <Link
            to="/admin"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <AnalyticsDashboard />
        </div>

        {/* Analytics Information */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Understanding Your Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="text-white font-medium mb-2">Key Metrics</h4>
              <ul className="space-y-2">
                <li><strong>Views:</strong> Number of times a post page was loaded</li>
                <li><strong>Reads:</strong> Views where user spent 30+ seconds reading</li>
                <li><strong>Engagement Rate:</strong> Percentage of views that became reads</li>
                <li><strong>Average Read Time:</strong> Average time spent reading content</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Performance Indicators</h4>
              <ul className="space-y-2">
                <li><strong className="text-green-400">High Engagement (50%+):</strong> Excellent content performance</li>
                <li><strong className="text-yellow-400">Medium Engagement (25-50%):</strong> Good content with room for improvement</li>
                <li><strong className="text-red-400">Low Engagement (&lt;25%):</strong> Content may need optimization</li>
                <li><strong>Reading Progress:</strong> Tracked automatically on blog posts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/blog-posts"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-400 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Manage Posts</h3>
                <p className="text-gray-400 text-sm">Create and edit blog posts</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-400 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Categories</h3>
                <p className="text-gray-400 text-sm">Organize content categories</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/media"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-400 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Media Library</h3>
                <p className="text-gray-400 text-sm">Manage uploaded files</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
