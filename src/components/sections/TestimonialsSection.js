import React from 'react';

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Praise Bokosi",
      initials: "PB",
      review: "SafeSats made buying Bitcoin incredibly easy and secure. The platform is user-friendly and the transaction was completed within minutes.",
      role: "Verified Customer"
    },
    {
      name: "Chiyembekezi Chabuka",
      initials: "CC",
      review: "Excellent customer service and fast transactions. I've been using SafeSats for months and never had any issues. Highly recommended!",
      role: "Verified Customer"
    },
    {
      name: "Limbani Banda",
      initials: "LB",
      review: "The security features give me peace of mind. SafeSats is definitely the most trustworthy platform I've used for cryptocurrency trading.",
      role: "Verified Customer"
    }
  ];

  return (
    <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Top gradient overlay for smooth transition from premier platform section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900/30 to-transparent pointer-events-none"></div>

      {/* Bottom gradient overlay for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-800/50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            What Our <span className="text-green-400">Customers Say</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust SafeSats for their Bitcoin transactions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-400/30 transition-all duration-300">
              <div className="space-y-6">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-green-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Review */}
                <p className="text-gray-300 leading-relaxed">
                  "{testimonial.review}"
                </p>
                
                {/* Customer Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{testimonial.initials}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
