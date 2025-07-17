// Analytics utilities for SafeSats CMS
export const ANALYTICS_STORAGE_KEY = 'safesats_analytics';
export const READING_TIME_THRESHOLD = 30; // seconds to count as a "read"

// Initialize analytics data structure
export const initializeAnalytics = () => {
  const existing = localStorage.getItem(ANALYTICS_STORAGE_KEY);
  if (!existing) {
    const initialData = {
      posts: {},
      sessions: [],
      overview: {
        totalViews: 0,
        totalReads: 0,
        totalSessions: 0,
        averageReadTime: 0,
        topCategories: {},
        topPosts: []
      },
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(existing);
};

// Get analytics data
export const getAnalytics = () => {
  return JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '{}');
};

// Save analytics data
export const saveAnalytics = (data) => {
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
};

// Track page view
export const trackPageView = (postSlug, postData = {}) => {
  const analytics = getAnalytics();
  const timestamp = new Date().toISOString();
  const sessionId = getOrCreateSessionId();

  // Initialize post analytics if not exists
  if (!analytics.posts[postSlug]) {
    analytics.posts[postSlug] = {
      slug: postSlug,
      title: postData.title || 'Unknown',
      category: postData.category || 'uncategorized',
      views: 0,
      reads: 0,
      totalReadTime: 0,
      averageReadTime: 0,
      viewsOverTime: [],
      readsOverTime: [],
      bounceRate: 0,
      engagementScore: 0,
      firstViewed: timestamp,
      lastViewed: timestamp
    };
  }

  // Update post analytics
  const post = analytics.posts[postSlug];
  post.views += 1;
  post.lastViewed = timestamp;
  post.viewsOverTime.push({
    date: new Date().toDateString(),
    timestamp: timestamp,
    sessionId: sessionId
  });

  // Update overview
  analytics.overview.totalViews += 1;

  // Update category stats
  if (postData.category) {
    if (!analytics.overview.topCategories[postData.category]) {
      analytics.overview.topCategories[postData.category] = 0;
    }
    analytics.overview.topCategories[postData.category] += 1;
  }

  saveAnalytics(analytics);
  return analytics;
};

// Track reading completion
export const trackReadCompletion = (postSlug, readTime) => {
  const analytics = getAnalytics();
  const timestamp = new Date().toISOString();

  if (analytics.posts[postSlug]) {
    const post = analytics.posts[postSlug];
    
    // Only count as read if they spent enough time
    if (readTime >= READING_TIME_THRESHOLD) {
      post.reads += 1;
      post.totalReadTime += readTime;
      post.averageReadTime = post.totalReadTime / post.reads;
      post.readsOverTime.push({
        date: new Date().toDateString(),
        timestamp: timestamp,
        readTime: readTime
      });

      // Update overview
      analytics.overview.totalReads += 1;
      analytics.overview.averageReadTime = 
        (analytics.overview.averageReadTime * (analytics.overview.totalReads - 1) + readTime) / 
        analytics.overview.totalReads;
    }

    // Calculate engagement score (reads/views ratio)
    post.engagementScore = post.views > 0 ? (post.reads / post.views) * 100 : 0;
    
    // Calculate bounce rate (views without reads)
    post.bounceRate = post.views > 0 ? ((post.views - post.reads) / post.views) * 100 : 0;

    saveAnalytics(analytics);
  }
};

// Get or create session ID
export const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem('safesats_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('safesats_session_id', sessionId);
    
    // Track new session
    const analytics = getAnalytics();
    analytics.sessions.push({
      id: sessionId,
      startTime: new Date().toISOString(),
      pages: []
    });
    analytics.overview.totalSessions += 1;
    saveAnalytics(analytics);
  }
  return sessionId;
};

// Get post analytics
export const getPostAnalytics = (postSlug) => {
  const analytics = getAnalytics();
  return analytics.posts[postSlug] || null;
};

// Get top performing posts
export const getTopPosts = (limit = 10, sortBy = 'views') => {
  const analytics = getAnalytics();
  const posts = Object.values(analytics.posts);
  
  return posts
    .sort((a, b) => {
      switch (sortBy) {
        case 'reads':
          return b.reads - a.reads;
        case 'engagement':
          return b.engagementScore - a.engagementScore;
        case 'readTime':
          return b.averageReadTime - a.averageReadTime;
        default:
          return b.views - a.views;
      }
    })
    .slice(0, limit);
};

// Get analytics overview
export const getAnalyticsOverview = () => {
  const analytics = getAnalytics();
  const posts = Object.values(analytics.posts);
  
  // Calculate additional metrics
  const totalPosts = posts.length;
  const avgViewsPerPost = totalPosts > 0 ? analytics.overview.totalViews / totalPosts : 0;
  const avgReadsPerPost = totalPosts > 0 ? analytics.overview.totalReads / totalPosts : 0;
  const overallEngagement = analytics.overview.totalViews > 0 ? 
    (analytics.overview.totalReads / analytics.overview.totalViews) * 100 : 0;

  return {
    ...analytics.overview,
    totalPosts,
    avgViewsPerPost,
    avgReadsPerPost,
    overallEngagement,
    topPosts: getTopPosts(5)
  };
};

// Get analytics for date range
export const getAnalyticsForDateRange = (startDate, endDate) => {
  const analytics = getAnalytics();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const filteredData = {
    views: 0,
    reads: 0,
    posts: {}
  };

  Object.values(analytics.posts).forEach(post => {
    const postViews = post.viewsOverTime.filter(view => {
      const viewDate = new Date(view.timestamp);
      return viewDate >= start && viewDate <= end;
    });

    const postReads = post.readsOverTime.filter(read => {
      const readDate = new Date(read.timestamp);
      return readDate >= start && readDate <= end;
    });

    if (postViews.length > 0 || postReads.length > 0) {
      filteredData.posts[post.slug] = {
        ...post,
        views: postViews.length,
        reads: postReads.length,
        viewsOverTime: postViews,
        readsOverTime: postReads
      };
      filteredData.views += postViews.length;
      filteredData.reads += postReads.length;
    }
  });

  return filteredData;
};

// Get category performance
export const getCategoryPerformance = () => {
  const analytics = getAnalytics();
  const categoryStats = {};

  Object.values(analytics.posts).forEach(post => {
    const category = post.category || 'uncategorized';
    
    if (!categoryStats[category]) {
      categoryStats[category] = {
        name: category,
        posts: 0,
        views: 0,
        reads: 0,
        totalReadTime: 0,
        averageReadTime: 0,
        engagementScore: 0
      };
    }

    const cat = categoryStats[category];
    cat.posts += 1;
    cat.views += post.views;
    cat.reads += post.reads;
    cat.totalReadTime += post.totalReadTime;
  });

  // Calculate averages and engagement
  Object.values(categoryStats).forEach(cat => {
    cat.averageReadTime = cat.reads > 0 ? cat.totalReadTime / cat.reads : 0;
    cat.engagementScore = cat.views > 0 ? (cat.reads / cat.views) * 100 : 0;
  });

  return Object.values(categoryStats).sort((a, b) => b.views - a.views);
};

// Export analytics data
export const exportAnalytics = (format = 'json') => {
  const analytics = getAnalytics();
  const overview = getAnalyticsOverview();
  const categoryPerformance = getCategoryPerformance();
  
  const exportData = {
    overview,
    posts: Object.values(analytics.posts),
    categories: categoryPerformance,
    exportDate: new Date().toISOString(),
    format: format
  };

  if (format === 'csv') {
    return convertToCSV(exportData);
  }
  
  return JSON.stringify(exportData, null, 2);
};

// Convert to CSV format
const convertToCSV = (data) => {
  const posts = data.posts;
  const headers = ['Title', 'Slug', 'Category', 'Views', 'Reads', 'Avg Read Time', 'Engagement %', 'First Viewed', 'Last Viewed'];
  
  const rows = posts.map(post => [
    post.title,
    post.slug,
    post.category,
    post.views,
    post.reads,
    Math.round(post.averageReadTime),
    Math.round(post.engagementScore * 100) / 100,
    new Date(post.firstViewed).toLocaleDateString(),
    new Date(post.lastViewed).toLocaleDateString()
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// Clear analytics data
export const clearAnalytics = () => {
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  sessionStorage.removeItem('safesats_session_id');
  return initializeAnalytics();
};
