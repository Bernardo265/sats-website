import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateMetaTags, generateStructuredData, generateCanonicalUrl, generateRobotsMeta } from '../../utils/seo';

const SEOHead = ({ 
  pageData = {}, 
  structuredData = null, 
  structuredDataType = 'organization',
  noIndex = false,
  noFollow = false,
  noArchive = false 
}) => {
  const meta = generateMetaTags(pageData);
  const canonicalUrl = generateCanonicalUrl(pageData.url || '/');
  const robotsMeta = generateRobotsMeta(!noIndex, !noFollow, !noArchive);
  
  // Generate structured data
  const jsonLd = structuredData || generateStructuredData(structuredDataType, pageData);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="author" content={meta.author} />
      <meta name="robots" content={robotsMeta} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:locale" content={meta.locale} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={meta.twitterCard} />
      <meta name="twitter:site" content={meta.twitterSite} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Additional structured data for website */}
      {structuredDataType === 'organization' && (
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData('website', pageData))}
        </script>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    </Helmet>
  );
};

export default SEOHead;
