'use client';
import { useTranslation } from '@/i18n';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Shield,
  AlertCircle,
  FileText,
  Users,
  ArrowRight,
} from 'lucide-react';

export default function VerifyPage() {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'verified' | 'warning' | 'unable' | null;
    message: string;
    details: string;
  }>({
    status: null,
    message: '',
    details: '',
  });

  const handleVerify = () => {
    if (!searchInput.trim()) {
      setVerificationResult({
        status: 'warning',
        message: 'WARNING - Not a licensed attorney',
        details: 'No search term provided',
      });
      return;
    }

    const input = searchInput.toLowerCase();

    if (input === 'jeremy knight' || input === '1009132') {
      setVerificationResult({
        status: 'verified',
        message: 'VERIFIED - Licensed FL Attorney',
        details: 'Bar Number: 1009132, Jeremy Knight, Active License',
      });
    } else if (input.includes('notario')) {
      setVerificationResult({
        status: 'warning',
        message: 'WARNING - Not a licensed attorney',
        details:
          'This person identifies as a Notario. In the US, this does not constitute legal authorization.',
      });
    } else {
      setVerificationResult({
        status: 'unable',
        message: 'UNABLE TO VERIFY - Exercise caution',
        details:
          'We could not find a match in our database. Always verify at floridabar.org',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const redFlags = [
    {
      title: 'They call themselves "Notario Publico"',
      description:
        'In Latin America this means a legal professional. In the US, it does not.',
      icon: AlertTriangle,
    },
    {
      title: 'They guarantee approval',
      description: 'No one can guarantee USCIS approval.',
      icon: AlertTriangle,
    },
    {
      title: 'They ask for cash only',
      description:
        'Legitimate firms accept credit cards and provide receipts.',
      icon: AlertTriangle,
    },
    {
      title: "They won't give you a Bar number",
      description: 'Every licensed attorney has one.',
      icon: AlertTriangle,
    },
    {
      title: 'They contact you first',
      description: "Legitimate attorneys don't cold-call immigrants.",
      icon: AlertTriangle,
    },
    {
      title: 'They rush you to sign',
      description: 'Pressure tactics are a red flag.',
      icon: AlertTriangle,
    },
  ];

  const scamSteps = [
    {
      step: 'Step 1',
      title: 'Stop all payments immediately',
      description:
        'Do not send any additional money. Contact your bank immediately if payments were made.',
    },
    {
      step: 'Step 2',
      title: 'Gather all documents and receipts',
      description:
        'Collect every document, email, text, and receipt from your interactions.',
    },
    {
      step: 'Step 3',
      title: 'Report to the FL Bar, FTC, and local police',
      description:
        'File formal complaints with all three entities. Keep copies of all reports.',
    },
    {
      step: 'Step 4',
      title: 'Contact us for emergency case review ($99)',
      description:
        'Our licensed attorneys can assess damage and help recover your case.',
    },
  ];

  const getResultColor = (status: string) => {
    if (status === 'verified') return 'border-green-500 bg-green-50';
    if (status === 'warning') return 'border-red-500 bg-red-50';
    return 'border-amber-500 bg-amber-50';
  };

  const getResultTextColor = (status: string) => {
    if (status === 'verified') return 'text-green-700';
    if (status === 'warning') return 'text-red-700';
    return 'text-amber-700';
  };

  const getIconColor = (status: string) => {
    if (status === 'verified') return 'text-green-600';
    if (status === 'warning') return 'text-red-600';
    return 'text-amber-600';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Is Your Immigration Provider Legitimate?
            </h1>
            <p className="text-xl mb-12 text-blue-100">
              Thousands of immigrants lose money to scams every year. Check any
              provider instantly, for free.
            </p>

            {/* Search Input */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a name, company, or Bar number"
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  onClick={handleVerify}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300"
                >
                  Check
                </button>
              </div>

              {/* Verification Result */}
              {verificationResult.status && (
                <div
                  className={`mt-6 p-4 border-2 rounded-lg ${getResultColor(
                    verificationResult.status
                  )}`}
                >
                  <div className="flex items-start gap-4">
                    {verificationResult.status === 'verified' ? (
                      <CheckCircle className={`w-8 h-8 flex-shrink-0 ${getIconColor(verificationResult.status)}`} />
                    ) : (
                      <AlertTriangle className={`w-8 h-8 flex-shrink-0 ${getIconColor(verificationResult.status)}`} />
                    )}
                    <div>
                      <p
                        className={`font-bold text-lg ${getResultTextColor(
                          verificationResult.status
                        )}`}
                      >
                        {verificationResult.message}
                      </p>
                      <p className="text-gray-700 mt-2">
                        {verificationResult.details}
                      </p>
                      <p className="text-sm text-gray-600 mt-3 italic">
                        Disclaimer: This is a demonstration. Always verify
                        attorneys at floridabar.org
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Scam Alert Banner */}
        <section className="bg-red-50 border-l-4 border-red-600 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-red-900 mb-4">
                  The ABA issued a national fraud alert in 2025 about
                  immigration scams
                </h2>
                <p className="text-red-800 mb-4 text-lg">
                  Fake lawyers on TikTok, WhatsApp, and Facebook are destroying
                  cases and lives.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-red-700">
                  <div className="bg-white rounded p-3 border border-red-200">
                    <p className="font-bold">$500M+</p>
                    <p className="text-sm">
                      Lost annually to immigration scams
                    </p>
                  </div>
                  <div className="bg-white rounded p-3 border border-red-200">
                    <p className="font-bold">1 in 3</p>
                    <p className="text-sm">
                      Immigrants have encountered a scam provider
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Red Flags Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-blue-900">
              How to Spot an Immigration Scam
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redFlags.map((flag, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500"
                >
                  <AlertTriangle className="w-6 h-6 text-red-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">{flag.title}</h3>
                  <p className="text-gray-700">{flag.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What To Do If Scammed */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-blue-900">
              What To Do If You Have Been Scammed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {scamSteps.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                      <span className="text-red-700 font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Salva tu Caso Preview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-6 items-start">
              <Shield className="w-12 h-12 flex-shrink-0" />
              <div className="flex-grow">
                <h2 className="text-3xl font-bold mb-4">
                  Already been scammed? Our emergency service can help save
                  your case
                </h2>
                <p className="text-blue-100 mb-6 text-lg">
                  Licensed attorney reviews your situation within 48 hours.
                  Most cases can be recovered or filed correctly before
                  deadlines are missed.
                </p>
                <Link href="/contact">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Get Emergency Help
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Filing Badge */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-blue-900">
                  Every filing comes with verification
                </h2>
                <p className="text-gray-700 mb-4 text-lg">
                  Every case filed by GreenCard.ai comes with a verified filing
                  badge.
                </p>
                <p className="text-gray-700 mb-6">
                  The QR code on your filing receipt proves real attorney
                  representation. Scan it anytime to confirm your case was
                  handled by a licensed professional.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">
                    Verified Filing Badge
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan QR code to verify
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Reporting */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">
              Help Protect Your Community
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Know about a scam? Report it anonymously. We compile reports and
              share with authorities.
            </p>
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Scammer's Name or Company
                  </label>
                  <input
                    type="text"
                    placeholder="Name or business name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, state"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description (be specific)
                  </label>
                  <textarea
                    placeholder="What happened? How much did you lose? Any contact information?"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 w-full">
                  Submit Report (Anonymous)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">File Your Case the Right Way</h2>
            <p className="text-xl mb-8 text-blue-100">
              Licensed attorney. Verified filing. Real protection.
            </p>
            <Link href="/assessment">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                Start Your Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
