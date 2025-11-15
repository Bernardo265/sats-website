import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogService from '../../services/blogService';
import commentService from '../../services/commentService';
import { useAuth } from '../../contexts/AuthContext';
import {
  CalendarIcon,
  UserIcon,
  TagIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  ClockIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const BlogPost = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState({
    content: '',
    authorName: '',
    authorEmail: '',
    authorWebsite: ''
  });
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    loadPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      loadComments();
      // Track page view
      trackPageView();
    }
  }, [post]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await blogService.getPost(slug, true);
      setPost(postData);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await commentService.getPostComments(post.id, {
        status: 'approved',
        sortBy: 'created_at',
        sortOrder: 'asc'
      });
      setComments(commentsData.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const trackPageView = async () => {
    try {
      // Track analytics (implement based on your analytics service)
      // await analyticsService.trackPageView(post.id);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');

    if (!newComment.content.trim()) {
      setCommentError('Comment content is required');
      return;
    }

    if (!user && (!newComment.authorName || !newComment.authorEmail)) {
      setCommentError('Name and email are required');
      return;
    }

    try {
      setCommentLoading(true);
      
      const commentData = {
        postId: post.id,
        content: newComment.content,
        authorName: newComment.authorName,
        authorEmail: newComment.authorEmail,
        authorWebsite: newComment.authorWebsite
      };

      await commentService.createComment(commentData);
      
      // Reset form
      setNewComment({
        content: '',
        authorName: '',
        authorEmail: '',
        authorWebsite: ''
      });

      // Show success message
      alert('Comment submitted for moderation. It will appear after approval.');
      
    } catch (error) {
      setCommentError(error.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = async (platform) => {
    const url = window.location.href;
    const title = post.title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} | SafeSats Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <meta name="keywords" content={post.meta_keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.og_title || post.title} />
        <meta property="og:description" content={post.og_description || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.og_image && <meta property="og:image" content={post.og_image.file_url} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.featured_image && <meta name="twitter:image" content={post.featured_image.file_url} />}
        
        {/* Article specific */}
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content={post.author.full_name} />
        {post.category && <meta property="article:section" content={post.category.name} />}
        {post.tags && post.tags.map(tag => (
          <meta key={tag.blog_tags.id} property="article:tag" content={tag.blog_tags.name} />
        ))}
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <div className="mb-4">
              <Link
                to={`/blog/category/${post.category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${post.category.color}20`,
                  color: post.category.color 
                }}
              >
                {post.category.name}
              </Link>
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-2" />
              <span>{post.author.full_name}</span>
            </div>
            
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            
            {post.reading_time && (
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
            
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-2" />
              <span>{post.view_count} views</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8">
            <img
              src={post.featured_image.file_url}
              alt={post.featured_image.alt_text || post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center flex-wrap gap-2">
              <TagIcon className="h-4 w-4 text-gray-400" />
              {post.tags.map(tag => (
                <Link
                  key={tag.blog_tags.id}
                  to={`/blog/tag/${tag.blog_tags.slug}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  {tag.blog_tags.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="border-t border-b border-gray-200 py-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Share this post</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => sharePost('twitter')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Twitter
              </button>
              <button
                onClick={() => sharePost('facebook')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Facebook
              </button>
              <button
                onClick={() => sharePost('linkedin')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                LinkedIn
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {post.allow_comments && (
          <section className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="space-y-4">
                {!user && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={newComment.authorName}
                        onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newComment.authorEmail}
                        onChange={(e) => setNewComment({ ...newComment, authorEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment *
                  </label>
                  <textarea
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>

                {commentError && (
                  <div className="text-red-600 text-sm">{commentError}</div>
                )}

                <button
                  type="submit"
                  disabled={commentLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                >
                  {commentLoading ? 'Submitting...' : 'Post Comment'}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {comment.author_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{comment.author_name}</p>
                        <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-700">{comment.content}</div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </section>
        )}
      </article>
    </>
  );
};

export default BlogPost;
