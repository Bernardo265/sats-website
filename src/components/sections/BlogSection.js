import React from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../../contexts/CMSContext';

function BlogSection() {
  const { getPublishedBlogPosts } = useCMS();
  const allPosts = getPublishedBlogPosts();
  const blogPosts = allPosts.slice(0, 3); // Show only first 3 posts

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
        return 'from-green-400 to-green-600';
      case 'gradient-blue':
        return 'from-blue-500 to-purple-600';
      case 'gradient-orange':
        return 'from-orange-400 to-red-500';
      case 'gradient-purple':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-green-400 to-green-600';
    }
  };

  return (
    <section className="relative z-10 px-6 py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Latest <span className="text-green-400">News & Updates</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Stay informed with the latest Bitcoin trends, SafeSats updates, and cryptocurrency insights.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-green-400/30 transition-all duration-300 group">
              <div className={`h-48 bg-gradient-to-br ${getGradientClass(post.featuredImage)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(post.categoryColor)}`}>
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">{post.date}</p>
                  <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-green-400 hover:text-green-300 font-semibold transition-colors flex items-center space-x-2"
                >
                  <span>Read More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="bg-green-400 hover:bg-green-500 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
