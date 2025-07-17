// SEO Utilities for SafeSats Website
export const generateMetaTags = (pageData) => {
  const defaultMeta = {
    title: 'SafeSats - The Premier Bitcoin Platform',
    description: 'SafeSats is the leading platform for secure Bitcoin transactions and cryptocurrency management. Join thousands of users who trust SafeSats for their digital asset needs.',
    keywords: 'bitcoin, cryptocurrency, digital assets, blockchain, crypto trading, bitcoin wallet, safesats',
    image: '/images/safesats-og-image.jpg',
    url: 'https://safesats.com',
    type: 'website',
    siteName: 'SafeSats',
    locale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterSite: '@SafeSats',
    author: 'SafeSats Team'
  };

  return {
    ...defaultMeta,
    ...pageData
  };
};

export const generateStructuredData = (type, data) => {
  const baseOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SafeSats",
    "description": "The Premier Bitcoin Platform",
    "url": "https://safesats.com",
    "logo": "https://safesats.com/images/safesats-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+2-659-982-72546",
      "contactType": "customer service",
      "email": "support@safesats.com",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Blockchain Street",
      "addressLocality": "Lilongwe City",
      "postalCode": "12345",
      "addressCountry": "MW"
    },
    "sameAs": [
      "https://twitter.com/safesats",
      "https://linkedin.com/company/safesats",
      "https://facebook.com/safesats"
    ]
  };

  switch (type) {
    case 'organization':
      return baseOrganization;

    case 'article':
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.excerpt,
        "image": data.featuredImage ? `https://safesats.com${data.featuredImage}` : "https://safesats.com/images/default-blog.jpg",
        "author": {
          "@type": "Person",
          "name": data.author || "SafeSats Team"
        },
        "publisher": baseOrganization,
        "datePublished": data.createdAt,
        "dateModified": data.updatedAt || data.createdAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://safesats.com/blog/${data.slug}`
        },
        "articleSection": data.category,
        "keywords": data.keywords || `bitcoin, cryptocurrency, ${data.category}`,
        "wordCount": data.content ? data.content.replace(/<[^>]*>/g, '').split(' ').length : 0,
        "timeRequired": data.readTime || "5 minutes"
      };

    case 'blogPosting':
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title,
        "description": data.excerpt,
        "image": data.featuredImage ? `https://safesats.com${data.featuredImage}` : "https://safesats.com/images/default-blog.jpg",
        "author": {
          "@type": "Person",
          "name": data.author || "SafeSats Team"
        },
        "publisher": baseOrganization,
        "datePublished": data.createdAt,
        "dateModified": data.updatedAt || data.createdAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://safesats.com/blog/${data.slug}`
        },
        "articleSection": data.category,
        "keywords": data.keywords || `bitcoin, cryptocurrency, ${data.category}`,
        "wordCount": data.content ? data.content.replace(/<[^>]*>/g, '').split(' ').length : 0
      };

    case 'website':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "SafeSats",
        "description": "The Premier Bitcoin Platform",
        "url": "https://safesats.com",
        "publisher": baseOrganization,
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://safesats.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };

    case 'localBusiness':
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "SafeSats",
        "description": "The Premier Bitcoin Platform",
        "url": "https://safesats.com",
        "telephone": "+2-659-982-72546",
        "email": "support@safesats.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Blockchain Street",
          "addressLocality": "Lilongwe City",
          "postalCode": "12345",
          "addressCountry": "MW"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-13.9626",
          "longitude": "33.7741"
        },
        "openingHours": "Mo-Fr 09:00-18:00",
        "priceRange": "$$",
        "servedCuisine": "Financial Services",
        "acceptsReservations": false
      };

    case 'breadcrumb':
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `https://safesats.com${item.url}`
        }))
      };

    default:
      return baseOrganization;
  }
};

export const generateCanonicalUrl = (path) => {
  const baseUrl = 'https://safesats.com';
  return `${baseUrl}${path}`;
};

export const generateRobotsMeta = (index = true, follow = true, archive = true) => {
  const directives = [];
  
  if (index) directives.push('index');
  else directives.push('noindex');
  
  if (follow) directives.push('follow');
  else directives.push('nofollow');
  
  if (!archive) directives.push('noarchive');
  
  return directives.join(', ');
};

export const extractKeywords = (content, category) => {
  const baseKeywords = ['bitcoin', 'cryptocurrency', 'blockchain', 'safesats'];
  const categoryKeywords = {
    'bitcoin': ['bitcoin', 'btc', 'digital currency', 'peer-to-peer'],
    'blockchain': ['blockchain', 'distributed ledger', 'decentralized', 'consensus'],
    'trading': ['crypto trading', 'exchange', 'market analysis', 'trading strategies'],
    'security': ['crypto security', 'wallet security', 'private keys', 'cold storage'],
    'news': ['crypto news', 'bitcoin news', 'market updates', 'industry trends']
  };

  const contentKeywords = content
    ? content.toLowerCase()
        .replace(/<[^>]*>/g, '')
        .split(/\W+/)
        .filter(word => word.length > 3)
        .slice(0, 10)
    : [];

  return [
    ...baseKeywords,
    ...(categoryKeywords[category] || []),
    ...contentKeywords
  ].slice(0, 15).join(', ');
};

export const calculateReadingTime = (content) => {
  if (!content) return '5 min read';
  
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return `${readingTime} min read`;
};

export const generateSocialShareUrls = (url, title, description) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };
};
