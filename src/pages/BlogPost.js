import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMS } from '../contexts/CMSContext';

function BlogPost() {
  const { slug } = useParams();
  const { getBlogPostBySlug, getPublishedBlogPosts } = useCMS();

  const blogPost = getBlogPostBySlug(slug);
  const allPosts = getPublishedBlogPosts();

  // Get related posts (same category, excluding current post)
  const relatedPosts = allPosts
    .filter(post => post.category === blogPost?.category && post.slug !== slug)
    .slice(0, 2);

  if (!blogPost) {
    return (
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-300 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

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

  const getGradientClass = (featuredImage) => {
    switch (featuredImage) {
      case 'gradient-green':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'gradient-blue':
        return 'bg-gradient-to-br from-blue-500 to-purple-600';
      case 'gradient-orange':
        return 'bg-gradient-to-br from-orange-400 to-red-500';
      case 'gradient-purple':
        return 'bg-gradient-to-br from-purple-500 to-pink-600';
      default:
        return 'bg-gradient-to-br from-green-400 to-green-600';
    }
  };

  return (
    <div className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-12">
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(blogPost.categoryColor)} mb-4`}>
              {blogPost.category}
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {blogPost.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>By {blogPost.author}</span>
              <span>•</span>
              <span>{blogPost.date}</span>
              <span>•</span>
              <span>{blogPost.readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="h-64 md:h-96 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-lg opacity-60">Featured Article Image</p>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <div 
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
            style={{
              color: '#d1d5db',
              lineHeight: '1.75'
            }}
          />
        </div>

        {/* Article Footer */}
        <div className="mt-12 space-y-8">
          {/* Share Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Share on Twitter
              </button>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg transition-colors">
                Share on Facebook
              </button>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors">
                Share on LinkedIn
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-700/30 transition-colors">
                      <div className={`w-16 h-16 ${getGradientClass(post.featuredImage)} rounded-lg flex-shrink-0`}></div>
                      <div>
                        <h4 className="text-white font-medium group-hover:text-green-400 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{post.excerpt.substring(0, 80)}...</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-2xl p-8 border border-green-400/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest Bitcoin insights and SafeSats updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
              />
              <button className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
