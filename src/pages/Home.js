import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import PurchaseSection from '../components/sections/PurchaseSection';
import PremierPlatformSection from '../components/sections/PremierPlatformSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import BlogSection from '../components/sections/BlogSection';
import NewsletterSection from '../components/sections/NewsletterSection';

function Home() {
  return (
    <>
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
