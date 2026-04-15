'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Check, X, ChevronDown, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';

const pricingTierKeys = [
  {
    nameKey: 'pricing.essential',
    descKey: 'pricing.essentialDesc',
    popular: false,
    featureKeys: [
      'pricingPage.feature1',
      'pricingPage.feature2',
      'pricingPage.feature3',
      'pricingPage.feature4',
      'pricingPage.feature5',
      'pricingPage.feature6',
      'pricingPage.feature7',
    ],
  },
  {
    nameKey: 'pricing.complete',
    descKey: 'pricing.completeDesc',
    popular: true,
    featureKeys: [
      'pricingPage.feature8',
      'pricingPage.feature9',
      'pricingPage.feature10',
      'pricingPage.feature11',
      'pricingPage.feature12',
      'pricingPage.feature13',
      'pricingPage.feature14',
    ],
  },
  {
    nameKey: 'pricing.premium',
    descKey: 'pricing.premiumDesc',
    popular: false,
    featureKeys: [
      'pricingPage.feature15',
      'pricingPage.feature16',
      'pricingPage.feature17',
      'pricingPage.feature18',
      'pricingPage.feature19',
      'pricingPage.feature20',
      'pricingPage.feature21',
    ],
  },
];

const caseTypesData = [
  { nameKey: 'pricingPage.caseTypeMarriage', essential: 999, complete: 1499, premium: 2499 },
  { nameKey: 'pricingPage.caseTypeK1', essential: 799, complete: 1199, premium: null },
  { nameKey: 'pricingPage.caseTypeCitizenship', essential: 499, complete: 699, premium: null },
  { nameKey: 'pricingPage.caseTypeWorkPermit', essential: 299, complete: 399, premium: null },
  { nameKey: 'pricingPage.caseTypeFamilySponsorship', essential: 599, complete: 899, premium: null },
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
  { key: 'pricingPage.pricingFaqGovFees' },
  { key: 'pricingPage.pricingFaqSwitchTiers' },
  { key: 'pricingPage.pricingFaqCustomCase' },
  { key: 'pricingPage.pricingFaqGuarantee' },
  { key: 'pricingPage.pricingFaqPaymentPlan' },
  { key: 'pricingPage.pricingFaqLicensed' },
  { key: 'pricingPage.pricingFaqAfterFile' },
];

function FAQItem({ faqKey }: { faqKey: string }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
      >
        <h3 className="font-semibold text-blue-900 text-left">{t(`${faqKey}.question`)}</h3>
        <ChevronDown
          className={`w-5 h-5 text-slate-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-slate-200 text-slate-700">
          {t(`${faqKey}.answer`)}
        </div>
      )}
    </div>
  );
}

function PricingPageInner() {
  const { t } = useTranslation();
  const [selectedCaseType, setSelectedCaseType] = useState(0);
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {showSuccess && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 bg-green-50 border border-green-200 rounded-lg p-4 z-50">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Payment successful!</h3>
              <p className="text-sm text-green-700 mt-1">Your order has been processed. Check your email for confirmation details.</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
            {t('pricing.heroTitle')}
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            {t('pricing.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTierKeys.map((tier, idx) => (
            <div
              key={idx}
              className={`relative ${tier.popular ? 'md:scale-105 md:z-10' : ''}`}
            >
              <Card
                className={`p-8 h-full flex flex-col border ${
                  tier.popular ? 'ring-2 ring-emerald-500 bg-white border-emerald-200' : 'border-slate-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {t('pricing.mostPopular')}
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">
                    {t(tier.nameKey)}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6">
                    {t(tier.descKey)}
                  </p>
                </div>

                {/* {t('pricing.factor')}s */}
                <ul className="space-y-4 mb-8 flex-1">
                  {tier.featureKeys.map((featureKey, fidx) => (
                    <li
                      key={fidx}
                      className="flex items-start gap-3 text-slate-700"
                    >
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="space-y-3">
                  <CheckoutButton
                    planId={t(tier.nameKey) === 'Essential' ? 'essential_marriage' : t(tier.nameKey) === 'Complete' ? 'complete_marriage' : 'premium_marriage'}
                    label={t('pricing.getStartedFree')}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  />
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={() => (window.location.href = '/assessment')}
                  >
                    {t('pricing.startTrial')}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing by Case Type */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-slate-600">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-4 px-4 font-semibold text-blue-900">
                  {t('pricing.caseType')}
                </th>
                <th className="text-center py-4 px-4 font-semibold text-blue-900">
                  {t('pricing.essential')}
                </th>
                <th className="text-center py-4 px-4 font-semibold text-blue-900">
                  {t('pricing.complete')}
                </th>
                <th className="text-center py-4 px-4 font-semibold text-blue-900">
                  {t('pricing.premium')}
                </th>
              </tr>
            </thead>
            <tbody>
              {caseTypesData.map((caseType, idx) => (
                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4 text-slate-700">{t(caseType.nameKey)}</td>
                  <td className="text-center py-4 px-4 text-blue-900 font-semibold">
                    ${caseType.essential}
                  </td>
                  <td className="text-center py-4 px-4 text-blue-900 font-semibold">
                    ${caseType.complete}
                  </td>
                  <td className="text-center py-4 px-4 text-slate-700">
                    {caseType.premium ? (
                      <span className="font-semibold text-blue-900">
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
        <div className="mt-12 bg-emerald-50 border border-emerald-200 rounded-lg p-8">
          <p className="text-center text-slate-600 mb-3">
            {t('pricing.governmentFeesNote')}
          </p>
          <p className="text-center text-blue-900 font-semibold">
            We show total all-in costs below so you know exactly what to expect.
          </p>
        </div>

        {/* All-in Cost Breakdown */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {/* Marriage Green Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Marriage Green Card (AOS)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Essential (our fee)</span>
                <span className="text-blue-900 font-semibold">$999</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">+ Government (I-485 + I-130)</span>
                <span className="text-blue-900 font-semibold">$2,065</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
                <span className="text-blue-900">Essential Total</span>
                <span className="text-emerald-600">$3,064</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="text-slate-600">Complete (our fee)</span>
                <span className="text-blue-900 font-semibold">$1,499</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">+ Government fees</span>
                <span className="text-blue-900 font-semibold">$2,065</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
                <span className="text-blue-900">Complete Total</span>
                <span className="text-emerald-600">$3,564</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="text-slate-600">Premium (our fee)</span>
                <span className="text-blue-900 font-semibold">$2,499</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">+ Government fees</span>
                <span className="text-blue-900 font-semibold">$2,065</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
                <span className="text-blue-900">Premium Total</span>
                <span className="text-emerald-600">$4,564</span>
              </div>
            </div>
          </div>

          {/* Citizenship */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Citizenship (N-400)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Essential (our fee)</span>
                <span className="text-blue-900 font-semibold">$499</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">+ Government (N-400)</span>
                <span className="text-blue-900 font-semibold">$710</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
                <span className="text-blue-900">Essential Total</span>
                <span className="text-emerald-600">$1,209</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="text-slate-600">Complete (our fee)</span>
                <span className="text-blue-900 font-semibold">$699</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">+ Government fees</span>
                <span className="text-blue-900 font-semibold">$710</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
                <span className="text-blue-900">Complete Total</span>
                <span className="text-emerald-600">$1,409</span>
              </div>
            </div>
          </div>

          {/* Work Permit */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Work Permit (I-765 Standalone)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Essential (our fee)</span>
                <span className="text-blue-900 font-semibold">$299</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">+ Government (I-765)</span>
                <span className="text-blue-900 font-semibold">$410</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
                <span className="text-blue-900">Essential Total</span>
                <span className="text-emerald-600">$709</span>
              </div>

              <p className="text-slate-600 text-xs mt-4 italic">
                Note: I-765 is FREE when filed with I-485. Work Permit fee only applies if filed standalone.
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Payment Info */}
        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-2">All prices shown are one-time service fees.</p>
          <p className="text-blue-900 font-semibold">
            Pay monthly with no interest. For example, Marriage GC Complete is just $124.92/month for 12 months.
          </p>
          <p className="text-slate-600 text-sm mt-4">Payment plans cover our legal fees only. Government fees are paid separately when your case is filed.</p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            {t('pricing.costComparison')}
          </h2>
          <p className="text-slate-600">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-full bg-white">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-4 font-semibold text-blue-900">
                  {t('pricing.factor')}
                </th>
                <th className="text-center py-4 px-4 font-semibold text-blue-900">
                  {t('pricing.traditional')}
                </th>
                <th className="text-center py-4 px-4 font-semibold text-blue-900">
                  {t('pricing.diy')}
                </th>
                <th className="text-center py-4 px-4 font-semibold text-blue-900">
                  {t('pricing.greencard')}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4 font-medium text-slate-700">
                    {row.feature}
                  </td>
                  <td className="text-center py-4 px-4">
                    {typeof row.traditional === 'boolean' ? (
                      row.traditional ? (
                        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-slate-700">{row.traditional}</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {typeof row.diy === 'boolean' ? (
                      row.diy ? (
                        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-slate-700">{row.diy}</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {typeof row.greencard === 'boolean' ? (
                      row.greencard ? (
                        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-slate-700">{row.greencard}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Note */}
        <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6 text-sm text-slate-700">
          <p className="mb-3">
            <span className="font-semibold text-blue-900">All-in costs shown for Marriage Green Card via Adjustment of Status:</span>
          </p>
          <ul className="space-y-2 ml-4">
            <li>{t('pricing.traditional')}: $5,000-$8,000 includes their legal fees and government filing</li>
            <li>DIY Platforms: $2,600-$3,300 for forms + $2,065 government fees you pay yourself</li>
            <li>{t('pricing.greencard')}: Includes attorney filing, document preparation, and case management</li>
          </ul>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600 text-center mb-4">
            Service fees shown are for attorney services only. Government filing fees (USCIS, DOS, etc.) are not included and will be billed separately. Fees vary by case type and complexity.
          </p>
          <p className="text-xs text-slate-600 text-center">
            Legal services provided by Partner Immigration Law, PLLC, a Florida-licensed immigration law firm. Jeremy Knight, Esq., Florida Bar No. 1009132, Fort Lauderdale, Broward County, Florida. {t('pricing.greencard')} is the technology platform, not the law firm. This is attorney advertising.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            {t('pricingPage.ctaHeading')}
          </h2>
          <p className="text-slate-600 mb-8">
            {t('pricingPage.ctaSubtitle')}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => (window.location.href = '/assessment')}
          >
            {t('pricingPage.ctaButton')}
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            {t('pricingPage.faqHeading')}
          </h2>
          <p className="text-slate-600">
            {t('pricingPage.faqSubtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} faqKey={`pricingPage.${faq.key}`} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">{t('pricingPage.faqCta')}</p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => (window.location.href = 'mailto:hello@greencard.ai')}
          >
            {t('pricingPage.contactButton')}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <PricingPageInner />
    </Suspense>
  );
}
