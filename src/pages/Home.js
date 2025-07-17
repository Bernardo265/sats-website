import React from 'react';
import SEOHead from '../components/common/SEOHead';
import HeroSection from '../components/sections/HeroSection';
import PurchaseSection from '../components/sections/PurchaseSection';
import PremierPlatformSection from '../components/sections/PremierPlatformSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import BlogSection from '../components/sections/BlogSection';
import NewsletterSection from '../components/sections/NewsletterSection';
import { generateStructuredData } from '../utils/seo';

function Home() {
  const homePageData = {
    title: 'SafeSats - The Premier Bitcoin Platform | Secure Crypto Trading',
    description: 'Join SafeSats, the leading Bitcoin platform trusted by thousands. Secure trading, advanced analytics, and expert insights for cryptocurrency enthusiasts and professionals.',
    keywords: 'bitcoin platform, cryptocurrency trading, secure bitcoin wallet, crypto exchange, blockchain technology, digital assets, bitcoin investment, safesats',
    url: '/',
    type: 'website',
    image: '/images/safesats-home-og.jpg'
  };

  const breadcrumbData = [
    { name: 'Home', url: '/' }
  ];

  return (
    <>
      <SEOHead
        pageData={homePageData}
        structuredData={generateStructuredData('website', homePageData)}
      />
      <SEOHead
        structuredData={generateStructuredData('breadcrumb', breadcrumbData)}
      />
      <HeroSection />
      <PurchaseSection />
      <PremierPlatformSection />
      <TestimonialsSection />
      <BlogSection />
      <NewsletterSection />
    </>
  );
}

export default Home;
