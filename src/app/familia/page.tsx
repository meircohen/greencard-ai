'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  Users,
  Clock,
  Shield,
  FileText,
  Zap,
  TrendingUp,
  Heart,
  ArrowRight,
} from 'lucide-react';

export default function FamiliaPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                  The Familia Plan: Immigration Protection for Life
                </h1>
                <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                  Your green card is just the beginning. Citizenship, family reunification, renewals, travel documents. We handle it all, for less than your phone bill.
                </p>
                <button
                  onClick={() => {
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition flex items-center gap-2"
                >
                  Protect Your Family
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Family Silhouette Graphic */}
              <div className="relative h-64 sm:h-80 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Central node */}
                  <div className="absolute w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    You
                  </div>

                  {/* Connected nodes */}
                  <div className="absolute top-0 left-1/4 w-14 h-14 bg-blue-300 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow">
                    Spouse
                  </div>
                  <div className="absolute top-0 right-1/4 w-14 h-14 bg-blue-300 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow">
                    Child
                  </div>
                  <div className="absolute bottom-0 left-1/4 w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow">
                    Parent
                  </div>
                  <div className="absolute bottom-0 right-1/4 w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow">
                    Sibling
                  </div>

                  {/* Connection lines */}
                  <svg className="absolute w-full h-full pointer-events-none" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    <line x1="50%" y1="50%" x2="35%" y2="15%" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="65%" y2="15%" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="35%" y2="85%" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="65%" y2="85%" stroke="#cbd5e1" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              The Journey Doesn't End at the Green Card
            </h2>
            <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Your immigration path continues for years. Here is what happens if you miss key deadlines vs. having a Guardian Plan protecting you.
            </p>

            <div className="space-y-8">
              {/* Year 0 */}
              <div className="border-l-4 border-green-500 pl-8 py-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-bold">0</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">Green Card Approved</h3>
                    <p className="text-gray-600 mt-2">Celebrate. You made it. Now the real work begins.</p>
                  </div>
                </div>
              </div>

              {/* Year 2 */}
              <div className="border-l-4 border-red-500 pl-8 py-4 bg-white rounded-lg -ml-4 pl-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-700 font-bold">2</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">Remove Conditions (I-751)</h3>
                    <p className="text-gray-600 mt-2">You got a conditional green card. This deadline is non-negotiable.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                        <div className="flex gap-2 items-start">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-900">If you miss it</p>
                            <p className="text-sm text-red-700 mt-1">Your green card is revoked. You lose your status immediately.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                        <div className="flex gap-2 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">With Guardian Plan</p>
                            <p className="text-sm text-green-700 mt-1">We track the deadline, prepare the paperwork, file on time.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Year 3-5 */}
              <div className="border-l-4 border-amber-500 pl-8 py-4 bg-white rounded-lg -ml-4 pl-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-700 font-bold">3-5</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">Citizenship Eligible (N-400)</h3>
                    <p className="text-gray-600 mt-2">You become eligible for citizenship. But the application is complex.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                        <div className="flex gap-2 items-start">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-900">If you wait</p>
                            <p className="text-sm text-red-700 mt-1">Hiring a lawyer takes months. Your application gets delayed 6+ months.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                        <div className="flex gap-2 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">With Guardian Plan</p>
                            <p className="text-sm text-green-700 mt-1">We auto-start your application the moment you're eligible.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Year 5+ */}
              <div className="border-l-4 border-purple-500 pl-8 py-4 bg-white rounded-lg -ml-4 pl-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-700 font-bold">5+</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">Sponsor Family Members</h3>
                    <p className="text-gray-600 mt-2">Now you can bring your parents, siblings, and their families to the US.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                        <div className="flex gap-2 items-start">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-900">If you go it alone</p>
                            <p className="text-sm text-red-700 mt-1">Each case costs $3,000+ in attorney fees. Family sponsorship gets expensive fast.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                        <div className="flex gap-2 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">With Guardian Plan</p>
                            <p className="text-sm text-green-700 mt-1">Get 10-20% discount on every family member's filing. Bring your whole family for less.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ongoing */}
              <div className="border-l-4 border-blue-500 pl-8 py-4 bg-white rounded-lg -ml-4 pl-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">Ongoing: Travel Documents, Renewals, Address Changes</h3>
                    <p className="text-gray-600 mt-2">Immigration doesn't sleep. New deadlines emerge every year.</p>
                    <p className="text-gray-700 mt-4">With Guardian Plan: All tracked. All handled. No surprises.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Flexible pricing for every family. Start small, upgrade anytime.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Essentials */}
              <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Essentials</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$29</span>
                    <span className="text-blue-100">/month</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Deadline monitoring for all immigration milestones</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Annual attorney check-in call</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Priority support, 24-hour response time</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Document storage vault</p>
                  </div>
                  <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Family - Most Popular */}
              <div className="bg-white border-2 border-green-500 rounded-lg overflow-hidden shadow-lg relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Family</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$49</span>
                    <span className="text-green-100">/month</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Everything in Essentials</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Up to 4 family members covered</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Family eligibility roadmap</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Auto-initiate next filing when eligible</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">10% discount on all new case filings</p>
                  </div>
                  <Button className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold">
                    Start Now
                  </Button>
                </div>
              </div>

              {/* Dynasty */}
              <div className="bg-white border-2 border-purple-300 rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Dynasty</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$99</span>
                    <span className="text-purple-100">/month</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Everything in Family</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Unlimited family members</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Quarterly attorney strategy calls</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Priority case filing queue</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">20% discount on all new case filings</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Dedicated case manager</p>
                  </div>
                  <Button className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                    Get Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Family Graph Demo */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Your Family's Immigration Roadmap
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              See every family member's status and eligibility in one place.
            </p>

            <div className="bg-white rounded-lg p-8 sm:p-12 shadow">
              <div className="relative h-96 flex items-center justify-center">
                {/* Center node - You */}
                <div className="absolute w-24 h-24 bg-green-500 rounded-full flex flex-col items-center justify-center text-white text-center font-semibold shadow-lg">
                  <div>You</div>
                  <div className="text-sm mt-1 font-normal">Approved</div>
                </div>

                {/* Spouse - Eligible Now */}
                <div className="absolute top-8 left-12 w-20 h-20 bg-green-400 rounded-full flex flex-col items-center justify-center text-white text-center font-semibold shadow">
                  <div>Spouse</div>
                  <div className="text-xs mt-1 font-normal">Now</div>
                </div>

                {/* Child 1 - Eligible Now */}
                <div className="absolute top-8 right-12 w-20 h-20 bg-green-400 rounded-full flex flex-col items-center justify-center text-white text-center font-semibold shadow">
                  <div>Child 1</div>
                  <div className="text-xs mt-1 font-normal">Now</div>
                </div>

                {/* Parent - Eligible in 2 years */}
                <div className="absolute bottom-8 left-12 w-20 h-20 bg-amber-400 rounded-full flex flex-col items-center justify-center text-white text-center font-semibold shadow">
                  <div>Parent</div>
                  <div className="text-xs mt-1 font-normal">2 yrs</div>
                </div>

                {/* Sibling - Eligible after citizenship */}
                <div className="absolute bottom-8 right-12 w-20 h-20 bg-gray-400 rounded-full flex flex-col items-center justify-center text-white text-center font-semibold shadow">
                  <div>Sibling</div>
                  <div className="text-xs mt-1 font-normal">Future</div>
                </div>

                {/* Connection lines */}
                <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="50" y1="50" x2="20" y2="20" stroke="#cbd5e1" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="80" y2="20" stroke="#cbd5e1" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="20" y2="80" stroke="#cbd5e1" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="80" y2="80" stroke="#cbd5e1" strokeWidth="0.5" />
                </svg>
              </div>

              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Eligible now</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
                  <p className="text-sm text-gray-700">Eligible soon</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <p className="text-sm text-gray-700">Future</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              What You Get
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Deadline Alerts */}
              <div className="bg-white border-2 border-blue-200 rounded-lg p-8">
                <div className="flex gap-4">
                  <Clock className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Deadline Alerts</h3>
                    <p className="text-gray-600">
                      Never miss an I-751, N-400, or renewal deadline again. We track every milestone and remind you months in advance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Auto-Filing */}
              <div className="bg-white border-2 border-blue-200 rounded-lg p-8">
                <div className="flex gap-4">
                  <Zap className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Auto-Filing</h3>
                    <p className="text-gray-600">
                      We prepare your next application before you even ask. The moment you're eligible, we draft and file.
                    </p>
                  </div>
                </div>
              </div>

              {/* Family Tracking */}
              <div className="bg-white border-2 border-blue-200 rounded-lg p-8">
                <div className="flex gap-4">
                  <Users className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Family Tracking</h3>
                    <p className="text-gray-600">
                      See every family member's status and eligibility in one place. Your complete immigration roadmap.
                    </p>
                  </div>
                </div>
              </div>

              {/* Attorney Access */}
              <div className="bg-white border-2 border-blue-200 rounded-lg p-8">
                <div className="flex gap-4">
                  <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Attorney Access</h3>
                    <p className="text-gray-600">
                      Regular check-ins with a licensed immigration attorney. Get personalized advice for your situation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Vault */}
              <div className="bg-white border-2 border-blue-200 rounded-lg p-8">
                <div className="flex gap-4">
                  <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Document Vault</h3>
                    <p className="text-gray-600">
                      All your immigration documents organized and secure. Accessible anytime, anywhere. Never lose a form again.
                    </p>
                  </div>
                </div>
              </div>

              {/* Priority Pricing */}
              <div className="bg-white border-2 border-blue-200 rounded-lg p-8">
                <div className="flex gap-4">
                  <TrendingUp className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Priority Pricing</h3>
                    <p className="text-gray-600">
                      Get 10-20% discount on every future filing. Save thousands bringing your family to the US.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Math */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Why the Subscription Makes Sense
            </h2>

            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
                <p className="text-red-900 font-semibold mb-2">One missed I-751 deadline</p>
                <p className="text-red-800">Your green card is revoked. You're deportable.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
                <p className="text-red-900 font-semibold mb-2">One late N-400 filing</p>
                <p className="text-red-800">You wait 6+ additional months for citizenship while your lawyer gets their act together.</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-amber-500 p-6 rounded">
                <p className="text-amber-900 font-semibold mb-2">Traditional attorney retainer for ongoing advice</p>
                <p className="text-amber-800">$300 per hour, for years. Total cost: $15,000 to $30,000+</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                <p className="text-green-900 font-semibold mb-2">Guardian Plan pricing</p>
                <p className="text-green-800">Essentials at $29/month = $348/year for complete coverage. Family at $49/month = $588/year. Dynasty at $99/month = $1,188/year.</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                <p className="text-blue-900 font-semibold mb-2">One case filing discount pays for months of subscription</p>
                <p className="text-blue-800">Save 10-20% on your next filing and you've already covered half a year of Guardian Plan costs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Placeholder */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Stories from Families We've Protected
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-8 shadow border-t-4 border-blue-500">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "Coming soon. Real stories from families we've protected. Check back soon."
                  </p>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Illustrative example</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Your Family's Immigration Journey, Protected
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Start with any plan. Cancel anytime. No long-term contracts. No hidden fees.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg w-full">
                Start Essentials
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg w-full">
                Start Family
              </Button>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg w-full">
                Get Dynasty
              </Button>
            </div>

            <p className="text-blue-100 mb-4">
              Not ready? Start your first case at greencard.ai and upgrade to Guardian Plan after approval.
            </p>
            <Link href="/" className="text-blue-200 hover:text-white underline">
              Go back to home
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
