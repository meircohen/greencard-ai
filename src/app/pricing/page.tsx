'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, X, ChevronDown } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Essential',
    description: 'Everything you need to file',
    popular: false,
    features: [
      'All forms prepared',
      'Attorney review and filing with USCIS',
      'Document checklist and upload portal',
      'Case status tracking',
      'Bilingual support (EN/ES)',
      'One round of RFE response',
      '14-day money-back guarantee',
    ],
  },
  {
    name: 'Complete',
    description: 'Most popular choice',
    popular: true,
    features: [
      'Everything in Essential',
      'Two 30-minute attorney consultations',
      'Priority processing (5 business days)',
      'Interview preparation session',
      'Unlimited RFE support',
      'Dedicated case manager',
      'Priority support (4-hour response)',
    ],
  },
  {
    name: 'Premium',
    description: 'Maximum support and speed',
    popular: false,
    features: [
      'Everything in Complete',
      'Unlimited attorney consultations',
      '48-hour expedited processing',
      'Mock interview preparation',
      'Co-applicant I-864 portal',
      'Document translation assistance',
      '1 year post-approval support',
    ],
  },
];

const caseTypes = [
  { name: 'Marriage Green Card', essential: 999, complete: 1499, premium: 2499 },
  { name: 'K-1 Fiance Visa', essential: 799, complete: 1199, premium: null },
  { name: 'Citizenship (N-400)', essential: 499, complete: 699, premium: null },
  { name: 'Work Permit (I-765)', essential: 299, complete: 399, premium: null },
  { name: 'Family Sponsorship', essential: 599, complete: 899, premium: null },
];

const governmentFees = {
  'Marriage Green Card (AOS)': { i485: 1440, i130: 625, total: 2065 },
  'Citizenship (N-400)': { n400: 710, total: 710 },
  'Work Permit (I-765) - Standalone': { i765: 410, total: 410 },
};

const comparisonData = [
  {
    feature: 'Cost (all-in)',
    traditional: '$5,000 - $8,000',
    diy: '$2,600 - $3,300',
    greencard: '$3,064 - $4,564',
  },
  {
    feature: 'Attorney files for you?',
    traditional: true,
    diy: false,
    greencard: true,
  },
  {
    feature: 'Case tracking?',
    traditional: false,
    diy: false,
    greencard: true,
  },
  {
    feature: 'RFE support?',
    traditional: true,
    diy: false,
    greencard: true,
  },
  {
    feature: 'Bilingual support?',
    traditional: false,
    diy: false,
    greencard: true,
  },
  {
    feature: 'Money-back guarantee?',
    traditional: false,
    diy: false,
    greencard: true,
  },
];

const faqs = [
  {
    question: 'How much are government filing fees?',
    answer:
      'Government fees are separate and paid directly to USCIS. Common fees: I-485 (Green Card) = $1,440, I-130 (Petition) = $625, I-765 (Work Permit) = $410, N-400 (Citizenship) = $710. We show total all-in costs on this page so you know exactly what to expect.',
  },
  {
    question: 'Can I switch tiers?',
    answer:
      'Yes, you can upgrade to a higher tier at any time. If you upgrade mid-case, you will only pay the difference between tiers.',
  },
  {
    question: 'What if I need help with a case type not listed?',
    answer:
      'Contact us for a custom quote. We handle employment visas, investor visas, and other complex cases. Our immigration attorneys can provide a personalized pricing estimate.',
  },
  {
    question: 'What is your money-back guarantee?',
    answer:
      'If you are not satisfied with our Essential or Complete tier services within 14 days, we will refund your fees in full. No questions asked.',
  },
  {
    question: 'Do you offer payment plans?',
    answer:
      'Yes! Payment plans are available for our legal service fees with no interest. For example, Marriage GC Complete ($1,499) can be split into 12 payments of $124.92/month. Government fees are paid separately when your case is filed.',
  },
  {
    question: 'Are you licensed attorneys?',
    answer:
      'Yes, GreenCard.ai is led by licensed immigration attorneys. We handle all legal work directly, not through third-party partners. Our team is registered with USCIS and accredited representatives.',
  },
  {
    question: 'What happens after I file?',
    answer:
      'We track your case with USCIS throughout the entire process. You get real-time status updates via our portal, and our team is available for RFE responses, interview prep, and post-approval guidance.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <h3 className="font-semibold text-primary text-left">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-secondary transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-white/5 text-secondary">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [selectedCaseType, setSelectedCaseType] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-deep to-midnight">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Affordable immigration law at your fingertips
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Licensed attorneys, transparent pricing, and dedicated support. Five times cheaper than traditional firms. With more service than online platforms.
          </p>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative ${tier.popular ? 'md:scale-105 md:z-10' : ''}`}
            >
              <Card
                className={`p-8 h-full flex flex-col ${
                  tier.popular ? 'ring-2 ring-green-500 bg-surface/60' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-secondary text-sm mb-6">
                    {tier.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feature, fidx) => (
                    <li
                      key={fidx}
                      className="flex items-start gap-3 text-secondary"
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => (window.location.href = '/assessment')}
                >
                  Start Free Evaluation
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing by Case Type */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Pricing by case type
          </h2>
          <p className="text-secondary">
            See exactly what your case costs before you commit
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 font-semibold text-primary">
                  Case Type
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary">
                  Essential
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary">
                  Complete
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {caseTypes.map((caseType, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4 text-secondary">{caseType.name}</td>
                  <td className="text-center py-4 px-4 text-primary font-semibold">
                    ${caseType.essential}
                  </td>
                  <td className="text-center py-4 px-4 text-primary font-semibold">
                    ${caseType.complete}
                  </td>
                  <td className="text-center py-4 px-4 text-secondary">
                    {caseType.premium ? (
                      <span className="font-semibold text-primary">
                        ${caseType.premium}
                      </span>
                    ) : (
                      <span>Not available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Government Fees Callout */}
        <div className="mt-12 bg-green-500/10 border border-green-500/30 rounded-lg p-8">
          <p className="text-center text-secondary mb-3">
            All prices shown are our legal service fees. USCIS government filing fees are separate and paid directly to the government.
          </p>
          <p className="text-center text-primary font-semibold">
            We show total all-in costs below so you know exactly what to expect.
          </p>
        </div>

        {/* All-in Cost Breakdown */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {/* Marriage Green Card */}
          <div className="bg-surface/30 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Marriage Green Card (AOS)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Essential (our fee)</span>
                <span className="text-primary font-semibold">$999</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">+ Government (I-485 + I-130)</span>
                <span className="text-primary font-semibold">$2,065</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-primary">Essential Total</span>
                <span className="text-green-500">$3,064</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-secondary">Complete (our fee)</span>
                <span className="text-primary font-semibold">$1,499</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">+ Government fees</span>
                <span className="text-primary font-semibold">$2,065</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-primary">Complete Total</span>
                <span className="text-green-500">$3,564</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-secondary">Premium (our fee)</span>
                <span className="text-primary font-semibold">$2,499</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">+ Government fees</span>
                <span className="text-primary font-semibold">$2,065</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-primary">Premium Total</span>
                <span className="text-green-500">$4,564</span>
              </div>
            </div>
          </div>

          {/* Citizenship */}
          <div className="bg-surface/30 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Citizenship (N-400)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Essential (our fee)</span>
                <span className="text-primary font-semibold">$499</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">+ Government (N-400)</span>
                <span className="text-primary font-semibold">$710</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-primary">Essential Total</span>
                <span className="text-green-500">$1,209</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-secondary">Complete (our fee)</span>
                <span className="text-primary font-semibold">$699</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">+ Government fees</span>
                <span className="text-primary font-semibold">$710</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-primary">Complete Total</span>
                <span className="text-green-500">$1,409</span>
              </div>
            </div>
          </div>

          {/* Work Permit */}
          <div className="bg-surface/30 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Work Permit (I-765 Standalone)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Essential (our fee)</span>
                <span className="text-primary font-semibold">$299</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">+ Government (I-765)</span>
                <span className="text-primary font-semibold">$410</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-primary">Essential Total</span>
                <span className="text-green-500">$709</span>
              </div>

              <p className="text-secondary text-xs mt-4 italic">
                Note: I-765 is FREE when filed with I-485. Work Permit fee only applies if filed standalone.
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Payment Info */}
        <div className="mt-12 bg-surface/30 border border-white/10 rounded-lg p-8 text-center">
          <p className="text-secondary mb-2">All prices shown are one-time service fees.</p>
          <p className="text-primary font-semibold">
            Pay monthly with no interest. For example, Marriage GC Complete is just $124.92/month for 12 months.
          </p>
          <p className="text-secondary text-sm mt-4">Payment plans cover our legal fees only. Government fees are paid separately when your case is filed.</p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            How we compare
          </h2>
          <p className="text-secondary">
            Affordable pricing with attorney-level service
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 font-semibold text-primary">
                  Feature
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary">
                  Traditional Attorney
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary">
                  DIY/Online Platforms
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary">
                  GreenCard.ai
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4 font-medium text-secondary">
                    {row.feature}
                  </td>
                  <td className="text-center py-4 px-4">
                    {typeof row.traditional === 'boolean' ? (
                      row.traditional ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-secondary">{row.traditional}</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {typeof row.diy === 'boolean' ? (
                      row.diy ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-secondary">{row.diy}</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {typeof row.greencard === 'boolean' ? (
                      row.greencard ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-secondary">{row.greencard}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Note */}
        <div className="mt-8 bg-surface/30 border border-white/10 rounded-lg p-6 text-sm text-secondary">
          <p className="mb-3">
            <span className="font-semibold text-primary">All-in costs shown for Marriage Green Card via Adjustment of Status:</span>
          </p>
          <ul className="space-y-2 ml-4">
            <li>Traditional Attorney: $5,000-$8,000 includes their legal fees and government filing</li>
            <li>DIY Platforms: $2,600-$3,300 for forms + $2,065 government fees you pay yourself</li>
            <li>GreenCard.ai: Includes attorney filing, document preparation, and case management</li>
          </ul>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto">
        <div className="bg-surface/30 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-secondary text-center mb-4">
            Service fees shown are for attorney services only. Government filing fees (USCIS, DOS, etc.) are not included and will be billed separately. Fees vary by case type and complexity.
          </p>
          <p className="text-xs text-secondary text-center">
            Legal services provided by Partner Immigration Law, PLLC, a Florida-licensed immigration law firm. Jeremy Knight, Esq., Florida Bar No. 1009132, Fort Lauderdale, Broward County, Florida. GreenCard.ai is the technology platform, not the law firm. This is attorney advertising.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Ready to move forward with your case?
          </h2>
          <p className="text-secondary mb-8">
            Get a personalized quote and see your complete service breakdown.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => (window.location.href = '/assessment')}
          >
            Start Your Free Case Evaluation
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Frequently asked questions
          </h2>
          <p className="text-secondary">
            Questions about our pricing and services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-secondary mb-4">Still have questions?</p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => (window.location.href = 'mailto:hello@greencard.ai')}
          >
            Contact Us
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
