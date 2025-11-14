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
            Last updated: November 13, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using SafeSats ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These Terms of Service ("Terms") govern your use of our cryptocurrency exchange facilitation platform and related services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SafeSats provides a digital platform for facilitating exchanges between Malawian Kwacha (MWK) and Bitcoin via the Lightning Network. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Bitcoin exchange facilitation (buying and selling satoshis)</li>
              <li>Mobile money payment processing via PayChangu</li>
              <li>Lightning Network transaction coordination via Blink</li>
              <li>Real-time transaction status tracking</li>
              <li>Customer support</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              <strong>Important:</strong> SafeSats does not hold, custody, or store your Bitcoin. We facilitate direct exchanges between your mobile money account and your Lightning Network wallet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Eligibility and Service Usage</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Eligibility Requirements</h3>
                <p className="text-gray-300 leading-relaxed mb-2">
                  To use our services, you must:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into contracts</li>
                  <li>Have a valid Malawian mobile money account (Airtel Money, TNM Mpamba, or other supported providers)</li>
                  <li>Have a Lightning Network compatible wallet for receiving/sending Bitcoin</li>
                  <li>Not be prohibited from using our services under applicable laws</li>
                  <li>Provide accurate transaction information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">No Account Required</h3>
                <p className="text-gray-300 leading-relaxed">
                  SafeSats does not require account creation. Each transaction is processed independently. You are responsible for maintaining your own mobile money account and Lightning wallet credentials.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Transaction Rules and Restrictions</h2>
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                When using our exchange services, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Comply with all applicable laws and regulations in Malawi</li>
                <li>Provide accurate mobile money and Lightning invoice information</li>
                <li>Accept current exchange rates and spreads displayed at transaction initiation</li>
                <li>Understand that bitcoin transactions are generally irreversible</li>
                <li>Not use our services for money laundering or illegal activities</li>
                <li>Accept transaction limits (Buy: 4,000-1,000,000 MWK | Sell: 1,000-10,000,000 sats)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Fees and Exchange Rates</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our pricing structure is transparent and clearly displayed before each transaction:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Exchange rates are based on current market rates with applied spreads</li>
              <li>Buy spread: 5% discount (you pay less MWK to buy sats)</li>
              <li>Sell spread: Currently set as configured in system settings</li>
              <li>Mobile money transaction fees may apply per PayChangu's terms</li>
              <li>Lightning Network fees are included in the transaction</li>
              <li>Rates and spreads are subject to change and locked at transaction initiation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Risk Disclosure</h2>
            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 font-semibold mb-2">⚠️ Important Risk Warning</p>
              <p className="text-gray-300 leading-relaxed">
                Bitcoin exchanges involve substantial risk. The value of Bitcoin can be extremely volatile and unpredictable. You may lose value between the time you initiate and complete a transaction.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              By using our services, you acknowledge and accept the following risks:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Bitcoin values can fluctuate dramatically in short periods</li>
              <li>Exchange rates are locked at transaction initiation but market rates may change</li>
              <li>Mobile money and Lightning Network transactions may experience delays</li>
              <li>Technical issues may temporarily affect service availability</li>
              <li>Bitcoin transactions are generally irreversible once confirmed</li>
              <li>You are responsible for the security of your Lightning wallet</li>
              <li>Incorrect Lightning invoice or mobile number may result in loss of funds</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Transaction Processing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Buy Transactions (MWK → Bitcoin)</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You provide a valid Lightning Network invoice</li>
                  <li>Payment is processed via PayChangu mobile money</li>
                  <li>Upon payment confirmation, Bitcoin is sent to your provided invoice</li>
                  <li>Transaction typically completes within minutes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Sell Transactions (Bitcoin → MWK)</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You provide your mobile money number</li>
                  <li>System generates a Lightning invoice for you to pay</li>
                  <li>Upon Lightning payment confirmation, MWK is sent to your mobile money account</li>
                  <li>Payout typically completes within minutes to hours</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Prohibited Activities</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Money laundering or terrorist financing</li>
              <li>Fraud or providing false information</li>
              <li>Violating any applicable laws or regulations in Malawi</li>
              <li>Attempting to manipulate exchange rates or exploit system vulnerabilities</li>
              <li>Using our services for illegal purposes</li>
              <li>Attempting to reverse or cancel transactions fraudulently</li>
              <li>Using stolen mobile money accounts or Lightning wallets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Service Providers</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SafeSats utilizes third-party services to facilitate transactions:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>PayChangu:</strong> Mobile money payment processing</li>
              <li><strong>Blink:</strong> Lightning Network transaction processing</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              These providers have their own terms of service and privacy policies. SafeSats is not responsible for the actions, policies, or services of these third-party providers beyond our direct integration with them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, SafeSats shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or cryptocurrency value fluctuations, resulting from your use of our services. SafeSats is not liable for delays or failures caused by third-party payment providers or network congestion. Our role is strictly as a facilitator of exchanges between mobile money and Lightning Network.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You are solely responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Providing accurate Lightning invoices and mobile money numbers</li>
              <li>Ensuring you have access to the provided payment details</li>
              <li>Understanding and accepting exchange rates before confirming transactions</li>
              <li>Securing your Lightning wallet and mobile money account</li>
              <li>Complying with tax obligations related to cryptocurrency transactions</li>
              <li>Verifying transaction details before submission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Service Availability</h2>
            <p className="text-gray-300 leading-relaxed">
              While we strive for continuous service availability, SafeSats does not guarantee uninterrupted access. We may temporarily suspend services for maintenance, updates, or due to circumstances beyond our control. We are not liable for any losses resulting from service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Malawi, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Malawi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. Material changes will be posted on our platform. Your continued use of our services after such changes constitutes acceptance of the modified Terms. We recommend reviewing these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
              <p className="text-gray-300">Email: support@safesats.com</p>
              <p className="text-gray-300">Location: Malawi</p>
            </div>
          </section>

          <section className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              By using SafeSats, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. SafeSats operates as a bitcoin exchange facilitator and does not provide custody services for digital assets.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;