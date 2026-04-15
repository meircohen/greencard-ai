'use client';
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Shield, CheckCircle, AlertCircle, TrendingUp, Award, Lock } from 'lucide-react';
import { useTranslation } from '@/i18n';

export default function GuaranteePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500 rounded-full p-6 w-20 h-20 flex items-center justify-center">
              <CheckCircle size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">{t('guarantee.title')}</h1>
          <h2 className="text-2xl font-semibold mb-8">{t('guarantee.subtitle')}</h2>
          <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto">
            {t('guarantee.description')}
          </p>
          <Link href="/assessment">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
              {t('guarantee.ctaButton')}
            </Button>
          </Link>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">{t('guarantee.problemHeading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm">
              <div className="text-3xl font-bold text-red-500 mb-2">7%+</div>
              <p className="text-gray-700">of applications are rejected for preventable errors like wrong form version, missing signatures, or incorrect fees</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm">
              <div className="text-3xl font-bold text-red-500 mb-2">6-12 Months</div>
              <p className="text-gray-700">one rejection can delay your case while you correct errors and refile</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm">
              <div className="text-3xl font-bold text-red-500 mb-2">$500-2,000+</div>
              <p className="text-gray-700">RFEs (Requests for Evidence) cost thousands to respond to with a traditional attorney</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm">
              <div className="text-3xl font-bold text-red-500 mb-2">Invisible Risk</div>
              <p className="text-gray-700">DIY filers have no way to catch errors before USCIS receives the application</p>
            </div>
          </div>
        </div>
      </section>

      {/* Triple-Check Process */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">{t('guarantee.processHeading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg text-center">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">AI Scan</h3>
              <p className="text-gray-700">Every field validated against current USCIS requirements in real time. Our AI cross-references form versions, fee schedules, and filing rules</p>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg text-center">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Attorney Review</h3>
              <p className="text-gray-700">Licensed Florida attorney (Bar #1009132) personally reviews every application before filing. Attorney brings legal judgment that AI cannot</p>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-lg text-center">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Pre-Filing Audit</h3>
              <p className="text-gray-700">Final cross-reference check confirms all documents match the application, fees are correct, and filing address is accurate</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">{t('guarantee.coveredHeading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded flex gap-4">
              <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Form Preparation Errors</h4>
                <p className="text-gray-700 text-sm">Incorrect data entry, formatting, or field completion</p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded flex gap-4">
              <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Wrong USCIS Fee Calculation</h4>
                <p className="text-gray-700 text-sm">Incorrect fee amount or fee category</p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded flex gap-4">
              <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Incorrect Form Version</h4>
                <p className="text-gray-700 text-sm">Using outdated or wrong version of USCIS forms</p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded flex gap-4">
              <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Missing Required Fields</h4>
                <p className="text-gray-700 text-sm">Unsigned forms, missing dates, incomplete sections</p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded flex gap-4">
              <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Name/Date Inconsistencies</h4>
                <p className="text-gray-700 text-sm">Mismatched names, dates, or spellings across documents</p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded flex gap-4">
              <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Document Organization Errors</h4>
                <p className="text-gray-700 text-sm">Missing pages, incorrect page order, or organization</p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded flex gap-4">
              <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Filing Address Errors</h4>
                <p className="text-gray-700 text-sm">Wrong USCIS filing address or service address</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's NOT Covered */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">What Is NOT Covered (Transparency)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded flex gap-4">
              <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">USCIS Policy Changes After Filing</h4>
                <p className="text-gray-700 text-sm">New rules or requirements USCIS implements after we file your case</p>
              </div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded flex gap-4">
              <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Client Providing Incorrect Information</h4>
                <p className="text-gray-700 text-sm">If you provide false, outdated, or incomplete information</p>
              </div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded flex gap-4">
              <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Eligibility Issues</h4>
                <p className="text-gray-700 text-sm">USCIS denying based on your immigration status or eligibility</p>
              </div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded flex gap-4">
              <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Government Processing Delays</h4>
                <p className="text-gray-700 text-sm">USCIS taking longer than normal to process or adjudicate</p>
              </div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded flex gap-4">
              <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">RFEs for Additional Evidence</h4>
                <p className="text-gray-700 text-sm">Requests for evidence or information USCIS needs to evaluate your case</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RFE Shield Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Goal: Zero RFEs</h2>
          <p className="text-lg text-blue-100 mb-12">Our RFE prediction engine identifies high-risk areas in your application and flags them before filing. The goal is simple; get it right the first time</p>

          {/* Risk Score Example */}
          <div className="bg-white bg-opacity-10 backdrop-blur p-8 rounded-lg max-w-2xl mx-auto">
            <div className="text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Overall Risk Score</span>
                <span className="text-green-400 font-bold text-xl">4/100 (Low Risk)</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '4%' }}></div>
              </div>
              <p className="text-sm text-blue-100 mt-4 text-left">Our AI identified all critical requirements are met. This application has a very low risk of USCIS rejection for errors on our part</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">GreenCard.ai vs DIY vs Traditional Attorney</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-4 text-left font-bold">Feature</th>
                  <th className="p-4 text-center font-bold">GreenCard.ai</th>
                  <th className="p-4 text-center font-bold">DIY Filing</th>
                  <th className="p-4 text-center font-bold">Traditional Attorney</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">AI Form Validation</td>
                  <td className="p-4 text-center"><CheckCircle size={20} className="text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">Licensed Attorney Review</td>
                  <td className="p-4 text-center"><CheckCircle size={20} className="text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle size={20} className="text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">Error Refiling Guarantee</td>
                  <td className="p-4 text-center"><CheckCircle size={20} className="text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">Covered Government Fees</td>
                  <td className="p-4 text-center"><CheckCircle size={20} className="text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">RFE Risk Prediction</td>
                  <td className="p-4 text-center"><CheckCircle size={20} className="text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">Affordability</td>
                  <td className="p-4 text-center"><CheckCircle size={20} className="text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle size={20} className="text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><AlertCircle size={20} className="text-red-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">{t('guarantee.trustHeading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <Award size={48} className="text-blue-900 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2">Florida Licensed Attorney</h3>
              <p className="text-gray-700">Bar #1009132. Licensed to practice law and file cases with USCIS</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <Lock size={48} className="text-blue-900 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2">Triple-Verified Process</h3>
              <p className="text-gray-700">AI validation, attorney review, pre-filing audit. Nothing slips through</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <Shield size={48} className="text-blue-900 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2">We Back Our Work</h3>
              <p className="text-gray-700">Refile free plus government fees covered if we make a mistake</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t('guarantee.bottomCtaHeading')}</h2>
          <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto">
            {t('guarantee.bottomCtaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
                {t('hero.ctaPrimary')}
              </Button>
            </Link>
            <a href="https://wa.me/19547776678" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                {t('guarantee.chatWhatsapp')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
