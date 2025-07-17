import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CMSProvider, useCMS } from '../contexts/CMSContext';

// Test component that uses the CMS context
const TestComponent = () => {
  const { 
    blogPosts, 
    categories, 
    isAuthenticated, 
    login, 
    logout,
    createBlogPost,
    getPublishedBlogPosts 
  } = useCMS();

  return (
    <div>
      <div data-testid="blog-posts-count">{blogPosts.length}</div>
      <div data-testid="categories-count">{categories.length}</div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="published-posts-count">{getPublishedBlogPosts().length}</div>
      <button onClick={() => login('admin', 'admin123')} data-testid="login-btn">
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
      <button 
        onClick={() => createBlogPost({
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test excerpt',
          content: 'Test content',
          category: 'bitcoin',
          categoryColor: 'green',
          author: 'Test Author',
          readTime: '5 min read',
          featuredImage: 'gradient-green',
          published: true
        })}
        data-testid="create-post-btn"
      >
        Create Post
      </button>
    </div>
  );
};

const renderWithCMSProvider = (component) => {
  return render(
    <CMSProvider>
      {component}
    </CMSProvider>
  );
};

describe('CMSContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('provides initial data', () => {
    renderWithCMSProvider(<TestComponent />);
    
    // Should have default blog posts and categories
    expect(screen.getByTestId('blog-posts-count')).toHaveTextContent('3');
    expect(screen.getByTestId('categories-count')).toHaveTextContent('5');
    expect(screen.getByTestId('published-posts-count')).toHaveTextContent('3');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  test('authentication works', () => {
    renderWithCMSProvider(<TestComponent />);
    
    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    
    // Login with correct credentials
    act(() => {
      screen.getByTestId('login-btn').click();
    });
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    
    // Logout
    act(() => {
      screen.getByTestId('logout-btn').click();
    });
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  test('creating blog posts works', () => {
    renderWithCMSProvider(<TestComponent />);
    
    // Initial count
    expect(screen.getByTestId('blog-posts-count')).toHaveTextContent('3');
    expect(screen.getByTestId('published-posts-count')).toHaveTextContent('3');
    
    // Create a new post
    act(() => {
      screen.getByTestId('create-post-btn').click();
    });
    
    // Count should increase
    expect(screen.getByTestId('blog-posts-count')).toHaveTextContent('4');
    expect(screen.getByTestId('published-posts-count')).toHaveTextContent('4');
  });

  test('persists authentication state', () => {
    // Set up authentication in localStorage
    const authData = {
      user: { id: 'user-1', username: 'admin', email: 'admin@safesats.com', role: 'admin', name: 'Admin User' },
      timestamp: Date.now()
    };
    localStorage.setItem('safesats_cms_auth', JSON.stringify(authData));
    
    renderWithCMSProvider(<TestComponent />);
    
    // Should be authenticated on initial render
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
  });

  test('clears expired authentication', () => {
    // Set up expired authentication in localStorage
    const authData = {
      user: { id: 'user-1', username: 'admin', email: 'admin@safesats.com', role: 'admin', name: 'Admin User' },
      timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago (expired)
    };
    localStorage.setItem('safesats_cms_auth', JSON.stringify(authData));
    
    renderWithCMSProvider(<TestComponent />);
    
    // Should not be authenticated due to expiration
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    
    // localStorage should be cleared
    expect(localStorage.getItem('safesats_cms_auth')).toBeNull();
  });
});

describe('CMS Storage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('data persists across component remounts', () => {
    const { unmount } = renderWithCMSProvider(<TestComponent />);
    
    // Create a post
    act(() => {
      screen.getByTestId('create-post-btn').click();
    });
    
    expect(screen.getByTestId('blog-posts-count')).toHaveTextContent('4');
    
    // Unmount and remount
    unmount();
    renderWithCMSProvider(<TestComponent />);
    
    // Data should persist
    expect(screen.getByTestId('blog-posts-count')).toHaveTextContent('4');
  });
});
