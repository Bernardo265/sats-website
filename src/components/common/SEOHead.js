import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
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
  
  // Brand name for optimization
  const brandName = "SafeSats";
  
  // Enhance title and description with brand name if not already included
  const optimizedTitle = meta.title?.toLowerCase().includes('safesats') 
    ? meta.title 
    : `${meta.title} | ${brandName}`;
    
  const optimizedDescription = meta.description?.toLowerCase().includes('safesats')
    ? meta.description
    : `${meta.description} - ${brandName}`;
  
  // Generate structured data with brand emphasis
  const jsonLd = structuredData || generateStructuredData(structuredDataType, {
    ...pageData,
    name: brandName,
    alternateName: ["Safe Sats", "SafeSats.com"],
  });

  return (
    <Helmet>
      {/* Basic Meta Tags - Optimized for Brand Search */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {meta.keywords && (
        <meta name="keywords" content={`safesats, safe sats, ${meta.keywords}`} />
      )}
      {meta.author && <meta name="author" content={meta.author} />}
      <meta name="robots" content={robotsMeta} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Brand/Application Name */}
      <meta name="application-name" content={brandName} />
      <meta name="apple-mobile-web-app-title" content={brandName} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      {meta.image && (
        <>
          <meta property="og:image" content={meta.image} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={`${brandName} - ${meta.title}`} />
        </>
      )}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={meta.type || 'website'} />
      <meta property="og:site_name" content={brandName} />
      {meta.locale && <meta property="og:locale" content={meta.locale} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={meta.twitterCard || 'summary_large_image'} />
      {meta.twitterSite && <meta name="twitter:site" content={meta.twitterSite} />}
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      {meta.image && <meta name="twitter:image" content={meta.image} />}

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=no" />

      {/* Site Verification */}
      {meta.googleVerification && (
        <meta name="google-site-verification" content={meta.googleVerification} />
      )}
      {meta.bingVerification && (
        <meta name="msvalidate.01" content={meta.bingVerification} />
      )}

      {/* Favicon and Icons */}
      <link rel="icon" type="image/png" href="/images/logo.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="theme-color" content="#f97316" />

      {/* Enhanced Structured Data for Brand Recognition */}
      {jsonLd && Object.keys(jsonLd).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            ...jsonLd,
            "@context": "https://schema.org",
            "@type": jsonLd["@type"] || "Organization",
            "name": brandName,
            "alternateName": ["Safe Sats", "SafeSats.com"],
            "url": canonicalUrl.split(/[?#]/)[0].replace(/\/$/, '').match(/^https?:\/\/[^\/]+/)?.[0] || canonicalUrl,
            "logo": meta.image || `${canonicalUrl.split(/[?#]/)[0].replace(/\/$/, '').match(/^https?:\/\/[^\/]+/)?.[0]}/images/logo.png`,
            "sameAs": meta.socialProfiles || []
          })}
        </script>
      )}

      {/* Website Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": brandName,
          "alternateName": ["Safe Sats"],
          "url": canonicalUrl.split(/[?#]/)[0].replace(/\/$/, '').match(/^https?:\/\/[^\/]+/)?.[0] || canonicalUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${canonicalUrl.split(/[?#]/)[0].replace(/\/$/, '').match(/^https?:\/\/[^\/]+/)?.[0]}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Breadcrumb Structured Data */}
      {pageData.breadcrumbs && pageData.breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": pageData.breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": crumb.url
            }))
          })}
        </script>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Helmet>
  );
};

export default SEOHead;