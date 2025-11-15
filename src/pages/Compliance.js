import React from 'react';
import SEOHead from '../components/common/SEOHead';
import { generateStructuredData } from '../utils/seo';

function Compliance() {
  const compliancePageData = {
    title: 'Legal Compliance & Regulatory Information | SafeSats',
    description: 'Learn about SafeSats legal compliance, regulatory framework, and Bitcoin regulations in Malawi. Transparent information about our operations and legal status.',
    keywords: 'safesats compliance, bitcoin regulations malawi, cryptocurrency legal framework, AML CTF compliance, bitcoin legal status',
    url: '/compliance',
    type: 'website',
    image: '/images/safesats-compliance-og.jpg'
  };

  const breadcrumbData = [
    { name: 'Home', url: '/' },
    { name: 'Legal Compliance', url: '/compliance' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <SEOHead
        pageData={compliancePageData}
        structuredData={generateStructuredData('webpage', compliancePageData)}
      />
      <SEOHead
        structuredData={generateStructuredData('breadcrumb', breadcrumbData)}
      />
      
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Legal Compliance &<br />
              <span className="text-green-500">Regulatory Information</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Transparency and compliance are at the core of SafeSats operations. 
              Learn about our legal framework and regulatory compliance in Malawi.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Legal Framework Section */}
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Legal Framework</h2>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80 leading-relaxed mb-6">
                    SafeSats operates within the current legal framework of Malawi, adhering to all applicable 
                    regulations and maintaining transparency about the regulatory environment surrounding cryptocurrency operations.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/5">
                      <h3 className="text-lg font-semibold text-white mb-3">Reserve Bank of Malawi Position (2018)</h3>
                      <p className="text-white/70 leading-relaxed">
                        The Reserve Bank of Malawi has issued cautions regarding cryptocurrencies, highlighting potential risks 
                        while not implementing an outright ban. This position allows for private use of cryptocurrencies while 
                        emphasizing the need for caution and due diligence.
                      </p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/5">
                      <h3 className="text-lg font-semibold text-white mb-3">Payment Systems Act (2016)</h3>
                      <p className="text-white/70 leading-relaxed">
                        The current Payment Systems Act does not specifically cover Bitcoin or other cryptocurrencies, 
                        creating a regulatory gap that allows for cryptocurrency operations while the legal framework evolves.
                      </p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/5">
                      <h3 className="text-lg font-semibold text-white mb-3">AML/CTF Regulations (2017)</h3>
                      <p className="text-white/70 leading-relaxed">
                        Anti-Money Laundering and Combating the Financing of Terrorism regulations apply to cryptocurrency 
                        transactions. SafeSats implements robust AML/CTF procedures to ensure compliance with these requirements.
                      </p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/5">
                      <h3 className="text-lg font-semibold text-white mb-3">Taxation Act (2006)</h3>
                      <p className="text-white/70 leading-relaxed">
                        Cryptocurrency transactions are subject to applicable tax obligations under the Taxation Act. 
                        Users are responsible for understanding and fulfilling their tax obligations related to cryptocurrency activities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Analysis Section */}
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Compliance Analysis</h2>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80 leading-relaxed mb-6">
                    Our comprehensive analysis of the regulatory environment ensures that SafeSats operates within 
                    legal boundaries while providing secure and reliable cryptocurrency services.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/5">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Legal Status
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        Bitcoin is not recognized as legal tender in Malawi but remains legal for private use, 
                        allowing individuals and businesses to engage in cryptocurrency transactions.
                      </p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/5">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Operational Compliance
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        SafeSats activities comply with applicable laws through strict adherence to AML/CTF 
                        regulations and ensuring all tax obligations are properly addressed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Disclaimers */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white">Important Disclaimers</h3>
                </div>
                
                <div className="space-y-3 text-white/80">
                  <p className="leading-relaxed">
                    <strong>Educational Purpose:</strong> This information is provided for educational purposes only 
                    and does not constitute legal advice. Users should consult with qualified legal professionals 
                    for specific legal guidance.
                  </p>
                  
                  <p className="leading-relaxed">
                    <strong>User Responsibility:</strong> Users are responsible for ensuring compliance with all 
                    applicable laws and regulations in their jurisdiction, including tax obligations and AML/CTF requirements.
                  </p>
                  
                  <p className="leading-relaxed">
                    <strong>Regulatory Changes:</strong> The regulatory landscape for Bitcoin is evolving. 
                    SafeSats monitors regulatory developments and adapts operations as necessary to maintain compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center space-y-6 pt-8">
              <h3 className="text-2xl font-bold text-white">Questions About Compliance?</h3>
              <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
                If you have questions about our legal compliance or need clarification about regulatory matters, 
                our compliance team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Contact Compliance Team
                </a>
                <a 
                  href="mailto:compliance@safesats.com" 
                  className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Email: compliance@safesats.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compliance;
