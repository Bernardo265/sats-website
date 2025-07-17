import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../contexts/CMSContext';

function Blog() {
  const { getPublishedBlogPosts, categories } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = getPublishedBlogPosts();

  const categoryOptions = [
    { id: 'all', name: 'All Posts' },
    ...categories.map(cat => ({ id: cat.slug, name: cat.name }))
  ];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

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
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            SafeSats <span className="text-green-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Stay updated with the latest Bitcoin news, trading insights, security tips, 
            and company updates from the SafeSats team.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-green-400 text-black'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Featured Article</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-green-400/30 transition-all duration-300 group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className={`h-64 lg:h-auto ${getGradientClass(filteredPosts[0].featuredImage)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(filteredPosts[0].categoryColor)}`}>
                      {filteredPosts[0].category.charAt(0).toUpperCase() + filteredPosts[0].category.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{filteredPosts[0].author}</span>
                      <span>•</span>
                      <span>{filteredPosts[0].date}</span>
                      <span>•</span>
                      <span>{filteredPosts[0].readTime}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                      {filteredPosts[0].title}
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <Link
                    to={`/blog/${filteredPosts[0].slug}`}
                    className="inline-flex items-center text-green-400 hover:text-green-300 font-semibold transition-colors"
                  >
                    Read Full Article
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">
            {selectedCategory === 'all' ? 'All Articles' : `${categoryOptions.find(cat => cat.id === selectedCategory)?.name} Articles`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <div
                key={post.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-green-400/30 transition-all duration-300 group"
              >
                <div className={`h-48 ${getGradientClass(post.featuredImage)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(post.categoryColor)}`}>
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-green-400 hover:text-green-300 font-semibold text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-2xl p-8 border border-green-400/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest articles and insights delivered to your inbox.
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
  );
}

export default Blog;
