'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  FileText,
  Clock,
  Shield,
  DollarSign,
} from 'lucide-react';

export default function RescuePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const painPoints = [
    {
      title: 'Attorney went silent',
      description: 'Weeks or months without communication. No updates. No answers.',
      icon: AlertCircle,
      color: 'red',
    },
    {
      title: 'Ghosted after payment',
      description: 'Money collected, file untouched. No work done. No accountability.',
      icon: AlertCircle,
      color: 'red',
    },
    {
      title: 'Shuffled between staff',
      description: 'Re-explaining your story every call. Inconsistent advice. No continuity.',
      icon: AlertCircle,
      color: 'red',
    },
    {
      title: 'Mistakes on filed forms',
      description: 'Wrong fees, wrong versions, inconsistent names. USCIS noticed.',
      icon: AlertCircle,
      color: 'amber',
    },
    {
      title: "Can't get a refund",
      description: 'Fees collected for work not done. Attorney refuses to refund.',
      icon: AlertCircle,
      color: 'red',
    },
    {
      title: 'Language barrier',
      description: "Attorney doesn't speak Spanish. Instructions unclear. Confusion.",
      icon: AlertCircle,
      color: 'amber',
    },
    {
      title: 'Attorney left or retired',
      description: 'Solo practice closed. Your file orphaned. No one to respond.',
      icon: AlertCircle,
      color: 'red',
    },
  ];

  const transferSteps = [
    {
      number: 1,
      title: 'Terminate Old Attorney',
      description: 'You send written notice. We provide the template.',
    },
    {
      number: 2,
      title: 'File Form G-28',
      description: 'Jeremy Knight files a Notice of Entry of Appearance. Free, no USCIS fee.',
    },
    {
      number: 3,
      title: 'USCIS Updates Records',
      description: 'All future notices, RFEs, and interview letters now route to GreenCard.ai.',
    },
    {
      number: 4,
      title: 'Case File Transfer',
      description: 'You request your file from the old attorney. They are legally required to provide it.',
    },
    {
      number: 5,
      title: 'Attorney Audit',
      description: 'We review everything that was filed, identify errors, and take over.',
    },
  ];

  const serviceTiers = [
    {
      name: 'Free Case Audit',
      price: '$0',
      features: [
        '20-minute attorney review of what was filed',
        'Written assessment of where your case stands',
        'No obligation, no pressure',
      ],
      highlight: false,
      cta: 'Start Your Free Audit',
    },
    {
      name: 'Case Rescue Transfer',
      price: '$299-$499',
      features: [
        'Full document review and audit',
        'G-28 filing with USCIS',
        'Error identification and remediation plan',
      ],
      highlight: true,
      cta: 'Start Case Rescue',
    },
    {
      name: 'Notario Rescue',
      price: '$599-$999',
      features: [
        'Emergency assessment of fraudulently filed applications',
        'May require withdrawing applications and filing corrections',
        'Response to denials caused by fraud',
      ],
      highlight: false,
      cta: 'Emergency Assessment',
    },
  ];

  const faqItems = [
    {
      question: 'Will switching attorneys delay my case?',
      answer: 'No. Filing a G-28 is immediate and USCIS processes it without delay. Your case timeline is not affected by an attorney change.',
    },
    {
      question: 'What if my interview is next week?',
      answer: 'A new attorney can file the G-28 and appear at your interview the same day. We handle emergency transfers regularly.',
    },
    {
      question: "What if my old attorney won't release my file?",
      answer: 'They are legally required to. We help you with the request and can follow up with bar complaints if necessary.',
    },
    {
      question: 'Is the Free Case Audit really free?',
      answer: 'Yes. No credit card, no obligation. 20 minutes with an attorney. We just want to understand your situation.',
    },
    {
      question: 'What if a notario filed my case?',
      answer: 'This is more complex but often fixable. Our Notario Rescue tier handles exactly this. We may need to withdraw fraudulent applications and file corrections.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Switch to GreenCard.ai Mid-Case. Zero Risk.
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              Stuck with a bad attorney? Ghosted after paying? Case filed by a notario? We take over your case, fix what's broken, and get you back on track. Switching attorneys does NOT hurt your case at USCIS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Free Case Audit
              </Button>
              <Button
                onClick={() => document.getElementById('process-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold"
              >
                Learn How Transfers Work
              </Button>
            </div>
          </div>
        </section>

        {/* Why Clients Switch */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Why Clients Switch
            </h2>
            <p className="text-center text-gray-600 mb-12">
              These situations are more common than you think. We fix them every week.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {painPoints.map((point, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-l-4 ${
                    point.color === 'red'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-amber-50 border-amber-500'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-700">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transfer Process */}
        <section id="process-section" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              The Transfer Process
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Five straightforward steps to get your case under control.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
              {transferSteps.map((step) => (
                <div key={step.number} className="flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    {step.number < 5 && (
                      <div className="hidden md:block flex-grow h-1 bg-blue-200 mx-2">
                        <div className="h-full bg-blue-900 w-full"></div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Callout Box */}
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                The G-28 Can Be Filed the Day of an Interview
              </h3>
              <p className="text-green-800">
                USCIS does NOT view attorney changes negatively. You can swap attorneys at the last moment if needed.
              </p>
            </div>
          </div>
        </section>

        {/* Service Tiers */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Three Service Tiers
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Choose the level of support your case needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {serviceTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-8 flex flex-col ${
                    tier.highlight
                      ? 'bg-blue-900 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-2 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-2xl font-bold mb-6 ${tier.highlight ? 'text-blue-100' : 'text-blue-900'}`}>
                    {tier.price}
                  </p>
                  <ul className="flex-grow mb-8 space-y-3">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start">
                        <CheckCircle
                          className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                            tier.highlight ? 'text-green-400' : 'text-green-600'
                          }`}
                        />
                        <span className={tier.highlight ? 'text-blue-50' : 'text-gray-700'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full py-2 rounded-lg font-semibold ${
                      tier.highlight
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transfer Credit */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Fresh Start Transfer Credit
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Get $150-$200 discount on GreenCard.ai service fees for clients transferring from another attorney.
              </p>
              <p className="text-gray-600">
                Your case is partially prepared, so the attorney workload is genuinely reduced. We pass that savings directly to you.
              </p>
            </div>
          </div>
        </section>

        {/* Free RFE Review */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-amber-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Got an RFE? Free Review.
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              We will review your Request for Evidence and tell you how to respond, completely free. RFE recipients are in crisis mode. We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Message on WhatsApp
              </Button>
              <Button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Call (954) 777-6678
              </Button>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="form-section" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Free Case Audit
            </h2>
            <p className="text-center text-gray-600 mb-8">
              20 minutes with Jeremy Knight. No credit card required.
            </p>

            <form className="bg-white border border-gray-200 rounded-lg p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="(555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Case Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent">
                  <option>Select your case type</option>
                  <option>Green Card (EB)</option>
                  <option>Green Card (Family)</option>
                  <option>Marriage Based</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Brief description of your situation
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  rows={4}
                  placeholder="What happened with your previous attorney? What are you most concerned about?"
                ></textarea>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
                Request Your Free Audit
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our terms. No spam, no sharing.
              </p>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 flex items-center justify-between"
                  >
                    {item.question}
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Your Case Deserves Better
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Free Case Audit. No obligation. Licensed attorney review.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Get Your Free Case Audit
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-blue-100">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                <a href="https://wa.me/19547776678" className="hover:text-white">
                  WhatsApp: wa.me/19547776678
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>(954) 777-6678</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
