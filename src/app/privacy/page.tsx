'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Last Updated: April 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-slate max-w-none">
          <div className="space-y-10">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                GreenCard.ai is operated as the technology platform for Partner Immigration Law, PLLC (Jeremy Knight, Esq., Florida Bar No. 1009132, Fort Lauderdale, FL). Partner Immigration Law, PLLC is a Florida-licensed immigration law firm. We are committed to protecting your privacy and ensuring you have a positive experience on our website and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, and interact with us.
              </p>
            </div>

            {/* Data Collection */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We collect information that you provide directly, information collected automatically, and information from third parties.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">A. Information You Provide</h3>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Account registration information (name, email, phone number)</li>
                    <li>Immigration and visa information (visa status, country of origin, case details)</li>
                    <li>Contact information (address, phone, email)</li>
                    <li>Payment information (credit card, billing address)</li>
                    <li>Communication content (messages, document uploads, case notes)</li>
                    <li>Personal identification documents (passport scans, visas, birth certificates)</li>
                    <li>Employment and educational history</li>
                    <li>Family and relationship information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">B. Information Collected Automatically</h3>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, links clicked)</li>
                    <li>Cookies and tracking technologies</li>
                    <li>Location information (if permitted)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">C. Third-Party Information</h3>
                  <p className="text-slate-600">We may receive information about you from government databases, background check providers, and other third parties to verify information and assist with your case.</p>
                </div>
              </div>
            </div>

            {/* Use of Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Providing immigration legal services and advice</li>
                <li>Preparing and filing immigration forms and applications</li>
                <li>Communicating with you about your case</li>
                <li>Processing payments and billing</li>
                <li>Improving our services and user experience</li>
                <li>Detecting and preventing fraud</li>
                <li>Complying with legal obligations</li>
                <li>Marketing and promotional communications (with your consent)</li>
              </ul>
            </div>

            {/* Data Storage and Security */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Storage and Security</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>AES-256 encryption for all personally identifiable information (PII) at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>HIPAA-like protections for immigration-related sensitive data</li>
                <li>Secure access controls and authentication</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Restricted access to sensitive information on a need-to-know basis</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                While we implement robust security measures, no system is completely secure. We cannot guarantee absolute security of your information.
              </p>
            </div>

            {/* Data Sharing */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Information Sharing</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>With legal counsel and advisors when necessary</li>
                <li>With government agencies as required for immigration proceedings</li>
                <li>With service providers who assist us (hosting, payment processing)</li>
                <li>With your consent or as directed by you</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </div>

            {/* Cookies and Tracking */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-slate-600 leading-relaxed">
                Our website uses cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser. Essential cookies are required for site functionality. You may opt out of non-essential cookies, which may impact your user experience.
              </p>
            </div>

            {/* Third-Party Links */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Third-Party Links</h2>
              <p className="text-slate-600 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites. We encourage you to review their privacy policies before providing any information.
              </p>
            </div>

            {/* CCPA and State Privacy Rights */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. CCPA and State Privacy Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Right to know what personal information is collected, used, and shared</li>
                <li>Right to delete personal information we collect from you</li>
                <li>Right to opt out of the sale or sharing of your personal information</li>
                <li>Right to non-discrimination for exercising your privacy rights</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Residents of other states with privacy laws (Virginia, Colorado, Connecticut, Utah) have similar rights. To exercise these rights, please contact us at hello@greencard.ai.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Children's Privacy</h2>
              <p className="text-slate-600 leading-relaxed">
                Our services are not directed to children under 13. We do not knowingly collect information from children under 13. If we become aware that we have collected information from a child under 13, we will delete it promptly. If a parent or guardian believes their child has provided information to us, please contact us immediately.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Data Retention</h2>
              <p className="text-slate-600 leading-relaxed">
                We retain your personal information for as long as necessary to provide services and comply with legal obligations. Immigration case files are typically retained in accordance with attorney ethics rules and applicable law, generally for seven years after case closure. You may request deletion of your data subject to legal and professional obligations.
              </p>
            </div>

            {/* International Data Transfers */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. International Data Transfers</h2>
              <p className="text-slate-600 leading-relaxed">
                Your information may be transferred to, stored in, and processed in countries other than the country in which it was collected, including the United States. These countries may have data protection laws that differ from your home country. By using our services, you consent to this transfer.
              </p>
            </div>

            {/* Contact for Privacy Concerns */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us About Privacy</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-2">
                <p className="text-slate-900 font-semibold">Partner Immigration Law, PLLC</p>
                <p className="text-slate-600">Operating as GreenCard.ai</p>
                <p className="text-slate-600">Fort Lauderdale, Florida</p>
                <p className="text-slate-600">Email: <a href="mailto:hello@greencard.ai" className="text-emerald-600 hover:underline">hello@greencard.ai</a></p>
              </div>
            </div>

            {/* Policy Updates */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes your acceptance of the updated policy.
              </p>
            </div>

            {/* Additional Protections */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Additional Protections for Immigration Data</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Given the sensitive nature of immigration-related information, we provide additional protections:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Attorney-client privilege applies to communications with our legal team</li>
                <li>Work product doctrine protects our analysis and recommendations</li>
                <li>Strict access controls limit who can view your case information</li>
                <li>Secure document destruction procedures for sensitive materials</li>
              </ul>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                This Privacy Policy is effective as of April 2026 and was last updated April 2026.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
