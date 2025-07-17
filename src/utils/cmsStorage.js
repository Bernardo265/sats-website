// CMS Storage utility for managing blog posts in localStorage
class CMSStorage {
  constructor() {
    this.BLOG_POSTS_KEY = 'safesats_blog_posts';
    this.CATEGORIES_KEY = 'safesats_categories';
    this.USERS_KEY = 'safesats_cms_users';
    this.initializeDefaultData();
  }

  // Initialize default data if none exists
  initializeDefaultData() {
    if (!this.getBlogPosts().length) {
      this.setBlogPosts(this.getDefaultBlogPosts());
    }
    if (!this.getCategories().length) {
      this.setCategories(this.getDefaultCategories());
    }
    if (!this.getUsers().length) {
      this.setUsers(this.getDefaultUsers());
    }
  }

  // Blog Posts Management
  getBlogPosts() {
    try {
      const posts = localStorage.getItem(this.BLOG_POSTS_KEY);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('Error loading blog posts:', error);
      return [];
    }
  }

  setBlogPosts(posts) {
    try {
      localStorage.setItem(this.BLOG_POSTS_KEY, JSON.stringify(posts));
      return true;
    } catch (error) {
      console.error('Error saving blog posts:', error);
      return false;
    }
  }

  getBlogPost(id) {
    const posts = this.getBlogPosts();
    return posts.find(post => post.id === id);
  }

  getBlogPostBySlug(slug) {
    const posts = this.getBlogPosts();
    return posts.find(post => post.slug === slug);
  }

  addBlogPost(post) {
    const posts = this.getBlogPosts();
    const newPost = {
      ...post,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    posts.push(newPost);
    this.setBlogPosts(posts);
    return newPost;
  }

  updateBlogPost(id, updates) {
    const posts = this.getBlogPosts();
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
      posts[index] = {
        ...posts[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setBlogPosts(posts);
      return posts[index];
    }
    return null;
  }

  deleteBlogPost(id) {
    const posts = this.getBlogPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    this.setBlogPosts(filteredPosts);
    return true;
  }

  // Categories Management
  getCategories() {
    try {
      const categories = localStorage.getItem(this.CATEGORIES_KEY);
      return categories ? JSON.parse(categories) : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  setCategories(categories) {
    try {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
      return true;
    } catch (error) {
      console.error('Error saving categories:', error);
      return false;
    }
  }

  addCategory(category) {
    const categories = this.getCategories();
    const newCategory = {
      ...category,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    categories.push(newCategory);
    this.setCategories(categories);
    return newCategory;
  }

  // Users Management (for admin authentication)
  getUsers() {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  setUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  authenticateUser(username, password) {
    const users = this.getUsers();
    return users.find(user => user.username === username && user.password === password);
  }

  // Utility Methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Default Data
  getDefaultBlogPosts() {
    return [
      {
        id: 'post-1',
        title: 'Bitcoin Reaches New All-Time High: What This Means for Investors',
        slug: 'bitcoin-reaches-new-all-time-high',
        excerpt: 'Explore the factors driving Bitcoin\'s latest surge and how SafeSats is helping investors capitalize on this historic moment. Learn about market trends and investment strategies.',
        content: `<p>Bitcoin has once again captured global attention by reaching a new all-time high, surpassing previous records and reinforcing its position as the world's leading cryptocurrency. This milestone represents more than just a number—it signifies growing institutional adoption, increased mainstream acceptance, and evolving market dynamics that every investor should understand.</p>

<h2>Understanding the Current Market Surge</h2>
<p>Several factors have contributed to Bitcoin's recent price surge. Institutional investors continue to allocate significant portions of their portfolios to Bitcoin, viewing it as a hedge against inflation and currency devaluation. Major corporations have also begun accepting Bitcoin as payment, further legitimizing its use as a medium of exchange.</p>

<p>Additionally, regulatory clarity in key markets has provided investors with greater confidence. As governments worldwide develop clearer frameworks for cryptocurrency regulation, institutional and retail investors alike feel more secure in their Bitcoin investments.</p>

<h2>What This Means for Different Types of Investors</h2>

<h3>For New Investors</h3>
<p>If you're new to Bitcoin investing, this milestone might seem like you've missed the boat. However, many experts believe we're still in the early stages of Bitcoin adoption. The key is to start with small amounts you can afford to lose, focus on dollar-cost averaging rather than trying to time the market, and educate yourself about Bitcoin's technology and use cases.</p>

<h3>For Experienced Investors</h3>
<p>Seasoned Bitcoin investors should consider this milestone as validation of their long-term strategy. However, it's important to review your portfolio allocation and risk management, consider taking some profits if Bitcoin represents too large a portion of your portfolio, and maintain a long-term perspective despite short-term volatility.</p>

<h2>The Role of SafeSats in Your Bitcoin Journey</h2>
<p>At SafeSats, we're committed to providing a secure, user-friendly platform for all your Bitcoin trading needs. Our advanced security measures, competitive fees, and 24/7 customer support ensure that you can navigate these exciting market conditions with confidence.</p>`,
        category: 'bitcoin',
        categoryColor: 'green',
        author: 'John Doe',
        date: 'December 15, 2024',
        readTime: '5 min read',
        featuredImage: 'gradient-green',
        published: true,
        createdAt: '2024-12-15T10:00:00.000Z',
        updatedAt: '2024-12-15T10:00:00.000Z'
      },
      {
        id: 'post-2',
        title: 'Enhanced Security Features: Protecting Your Digital Assets',
        slug: 'enhanced-security-features',
        excerpt: 'Learn about SafeSats\' latest security enhancements and how we\'re setting new standards for cryptocurrency protection. Discover our multi-layer security approach.',
        content: `<p>Security is paramount in the cryptocurrency world, and at SafeSats, we've implemented cutting-edge security measures to protect your digital assets. Our latest security enhancements represent a significant step forward in cryptocurrency protection.</p>

<h2>Multi-Layer Security Architecture</h2>
<p>Our security approach employs multiple layers of protection, including advanced encryption, secure key management, and real-time threat detection. This comprehensive approach ensures that your funds remain safe even in the face of sophisticated attacks.</p>

<h2>New Security Features</h2>
<p>We've recently introduced several new security features including enhanced two-factor authentication, biometric login options, and advanced fraud detection algorithms that monitor transactions in real-time.</p>`,
        category: 'security',
        categoryColor: 'blue',
        author: 'Sarah Miller',
        date: 'December 12, 2024',
        readTime: '7 min read',
        featuredImage: 'gradient-blue',
        published: true,
        createdAt: '2024-12-12T10:00:00.000Z',
        updatedAt: '2024-12-12T10:00:00.000Z'
      },
      {
        id: 'post-3',
        title: 'Beginner\'s Guide: Your First Bitcoin Purchase on SafeSats',
        slug: 'beginners-guide-first-bitcoin-purchase',
        excerpt: 'Step-by-step guide for newcomers to cryptocurrency, making your first Bitcoin purchase simple and secure. Perfect for those just starting their crypto journey.',
        content: `<p>Welcome to the world of Bitcoin! If you're new to cryptocurrency, making your first Bitcoin purchase can seem daunting. This comprehensive guide will walk you through every step of the process on the SafeSats platform.</p>

<h2>Getting Started</h2>
<p>Before you can purchase Bitcoin, you'll need to create and verify your SafeSats account. This process includes identity verification to ensure the security of our platform and compliance with regulations.</p>

<h2>Making Your First Purchase</h2>
<p>Once your account is verified, you can make your first Bitcoin purchase using various payment methods including bank transfers, credit cards, and mobile money services.</p>`,
        category: 'tutorials',
        categoryColor: 'orange',
        author: 'Michael Johnson',
        date: 'December 10, 2024',
        readTime: '10 min read',
        featuredImage: 'gradient-orange',
        published: true,
        createdAt: '2024-12-10T10:00:00.000Z',
        updatedAt: '2024-12-10T10:00:00.000Z'
      }
    ];
  }

  getDefaultCategories() {
    return [
      { id: 'cat-1', name: 'Bitcoin', slug: 'bitcoin', color: 'green', description: 'Bitcoin news and analysis' },
      { id: 'cat-2', name: 'Security', slug: 'security', color: 'blue', description: 'Security tips and updates' },
      { id: 'cat-3', name: 'Tutorials', slug: 'tutorials', color: 'orange', description: 'How-to guides and tutorials' },
      { id: 'cat-4', name: 'News', slug: 'news', color: 'purple', description: 'Cryptocurrency news and updates' },
      { id: 'cat-5', name: 'Company', slug: 'company', color: 'green', description: 'SafeSats company updates' }
    ];
  }

  getDefaultUsers() {
    return [
      {
        id: 'user-1',
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        email: 'admin@safesats.com',
        role: 'admin',
        name: 'Admin User'
      }
    ];
  }
}

// Create singleton instance
const cmsStorage = new CMSStorage();
export default cmsStorage;
