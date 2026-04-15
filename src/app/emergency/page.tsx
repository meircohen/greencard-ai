'use client';
import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  AlertTriangle,
  Phone,
  FileText,
  Clock,
  CheckCircle,
  Upload,
  Shield,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

export default function EmergencyPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    situation: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [fileHover, setFileHover] = useState(false);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        situation: '',
        description: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  const scenarios = [
    {
      icon: AlertTriangle,
      title: 'Scam Victim',
      description:
        'A notario or fake lawyer filed your case incorrectly or took your money',
    },
    {
      icon: FileText,
      title: 'Case Denied',
      description:
        'USCIS denied your application and you do not know why',
    },
    {
      icon: Clock,
      title: 'RFE Received',
      description:
        'You received a Request for Evidence and the deadline is approaching',
    },
    {
      icon: AlertTriangle,
      title: 'Missed Deadline',
      description:
        'You missed a filing deadline or interview and need help fast',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Contact Us',
      description:
        'Call, WhatsApp, or fill out the form. Available 7 days a week.',
    },
    {
      number: '2',
      title: 'Attorney Review',
      description:
        'A licensed FL immigration attorney reviews your documents and situation within 48 hours',
    },
    {
      number: '3',
      title: 'Action Plan',
      description:
        'You receive a clear, written plan: what happened, what can be fixed, and what it will cost',
    },
  ];

  const faqs = [
    {
      question: 'How fast will I hear back?',
      answer:
        'Within 48 hours, often sooner. WhatsApp is fastest. Contact us immediately if your deadline is urgent.',
    },
    {
      question: 'What if my case was filed by a scammer?',
      answer:
        'We assess the damage, determine what can be salvaged, and create a recovery plan. Many fraudulent filings can be corrected.',
    },
    {
      question: 'Can you fix a denied case?',
      answer:
        'Many denied cases can be reopened through motions to reopen or new filings. We will tell you your options after reviewing your case.',
    },
    {
      question: 'Do I need to come to an office?',
      answer:
        'No. Everything is handled online and via WhatsApp. You can work with us from anywhere.',
    },
    {
      question: 'What if I cannot afford the full case fee?',
      answer:
        'We offer payment plans. The $99 consultation fee is credited if you become a client.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 to-amber-50 border-b-4 border-red-600 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {t('emergency.title')}
              </h1>
              <p className="text-lg md:text-xl text-red-700 font-semibold mb-2">
                Ayuda de Emergencia para tu Caso de Inmigracion
              </p>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-6 max-w-3xl">
            Scammed by a fake lawyer? Case denied? RFE you do not understand?
            We are here to help. Licensed attorney review within 48 hours.
          </p>

          <div className="bg-white rounded-lg p-6 mb-8 border-2 border-red-200">
            <p className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
              {t('emergency.consultation')}
            </p>
            <p className="text-gray-700 mb-6">
              48-hour attorney review plus written action plan
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/19547776678"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('emergency.ctaPrimary')}
                </Button>
              </a>
              <a href="tel:+19547776678">
                <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now: (954) 777-6678
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Who This Is For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario, index) => {
              const Icon = scenario.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-500"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {scenario.title}
                      </h3>
                      <p className="text-gray-700">{scenario.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-lg p-8 h-full shadow-sm border border-gray-200">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 -right-4 w-8 text-center">
                    <div className="text-2xl text-blue-300">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 border-2 border-green-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Emergency Consultation
              </h3>
              <p className="text-4xl font-bold text-green-600 mb-4">$99</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    48-hour attorney review
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Written action plan</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Credited toward case fee if you become a client
                  </span>
                </li>
              </ul>
              <p className="text-gray-700 font-semibold">
                No hidden fees. No surprises.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                What You Get
              </h3>
              <ul className="space-y-4">
                <li>
                  <p className="font-semibold text-gray-900 mb-1">
                    Honest Assessment
                  </p>
                  <p className="text-gray-700">
                    We tell you exactly what happened and why
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-gray-900 mb-1">
                    Clear Options
                  </p>
                  <p className="text-gray-700">
                    What can be fixed and what it will cost
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-gray-900 mb-1">
                    Next Steps
                  </p>
                  <p className="text-gray-700">
                    A written plan with timeline and action items
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-gray-900 mb-1">
                    Attorney Advice
                  </p>
                  <p className="text-gray-700">
                    From a licensed Florida immigration attorney
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Form */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Get Your $99 Emergency Consultation
          </h2>

          {submitted ? (
            <div className="bg-green-50 border-2 border-green-600 rounded-lg p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thank you for reaching out
              </h3>
              <p className="text-gray-700 mb-4">
                We received your information and will contact you within 24 hours.
                For fastest response, message us on WhatsApp: wa.me/19547776678
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="(954) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  What happened?
                </label>
                <select
                  name="situation"
                  value={formData.situation}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select a situation</option>
                  <option value="scam">Scam victim</option>
                  <option value="denied">Case denied</option>
                  <option value="rfe">RFE received</option>
                  <option value="deadline">Missed deadline</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tell us what happened
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describe your situation in detail. When did it happen? What case type? Any deadlines coming up?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Upload any documents you have
                </label>
                <div
                  onMouseEnter={() => setFileHover(true)}
                  onMouseLeave={() => setFileHover(false)}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    fileHover
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium mb-1">
                    Click or drag files here
                  </p>
                  <p className="text-gray-500 text-sm">
                    PDF, images, or documents (optional)
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-semibold text-lg"
              >
                Submit Emergency Consultation Request
              </Button>

              <p className="text-center text-gray-600">
                Or contact us directly on WhatsApp for fastest response:
                <a
                  href="https://wa.me/19547776678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-semibold ml-1"
                >
                  wa.me/19547776678
                </a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 bg-green-50 border-t-4 border-green-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Licensed Florida Attorney
              </h3>
              <p className="text-gray-700 font-semibold">Bar #1009132</p>
              <p className="text-gray-600 text-sm mt-2">
                Jeremy Knight, licensed to practice immigration law in Florida
              </p>
            </div>
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                We Have Seen It All
              </h3>
              <p className="text-gray-700">
                Fraudulent filings, botched applications, missed deadlines. We know how to fix them.
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Personal Review
              </h3>
              <p className="text-gray-700">
                Every case reviewed by an attorney, not a chatbot or paralegal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-red-600 to-amber-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Do Not Wait. Every Day Matters in Immigration.
          </h2>
          <p className="text-lg md:text-xl mb-8 text-red-100">
            No Esperes. Cada Dia Cuenta en Inmigracion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/19547776678"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Now
              </Button>
            </a>
            <a href="tel:+19547776678">
              <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
                <Phone className="w-4 h-4 mr-2" />
                Call (954) 777-6678
              </Button>
            </a>
            <Link href="/assessment">
              <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold">
                Start Quick Assessment
              </Button>
            </Link>
          </div>
          <p className="text-red-100 text-sm mt-6">
            Available 7 days a week. Response within 24-48 hours.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
