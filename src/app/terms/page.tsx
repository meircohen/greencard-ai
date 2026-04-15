'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Terms of Service
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
            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <p className="text-slate-900 font-semibold mb-2">Important Notice</p>
              <p className="text-slate-700">
                Using GreenCard.ai does not create an attorney-client relationship with Partner Immigration Law, PLLC unless and until you have signed an engagement letter and our firm has agreed to represent you. Please read these Terms of Service carefully.
              </p>
            </div>

            {/* 1. Acceptance of Terms */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing, browsing, and using GreenCard.ai and its services ("Services"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Services. We reserve the right to modify these Terms at any time. Your continued use of the Services following the posting of modified Terms constitutes your acceptance of the modifications.
              </p>
            </div>

            {/* 2. Service Description */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Services</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                GreenCard.ai provides:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Immigration visa assessment tools</li>
                <li>Immigration form guidance and preparation tools</li>
                <li>Case tracking and document management services</li>
                <li>Access to immigration information and resources</li>
                <li>Optional attorney-backed legal services through our partner firm</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                These Services are provided as informational tools to assist you in your immigration journey. The Services do not constitute legal advice unless you have engaged our firm as your attorney through a signed engagement letter.
              </p>
            </div>

            {/* 3. Attorney-Client Relationship Disclaimer */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Attorney-Client Relationship Disclaimer</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                IMPORTANT: No attorney-client relationship exists between you and Partner Immigration Law, PLLC (Jeremy Knight, Esq., Florida Bar No. 1009132) unless and until all of the following occur:
              </p>
              <ol className="list-decimal pl-6 text-slate-600 space-y-2">
                <li>You and the firm have executed a written engagement letter</li>
                <li>The firm has agreed in writing to represent you in your specific matter</li>
                <li>You have paid any required retainer or fees</li>
              </ol>
              <p className="text-slate-600 leading-relaxed mt-4">
                GreenCard.ai is the technology platform that facilitates your engagement with Partner Immigration Law, PLLC. Use of GreenCard.ai does not create an attorney-client relationship. Information provided through the platform is general in nature and may not apply to your specific situation. Do not rely on information provided through the Services as a substitute for legal advice from a licensed attorney.
              </p>
            </div>

            {/* 4. User Responsibilities */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. User Responsibilities</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                By using the Services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Provide accurate, truthful, and complete information</li>
                <li>Update information as needed to keep it current and accurate</li>
                <li>Maintain confidentiality of your account credentials</li>
                <li>Use the Services only for lawful purposes</li>
                <li>Not interfere with or disrupt the Services</li>
                <li>Not attempt to gain unauthorized access to the Services</li>
                <li>Not transmit viruses, malware, or harmful code</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>

            {/* 5. Payment and Billing */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Payment and Billing</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Certain Services may require payment. Payment terms include:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>All fees and charges are in US dollars</li>
                <li>Monthly subscriptions renew automatically unless canceled</li>
                <li>You may cancel your subscription at any time</li>
                <li>Cancellation does not affect previously paid services</li>
                <li>We accept all major credit cards and bank transfers</li>
                <li>Billing occurs on the same date each month or as specified</li>
              </ul>
            </div>

            {/* 6. Refund Policy */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Refund Policy</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We offer a 14-day money-back guarantee on all paid plans:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Full refund available within 14 days of purchase if you are not satisfied</li>
                <li>Refund requests must be submitted in writing to hello@greencard.ai</li>
                <li>Attorney services are not refundable once provided</li>
                <li>Refunds are processed within 5-7 business days</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Once an attorney has commenced work on your case, fees for services already rendered are not refundable.
              </p>
            </div>

            {/* 7. Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                TO THE FULLEST EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>The Services are provided "as is" without warranties of any kind</li>
                <li>We do not warrant that the Services will be uninterrupted or error-free</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid for Services</li>
                <li>We are not responsible for third-party services or content</li>
                <li>Use of the Services is at your own risk</li>
              </ul>
            </div>

            {/* 8. Intellectual Property */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                GreenCard.ai and its content are protected by intellectual property laws:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>All content, design, and technology are owned by Partner Immigration Law, PLLC</li>
                <li>You may not copy, modify, or distribute our content without permission</li>
                <li>You retain ownership of information you provide</li>
                <li>You grant us a license to use your information to provide Services</li>
                <li>Documents you create are yours, but we retain access to assist you</li>
              </ul>
            </div>

            {/* 9. Dispute Resolution */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Dispute Resolution</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Any disputes arising from these Terms shall be resolved as follows:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>First, we will attempt to resolve disputes informally</li>
                <li>If informal resolution fails, disputes will be resolved through binding arbitration</li>
                <li>Arbitration shall take place in Broward County, Florida</li>
                <li>You agree to waive your right to a jury trial</li>
                <li>You agree to waive your right to bring class action suits</li>
              </ul>
            </div>

            {/* 10. Governing Law */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Governing Law</h2>
              <p className="text-slate-600 leading-relaxed">
                These Terms of Service are governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any legal action or proceeding relating to these Terms shall be brought exclusively in the courts of Broward County, Florida.
              </p>
            </div>

            {/* 11. Attorney Advertising Disclaimer */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Attorney Advertising Disclaimer</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                ATTORNEY ADVERTISING NOTICE: This website is a commercial advertisement. GreenCard.ai is a technology platform operated by Partner Immigration Law, PLLC. Attorney services are provided by Partner Immigration Law, PLLC, a Florida-licensed law firm authorized to practice immigration law in the United States.
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Jeremy "Yirmi" Knight, Esq., Florida Bar No. 1009132, is located in Fort Lauderdale, Broward County, Florida</li>
                <li>GreenCard.ai is the technology platform; Partner Immigration Law, PLLC is the law firm providing legal services</li>
                <li>This is not a solicitation of a specific client</li>
                <li>Clients are not guaranteed specific outcomes</li>
                <li>Past performance does not guarantee future results</li>
              </ul>
            </div>

            {/* 12. Accessibility Statement */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Accessibility Statement</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We are committed to ensuring digital accessibility for all users:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>We strive to meet WCAG 2.1 AA accessibility standards</li>
                <li>The site is designed to work with screen readers</li>
                <li>Keyboard navigation is supported throughout the site</li>
                <li>We continue to improve accessibility features</li>
                <li>If you encounter accessibility issues, please contact us at hello@greencard.ai</li>
              </ul>
            </div>

            {/* 13. Termination */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Termination</h2>
              <p className="text-slate-600 leading-relaxed">
                We may terminate or suspend your account and access to the Services at any time, with or without cause, with or without notice. Upon termination, your right to use the Services immediately ceases. We will make available any documents you created, but we may delete data after a reasonable retention period.
              </p>
            </div>

            {/* 14. Modifications to Services */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Modifications to Services</h2>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to modify, discontinue, or terminate the Services at any time. We will attempt to provide notice of material changes, but are not obligated to do so.
              </p>
            </div>

            {/* 15. Entire Agreement */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Entire Agreement</h2>
              <p className="text-slate-600 leading-relaxed">
                These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and Partner Immigration Law, PLLC regarding your use of the Services. These Terms supersede all prior agreements, understandings, and negotiations.
              </p>
            </div>

            {/* 16. Severability */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Severability</h2>
              <p className="text-slate-600 leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in effect to the fullest extent permitted by law.
              </p>
            </div>

            {/* 17. Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">17. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-2">
                <p className="text-slate-900 font-semibold">Partner Immigration Law, PLLC</p>
                <p className="text-slate-600">Operating as GreenCard.ai</p>
                <p className="text-slate-600">Fort Lauderdale, Florida</p>
                <p className="text-slate-600">Email: <a href="mailto:hello@greencard.ai" className="text-emerald-600 hover:underline">hello@greencard.ai</a></p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                These Terms of Service are effective as of April 2026 and were last updated April 2026.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
