import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import commentService from '../../services/commentService';
import { usePermissions } from './AdminRoute';
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PhotoIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { hasPermission } = usePermissions();
  const [stats, setStats] = useState({
    blog: null,
    comments: null
  });
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const [pendingComments, setPendingComments] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const promises = [];

      // Load blog stats if user has permission
      if (hasPermission('view_analytics')) {
        promises.push(blogService.getBlogStats());
      }

      // Load comment stats if user can moderate
      if (hasPermission('moderate_comments')) {
        promises.push(commentService.getCommentStats());
        promises.push(commentService.getPendingCommentsCount());
      }

      // Load recent posts
      promises.push(blogService.getPosts({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' }));

      const results = await Promise.allSettled(promises);
      
      let resultIndex = 0;
      
      if (hasPermission('view_analytics')) {
        const blogStatsResult = results[resultIndex++];
        if (blogStatsResult.status === 'fulfilled') {
          setStats(prev => ({ ...prev, blog: blogStatsResult.value }));
        }
      }

      if (hasPermission('moderate_comments')) {
        const commentStatsResult = results[resultIndex++];
        if (commentStatsResult.status === 'fulfilled') {
          setStats(prev => ({ ...prev, comments: commentStatsResult.value }));
        }

        const pendingCommentsResult = results[resultIndex++];
        if (pendingCommentsResult.status === 'fulfilled') {
          setPendingComments(pendingCommentsResult.value);
        }
      }

      const recentPostsResult = results[resultIndex++];
      if (recentPostsResult.status === 'fulfilled') {
        setRecentPosts(recentPostsResult.value.posts);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', change = null, href = null }) => {
    const content = (
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value || '—'}
                  </div>
                  {change && (
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {change > 0 ? '+' : ''}{change}%
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    );

    return href ? <Link to={href}>{content}</Link> : content;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', icon: CheckIcon },
      draft: { color: 'bg-gray-100 text-gray-800', icon: DocumentTextIcon },
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your blog content and performance
        </p>
      </div>

      {/* Stats Grid */}
      {hasPermission('view_analytics') && stats.blog && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Posts"
            value={stats.blog.total_posts}
            icon={DocumentTextIcon}
            color="blue"
            href="/admin/posts"
          />
          <StatCard
            title="Published Posts"
            value={stats.blog.published_posts}
            icon={CheckIcon}
            color="green"
            href="/admin/posts?status=published"
          />
          <StatCard
            title="Draft Posts"
            value={stats.blog.draft_posts}
            icon={DocumentTextIcon}
            color="gray"
            href="/admin/posts?status=draft"
          />
          <StatCard
            title="Total Views"
            value={stats.blog.total_views}
            icon={EyeIcon}
            color="purple"
          />
        </div>
      )}

      {/* Comments Stats */}
      {hasPermission('moderate_comments') && stats.comments && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Comments"
            value={stats.comments.total}
            icon={ChatBubbleLeftRightIcon}
            color="blue"
            href="/admin/comments"
          />
          <StatCard
            title="Pending Moderation"
            value={stats.comments.pending}
            icon={ExclamationTriangleIcon}
            color="yellow"
            href="/admin/comments?status=pending"
          />
          <StatCard
            title="Comments Today"
            value={stats.comments.today}
            icon={ArrowTrendingUpIcon}
            color="green"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
            <Link
              to="/admin/posts"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/admin/posts/${post.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-orange-600 truncate block"
                      >
                        {post.title}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {formatDate(post.created_at)} • {post.author?.full_name || 'Unknown'}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {getStatusBadge(post.status)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No posts</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
                {hasPermission('create_post') && (
                  <div className="mt-6">
                    <Link
                      to="/admin/posts/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      New Post
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {hasPermission('create_post') && (
                <Link
                  to="/admin/posts/new"
                  className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <PlusIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Create New Post</p>
                      <p className="text-sm text-gray-500">Write and publish a new blog post</p>
                    </div>
                  </div>
                </Link>
              )}

              {hasPermission('manage_prices') && (
                <Link
                  to="/admin/price-management"
                  className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manage Bitcoin Price</p>
                      <p className="text-sm text-gray-500">Override and monitor Bitcoin price data</p>
                    </div>
                  </div>
                </Link>
              )}

              {hasPermission('moderate_comments') && pendingComments > 0 && (
                <Link
                  to="/admin/comments?status=pending"
                  className="block w-full text-left px-4 py-3 border border-yellow-300 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Moderate Comments ({pendingComments})
                      </p>
                      <p className="text-sm text-gray-500">Review pending comments</p>
                    </div>
                  </div>
                </Link>
              )}

              {hasPermission('upload_media') && (
                <Link
                  to="/admin/media"
                  className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <PhotoIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Media Library</p>
                      <p className="text-sm text-gray-500">Manage images and files</p>
                    </div>
                  </div>
                </Link>
              )}

              {hasPermission('manage_categories') && (
                <Link
                  to="/admin/categories"
                  className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manage Categories</p>
                      <p className="text-sm text-gray-500">Organize your content</p>
                    </div>
                  </div>
                </Link>
              )}

              {hasPermission('view_analytics') && (
                <Link
                  to="/admin/analytics"
                  className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">View Analytics</p>
                      <p className="text-sm text-gray-500">Detailed performance metrics</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
