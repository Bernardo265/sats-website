import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Bitcoin symbols */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-24 h-24 transform rotate-12 float-animation">
          <img 
            src="/images/img_vector_white_a700.svg" 
            alt="Bitcoin" 
            className="w-full h-full object-contain opacity-10"
          />
        </div>
        <div className="absolute top-40 right-20 w-16 h-16 transform -rotate-12 float-animation" style={{animationDelay: '1s'}}>
          <img 
            src="/images/vector_56x56.png" 
            alt="Bitcoin" 
            className="w-full h-full object-contain opacity-10"
          />
        </div>
        <div className="absolute bottom-40 left-20 w-20 h-20 transform rotate-45 float-animation" style={{animationDelay: '2s'}}>
          <img 
            src="/images/img_vector.png" 
            alt="Bitcoin" 
            className="w-full h-full object-contain opacity-10"
          />
        </div>
        <div className="absolute bottom-20 right-40 w-12 h-12 transform -rotate-45 float-animation" style={{animationDelay: '0.5s'}}>
          <img 
            src="/images/vector_56x56.png" 
            alt="Bitcoin" 
            className="w-full h-full object-contain opacity-10"
          />
        </div>
      </div>

      <Header />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
