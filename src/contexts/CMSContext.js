import React, { createContext, useContext, useState, useEffect } from 'react';
import cmsStorage from '../utils/cmsStorage';

const CMSContext = createContext();

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

export const CMSProvider = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadBlogPosts();
    loadCategories();
    checkAuthentication();
    setLoading(false);
  }, []);

  // Blog Posts Methods
  const loadBlogPosts = () => {
    const posts = cmsStorage.getBlogPosts();
    setBlogPosts(posts);
  };

  const createBlogPost = (postData) => {
    try {
      const newPost = cmsStorage.addBlogPost(postData);
      loadBlogPosts(); // Reload to get updated list
      return { success: true, post: newPost };
    } catch (error) {
      console.error('Error creating blog post:', error);
      return { success: false, error: error.message };
    }
  };

  const updateBlogPost = (id, updates) => {
    try {
      const updatedPost = cmsStorage.updateBlogPost(id, updates);
      if (updatedPost) {
        loadBlogPosts(); // Reload to get updated list
        return { success: true, post: updatedPost };
      }
      return { success: false, error: 'Post not found' };
    } catch (error) {
      console.error('Error updating blog post:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteBlogPost = (id) => {
    try {
      cmsStorage.deleteBlogPost(id);
      loadBlogPosts(); // Reload to get updated list
      return { success: true };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return { success: false, error: error.message };
    }
  };

  const getBlogPost = (id) => {
    return cmsStorage.getBlogPost(id);
  };

  const getBlogPostBySlug = (slug) => {
    return cmsStorage.getBlogPostBySlug(slug);
  };

  const getPublishedBlogPosts = () => {
    return blogPosts.filter(post => post.published);
  };

  const getBlogPostsByCategory = (category) => {
    return blogPosts.filter(post => post.category === category && post.published);
  };

  // Categories Methods
  const loadCategories = () => {
    const cats = cmsStorage.getCategories();
    setCategories(cats);
  };

  const createCategory = (categoryData) => {
    try {
      const newCategory = cmsStorage.addCategory(categoryData);
      loadCategories(); // Reload to get updated list
      return { success: true, category: newCategory };
    } catch (error) {
      console.error('Error creating category:', error);
      return { success: false, error: error.message };
    }
  };

  // Authentication Methods
  const checkAuthentication = () => {
    const authData = localStorage.getItem('safesats_cms_auth');
    if (authData) {
      try {
        const { user, timestamp } = JSON.parse(authData);
        // Check if session is still valid (24 hours)
        const isValid = Date.now() - timestamp < 24 * 60 * 60 * 1000;
        if (isValid) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  };

  const login = (username, password) => {
    try {
      const user = cmsStorage.authenticateUser(username, password);
      if (user) {
        const authData = {
          user: { ...user, password: undefined }, // Don't store password
          timestamp: Date.now()
        };
        localStorage.setItem('safesats_cms_auth', JSON.stringify(authData));
        setCurrentUser(authData.user);
        setIsAuthenticated(true);
        return { success: true, user: authData.user };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('safesats_cms_auth');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Utility Methods
  const generateSlug = (title) => {
    return cmsStorage.generateSlug(title);
  };

  const value = {
    // State
    blogPosts,
    categories,
    isAuthenticated,
    currentUser,
    loading,

    // Blog Posts Methods
    loadBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogPost,
    getBlogPostBySlug,
    getPublishedBlogPosts,
    getBlogPostsByCategory,

    // Categories Methods
    loadCategories,
    createCategory,

    // Authentication Methods
    login,
    logout,
    checkAuthentication,

    // Utility Methods
    generateSlug
  };

  return (
    <CMSContext.Provider value={value}>
      {children}
    </CMSContext.Provider>
  );
};

export default CMSContext;
