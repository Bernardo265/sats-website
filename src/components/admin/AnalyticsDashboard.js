import React, { useState, useEffect } from 'react';
import { getAnalyticsOverview, getTopPosts, getCategoryPerformance, exportAnalytics } from '../../utils/analytics';

const AnalyticsDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const overviewData = getAnalyticsOverview();
      const topPostsData = getTopPosts(10, 'views');
      const categoryData = getCategoryPerformance();

      setOverview(overviewData);
      setTopPosts(topPostsData);
      setCategoryPerformance(categoryData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    const data = exportAnalytics(format);
    const blob = new Blob([data], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safesats-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-400"
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
            <option value="1d">Today</option>
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">{overview?.totalViews || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Reads</p>
              <p className="text-2xl font-bold text-white">{overview?.totalReads || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Engagement Rate</p>
              <p className="text-2xl font-bold text-white">{Math.round(overview?.overallEngagement || 0)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Read Time</p>
              <p className="text-2xl font-bold text-white">{Math.round(overview?.averageReadTime || 0)}s</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Posts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-sm font-medium py-3">Title</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Category</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Views</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Reads</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Engagement</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Avg. Read Time</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post, index) => (
                <tr key={post.slug} className="border-b border-gray-700/50">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                      <span className="text-white font-medium">{post.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 text-white">{post.views}</td>
                  <td className="py-3 text-white">{post.reads}</td>
                  <td className="py-3">
                    <span className={`text-sm font-medium ${
                      post.engagementScore > 50 ? 'text-green-400' : 
                      post.engagementScore > 25 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {Math.round(post.engagementScore)}%
                    </span>
                  </td>
                  <td className="py-3 text-white">{Math.round(post.averageReadTime)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryPerformance.map((category) => (
            <div key={category.name} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium capitalize">{category.name}</h4>
                <span className="text-gray-400 text-sm">{category.posts} posts</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Views:</span>
                  <span className="text-white">{category.views}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reads:</span>
                  <span className="text-white">{category.reads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Engagement:</span>
                  <span className={`${
                    category.engagementScore > 50 ? 'text-green-400' : 
                    category.engagementScore > 25 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {Math.round(category.engagementScore)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
