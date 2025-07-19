import React from 'react';

function TermsOfService() {
  return (
    <div className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Terms of <span className="text-green-400">Service</span>
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: December 15, 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using SafeSats ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These Terms of Service ("Terms") govern your use of our cryptocurrency trading platform and related services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SafeSats provides a digital platform for buying, selling, and trading Bitcoin and other cryptocurrencies. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Cryptocurrency trading and exchange services</li>
              <li>Digital wallet functionality</li>
              <li>Market data and analytics</li>
              <li>Customer support and educational resources</li>
              <li>Mobile and web applications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Eligibility and Account Registration</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Eligibility Requirements</h3>
                <p className="text-gray-300 leading-relaxed mb-2">
                  To use our services, you must:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into contracts</li>
                  <li>Not be prohibited from using our services under applicable laws</li>
                  <li>Provide accurate and complete information during registration</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Account Security</h3>
                <p className="text-gray-300 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Trading Rules and Restrictions</h2>
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                When using our trading services, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in market manipulation or fraudulent activities</li>
                <li>Not use automated trading systems without prior approval</li>
                <li>Accept that cryptocurrency trading involves significant risk</li>
                <li>Understand that past performance does not guarantee future results</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Fees and Payments</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our fee structure is transparent and clearly displayed on our platform:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Trading fees are charged per transaction</li>
              <li>Withdrawal fees may apply for external transfers</li>
              <li>Fees are subject to change with prior notice</li>
              <li>All fees are clearly disclosed before transaction confirmation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Risk Disclosure</h2>
            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 font-semibold mb-2">⚠️ Important Risk Warning</p>
              <p className="text-gray-300 leading-relaxed">
                Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. The value of cryptocurrencies can be extremely volatile and unpredictable.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              By using our services, you acknowledge and accept the following risks:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Cryptocurrency values can fluctuate dramatically</li>
              <li>You may lose some or all of your investment</li>
              <li>Regulatory changes may affect cryptocurrency markets</li>
              <li>Technical issues may temporarily affect platform availability</li>
              <li>Cryptocurrency transactions are generally irreversible</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Activities</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Money laundering or terrorist financing</li>
              <li>Fraud, market manipulation, or insider trading</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Using our services for illegal purposes</li>
              <li>Creating multiple accounts to circumvent limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, SafeSats shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, resulting from your use of our services. Our total liability shall not exceed the amount of fees paid by you in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Indemnification</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to indemnify and hold harmless SafeSats, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to terminate or suspend your account and access to our services at any time, with or without cause, and with or without notice. Upon termination, your right to use our services will cease immediately, but these Terms will remain in effect regarding your prior use of the services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SafeSats operates, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notification. Your continued use of our services after such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
              <p className="text-gray-300">Email: info@safesats.com</p>
              <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-300">Address:  Blockchain Street, Lilongwe City, Malawi</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
