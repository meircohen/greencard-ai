'use client';
import { useTranslation } from '@/i18n';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  CheckCircle,
  BarChart3,
  Shield,
  MessageSquare,
  FileCheck,
  Zap,
  Users,
  Smartphone,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export default function AttorneyOS() {
  const { t } = useTranslation();
  const [caseVolume, setCaseVolume] = useState(15);
  const [caseValue, setCaseValue] = useState(3500);
  const [formData, setFormData] = useState({
    name: '',
    firmName: '',
    email: '',
    phone: '',
    barNumber: '',
    caseVolume: '',
    challenge: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('percase');

  const hoursSaved = caseVolume * 4;
  const additionalCases = Math.floor(hoursSaved / 40);
  const additionalRevenue = additionalCases * caseValue;
  const monthlyCost = activeTab === 'percase' ? caseVolume * 199 : 499;
  const netBenefit = additionalRevenue - monthlyCost;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        firmName: '',
        email: '',
        phone: '',
        barNumber: '',
        caseVolume: '',
        challenge: '',
      });
    }, 3000);
  };

  const features = [
    {
      icon: FileCheck,
      title: 'Smart Form Preparation',
      description: 'AI fills forms from client intake. You review and approve.',
    },
    {
      icon: Users,
      title: 'Client Portal',
      description: 'White-labeled with YOUR firm name. Clients see their status, upload docs, message you.',
    },
    {
      icon: AlertCircle,
      title: 'Triple-Check Engine',
      description: 'Every filing scanned for errors before you review. Zero rejections.',
    },
    {
      icon: BarChart3,
      title: 'Case Dashboard',
      description: 'See all your cases, deadlines, and priorities at a glance.',
    },
    {
      icon: Shield,
      title: 'Document Vault',
      description: 'Organized, searchable, secure. No more paper files.',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Integration',
      description: 'Clients message on WhatsApp; you respond from your dashboard.',
    },
    {
      icon: Zap,
      title: 'Billing & Payments',
      description: 'Stripe-powered. Payment plans. Automatic invoicing.',
    },
    {
      icon: TrendingUp,
      title: 'RFE Predictor',
      description: 'Flag potential RFEs before filing. Fix issues proactively.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'We Set You Up',
      description: 'White-label portal with your branding in 48 hours',
    },
    {
      number: '2',
      title: 'You Take Cases',
      description: 'Clients go through your intake. AI prepares everything.',
    },
    {
      number: '3',
      title: 'You Review & File',
      description: 'Focus on legal judgment. We handle the rest.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Per Case',
      price: '$199',
      period: 'per case',
      description: 'Pay only when you file',
      bestFor: 'firms filing 1-10 cases/month',
      features: [
        'Full platform access',
        'Client portal included',
        'Form preparation',
        'Document vault',
        'WhatsApp integration',
        'Triple-check engine',
      ],
      highlighted: false,
    },
    {
      name: 'Unlimited',
      price: '$499',
      period: 'per month',
      description: 'Unlimited case filings',
      bestFor: 'firms filing 10+ cases/month',
      features: [
        'Unlimited filings',
        'Priority support',
        'Custom branding',
        'API access',
        'Form preparation',
        'Document vault',
        'WhatsApp integration',
        'Triple-check engine',
      ],
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-blue-900">
            Attorney OS: The Operating System for Immigration Law
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop drowning in paperwork. Let AI handle the 90% that is repetitive so you can focus on the 10% that requires your expertise. Your brand, your clients, our technology.
          </p>
          <p className="text-lg text-blue-900 font-semibold mb-12">
            Built for the 13,000+ immigration attorneys in America
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-lg"
            >
              Request a Demo
            </Button>
            <Button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-bold px-8 py-3 rounded-lg"
            >
              See Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">The Problem for Attorneys</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-8 rounded-lg border border-gray-300">
              <p className="text-lg font-semibold text-blue-900 mb-2">80% Paperwork</p>
              <p className="text-slate-600">You spend 80% of your time on paperwork, not lawyering</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-300">
              <p className="text-lg font-semibold text-blue-900 mb-2">Daily Status Calls</p>
              <p className="text-slate-600">Clients call daily asking "What is the status of my case?"</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-300">
              <p className="text-lg font-semibold text-blue-900 mb-2">Error Costs</p>
              <p className="text-slate-600">One paralegal error costs you $2,000+ in refiling and lost trust</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-300">
              <p className="text-lg font-semibold text-blue-900 mb-2">New Competition</p>
              <p className="text-slate-600">Competitors like Boundless and SimpleCitizen are taking your clients with lower prices</p>
            </div>
            <div className="md:col-span-2 bg-white p-8 rounded-lg border border-gray-300">
              <p className="text-lg font-semibold text-blue-900 mb-2">Technology Gap</p>
              <p className="text-slate-600">You know you need technology but building it would cost $500K+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">What You Get</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-gray-50 p-8 rounded-lg border border-gray-300 hover:border-blue-900/50 transition-colors">
                  <IconComponent className="w-10 h-10 text-blue-900 mb-4" />
                  <h3 className="text-lg font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center text-blue-900">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-blue-900/5 p-8 rounded-lg border border-blue-900/30">
                  <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-900/30 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">Pricing</h2>

          <div className="grid gap-8 md:grid-cols-2 mb-16">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg border p-8 transition-all ${
                  plan.highlighted
                    ? 'bg-blue-900/5 border-blue-900/30 scale-105 md:scale-100'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2 text-slate-900">{plan.name}</h3>
                <p className="text-blue-900 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-slate-600 mb-6 text-sm">Best for: {plan.bestFor}</p>
                <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold mb-8 py-2">
                  Get Started
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">ROI Calculator</h2>

          <div className="bg-white border border-gray-300 rounded-lg p-10">
            <div className="grid gap-8 mb-10">
              <div>
                <label className="block text-lg font-semibold mb-4 text-slate-900">
                  How many cases do you file per month?
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={caseVolume}
                    onChange={(e) => setCaseVolume(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-3xl font-bold text-blue-900 min-w-12">{caseVolume}</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4 text-slate-900">
                  Average fee per case
                </label>
                <div className="flex gap-4 items-center">
                  <span className="text-2xl text-slate-900">$</span>
                  <input
                    type="number"
                    value={caseValue}
                    onChange={(e) => setCaseValue(parseInt(e.target.value))}
                    className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 text-slate-900 text-xl"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-gray-50 p-6 rounded border border-gray-300">
                <p className="text-slate-600 text-sm mb-2">Hours saved per month</p>
                <p className="text-3xl font-bold text-blue-900">{hoursSaved}h</p>
              </div>
              <div className="bg-gray-50 p-6 rounded border border-gray-300">
                <p className="text-slate-600 text-sm mb-2">Additional cases you could take</p>
                <p className="text-3xl font-bold text-blue-900">{additionalCases}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded border border-gray-300">
                <p className="text-slate-600 text-sm mb-2">Additional revenue potential</p>
                <p className="text-3xl font-bold text-blue-900">${additionalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded border border-gray-300">
                <p className="text-slate-600 text-sm mb-2">Your Attorney OS cost</p>
                <p className="text-3xl font-bold text-blue-900">${monthlyCost}/mo</p>
              </div>
            </div>

            <div className="mt-8 bg-blue-900/5 border border-blue-900/30 rounded-lg p-6">
              <p className="text-slate-600 text-sm mb-2">Net benefit per month</p>
              <p className="text-4xl font-bold text-blue-900">
                ${Math.max(0, netBenefit).toLocaleString()}/month
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Moat Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">Why Attorneys Choose Attorney OS</h2>
          <div className="grid gap-8">
            <div className="bg-gray-50 p-10 rounded-lg border border-gray-300">
              <h3 className="text-2xl font-bold mb-3 text-blue-900">Not a competitor. A partner.</h3>
              <p className="text-slate-700 text-lg">We do not take your clients. We make you better.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-lg border border-gray-300">
              <h3 className="text-2xl font-bold mb-3 text-blue-900">Data advantage</h3>
              <p className="text-slate-700 text-lg">Every case on the platform makes predictions more accurate for everyone.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-lg border border-gray-300">
              <h3 className="text-2xl font-bold mb-3 text-blue-900">Compliance built in</h3>
              <p className="text-slate-700 text-lg">Our tech respects attorney-client privilege and Bar rules.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-lg border border-gray-300">
              <h3 className="text-2xl font-bold mb-3 text-blue-900">Future-proof</h3>
              <p className="text-slate-700 text-lg">Stay ahead of legal tech disruption instead of being disrupted by it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Form Section */}
      <section id="demo-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center text-blue-900">Request a Demo</h2>
          <p className="text-slate-600 text-center mb-12">Get your firm set up in 48 hours</p>

          {formSubmitted ? (
            <div className="bg-green-50 border border-green-500/50 rounded-lg p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-green-700 mb-2">Thank you!</p>
              <p className="text-slate-600">We will be in touch shortly to schedule your demo.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="bg-white border border-gray-300 rounded-lg p-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-900">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-900">Firm Name</label>
                  <input
                    type="text"
                    name="firmName"
                    value={formData.firmName}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-900">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-900">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Bar Number</label>
                <input
                  type="text"
                  name="barNumber"
                  value={formData.barNumber}
                  onChange={handleFormChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">How many cases do you file per month?</label>
                <select
                  name="caseVolume"
                  value={formData.caseVolume}
                  onChange={handleFormChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                >
                  <option value="">Select range</option>
                  <option value="1-5">1-5 cases</option>
                  <option value="6-10">6-10 cases</option>
                  <option value="11-20">11-20 cases</option>
                  <option value="21+">21+ cases</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">What is your biggest operational challenge?</label>
                <textarea
                  name="challenge"
                  value={formData.challenge}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg"
              >
                Request Demo
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-900/5 border-y border-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-900">Join the Future of Immigration Law</h2>
          <p className="text-xl text-slate-600 mb-12">
            13,000+ immigration attorneys. The best ones will use Attorney OS.
          </p>
          <Button
            onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-lg text-lg"
          >
            Request Demo
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
