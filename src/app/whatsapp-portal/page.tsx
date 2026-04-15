'use client';
import { useTranslation } from '@/i18n';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  MessageCircle, 
  Camera, 
  Bell, 
  Users, 
  Clock, 
  Lock, 
  CheckCircle2,
  Smartphone,
  Globe,
  MessageSquare
} from 'lucide-react';

export default function WhatsAppPortalPage() {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                  Your Immigration Case, Right in WhatsApp
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  No apps to download. No portals to learn. Manage your entire green card case from the app you already use every day.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="https://wa.me/19547776678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20ba5a] transition-colors shadow-lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Start on WhatsApp
                  </a>
                  <Link
                    href="/assessment"
                    className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Prefer the Web
                  </Link>
                </div>
              </div>

              {/* Phone Mockup */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm">
                  {/* Phone frame */}
                  <div className="bg-black rounded-3xl p-3 shadow-2xl border-8 border-gray-900">
                    <div className="bg-white rounded-2xl overflow-hidden">
                      {/* Status bar */}
                      <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-800 flex justify-between items-center">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-3 border border-gray-600 rounded-sm"></div>
                          <div className="w-1 h-3 bg-gray-600"></div>
                          <div className="w-1 h-3 bg-gray-600"></div>
                        </div>
                      </div>

                      {/* WhatsApp header */}
                      <div className="bg-[#25D366] text-white px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">GreenCard.ai</span>
                          <span className="text-xs">Online</span>
                        </div>
                      </div>

                      {/* Chat area */}
                      <div className="h-96 bg-gradient-to-b from-gray-50 to-white p-4 space-y-3 overflow-y-auto flex flex-col justify-end">
                        {/* AI message */}
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-900 rounded-2xl rounded-tl-none px-4 py-2 max-w-xs text-sm">
                            <p>Welcome to GreenCard.ai</p>
                          </div>
                        </div>

                        {/* AI message */}
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-900 rounded-2xl rounded-tl-none px-4 py-2 max-w-xs text-sm">
                            <p>Let's start your marriage green card case</p>
                          </div>
                        </div>

                        {/* User message */}
                        <div className="flex justify-end">
                          <div className="bg-[#DCF8C6] text-gray-900 rounded-2xl rounded-tr-none px-4 py-2 max-w-xs text-sm">
                            <p>Can you help me?</p>
                            <span className="text-xs text-gray-500 mt-1 block">9:42</span>
                          </div>
                        </div>

                        {/* AI message with document */}
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-900 rounded-2xl rounded-tl-none px-4 py-2 max-w-xs text-sm">
                            <p className="font-semibold mb-1">Documents received</p>
                            <div className="bg-white rounded p-2 text-xs">
                              <Camera className="h-4 w-4 inline mr-1" />
                              Passport scan
                            </div>
                          </div>
                        </div>

                        {/* Status update */}
                        <div className="flex justify-start">
                          <div className="bg-blue-100 text-blue-900 rounded-2xl rounded-tl-none px-4 py-2 max-w-xs text-sm">
                            <p className="font-semibold">Case Status Update</p>
                            <p className="text-xs mt-1">Application received and under review</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-16">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: MessageCircle,
                  title: "Say Hola",
                  description: "Text our number, we create your case instantly. No forms, no calls, no waiting."
                },
                {
                  icon: Camera,
                  title: "Snap & Send",
                  description: "Take photos of documents, send via WhatsApp. We handle the rest."
                },
                {
                  icon: Bell,
                  title: "Get Updates",
                  description: "Real-time case status, next steps, and reminders right in your chat."
                },
                {
                  icon: Users,
                  title: "Talk to Your Attorney",
                  description: "Need legal advice? Your attorney is one message away."
                }
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#25D366] rounded-lg flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h3>
                        <p className="text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Chat Demo Section */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-12">
              See It in Action
            </h2>
            
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Chat header */}
              <div className="bg-[#25D366] text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">GreenCard.ai Legal Team</p>
                    <p className="text-xs text-green-100">Online now</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg rounded-tl-none px-4 py-2 max-w-sm">
                    <p className="text-sm">Hi, I need help with my marriage green card</p>
                    <span className="text-xs text-gray-500 mt-1 block">8:15 AM</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg rounded-tl-none px-4 py-2 max-w-sm">
                    <p className="text-sm font-semibold mb-1">Welcome to GreenCard.ai</p>
                    <p className="text-sm">I'm your case assistant. Let's get started. When did you marry your US citizen spouse?</p>
                    <span className="text-xs text-gray-500 mt-1 block">8:15 AM</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-green-100 text-green-900 rounded-lg rounded-tr-none px-4 py-2 max-w-sm">
                    <p className="text-sm">We got married 8 months ago</p>
                    <span className="text-xs text-green-700 mt-1 block flex justify-end gap-1">
                      8:16 AM <CheckCircle2 className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg rounded-tl-none px-4 py-2 max-w-sm">
                    <p className="text-sm">Perfect. Now send me a photo of your passport and birth certificate</p>
                    <span className="text-xs text-gray-500 mt-1 block">8:17 AM</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <div className="bg-green-100 text-green-900 rounded-lg rounded-tr-none px-4 py-2 max-w-sm">
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <Camera className="h-4 w-4" /> Document attached
                    </div>
                    <span className="text-xs text-green-700 mt-1 block">8:19 AM</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-blue-50 text-blue-900 border border-blue-200 rounded-lg rounded-tl-none px-4 py-2 max-w-sm">
                    <p className="text-sm font-semibold mb-2">Documents Verified</p>
                    <p className="text-sm">Your passport and birth certificate are confirmed. Case created ID: GC-2024-001234</p>
                    <span className="text-xs text-blue-700 mt-2 block">8:20 AM</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-lg rounded-tl-none px-4 py-2 max-w-sm">
                    <p className="text-sm font-semibold mb-2">Next Steps</p>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>Marriage certificate scan (by tomorrow)</li>
                      <li>Medical examination (schedule in 3 days)</li>
                      <li>Attorney consultation (Friday at 2pm)</li>
                    </ul>
                    <span className="text-xs text-amber-700 mt-2 block">8:21 AM</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg rounded-tl-none px-4 py-2 max-w-sm">
                    <p className="text-sm">Have questions? Our attorney can answer them. Say <span className="font-semibold">TALK TO ATTORNEY</span> anytime.</p>
                    <span className="text-xs text-gray-500 mt-1 block">8:22 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-16">
              Everything You Need
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Camera,
                  title: "Document Upload",
                  description: "Snap a photo, send it. We organize everything automatically."
                },
                {
                  icon: Globe,
                  title: "Bilingual Support",
                  description: "English and Spanish, seamlessly. Our team speaks your language."
                },
                {
                  icon: Bell,
                  title: "Case Status Alerts",
                  description: "Know the moment anything changes. Never miss an update."
                },
                {
                  icon: Clock,
                  title: "Appointment Reminders",
                  description: "Never miss a deadline or interview. We remind you automatically."
                },
                {
                  icon: MessageSquare,
                  title: "Attorney on Demand",
                  description: "Escalate to a licensed attorney anytime. Real answers, fast."
                },
                {
                  icon: Users,
                  title: "Family Group Chat",
                  description: "Add family members to stay in the loop. Everyone can help."
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-slate-50 rounded-xl p-8 cursor-pointer transition-all hover:shadow-lg hover:bg-white"
                    onMouseEnter={() => setActiveFeature(index)}
                    onMouseLeave={() => setActiveFeature(null)}
                  >
                    <div className={`p-3 rounded-lg w-fit mb-4 transition-colors ${
                      activeFeature === index ? 'bg-[#25D366]' : 'bg-slate-200'
                    }`}>
                      <Icon className={`h-6 w-6 ${activeFeature === index ? 'text-white' : 'text-slate-700'}`} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why WhatsApp Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-[#25D366] to-green-600 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
              Why WhatsApp?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  stat: "2B+",
                  label: "Users Worldwide",
                  description: "The most popular messaging app globally"
                },
                {
                  stat: "End-to-End",
                  label: "Encrypted",
                  description: "Your documents and conversations are secure"
                },
                {
                  stat: "60%+",
                  label: "Of Immigrant Families",
                  description: "Use WhatsApp daily across America"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold mb-2">{item.stat}</p>
                  <p className="text-lg font-semibold mb-2">{item.label}</p>
                  <p className="text-white text-opacity-90">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-white bg-opacity-10 rounded-xl p-8 text-center max-w-2xl mx-auto">
              <Smartphone className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg">
                WhatsApp is where your family already connects. Why learn a new app for immigration help when you can get it where you communicate every day?
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-16">
              WhatsApp Portal vs. Traditional Law Firm
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold">WhatsApp Portal</th>
                    <th className="px-6 py-4 text-left font-semibold">Traditional Law Firm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { feature: "Response Time", whatsapp: "Minutes", traditional: "Days" },
                    { feature: "Document Upload", whatsapp: "Photo via WhatsApp", traditional: "Office visit" },
                    { feature: "Language Support", whatsapp: "English & Spanish", traditional: "English only" },
                    { feature: "Availability", whatsapp: "24/7", traditional: "Office hours" },
                    { feature: "Cost", whatsapp: "Included in service", traditional: "Extra fees" },
                    { feature: "Status Tracking", whatsapp: "Real-time updates", traditional: "Call and ask" }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{row.feature}</td>
                      <td className="px-6 py-4 text-[#25D366] font-semibold">{row.whatsapp}</td>
                      <td className="px-6 py-4 text-slate-600">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Ready to Start Your Case on WhatsApp?
            </h2>
            <p className="text-lg text-slate-600 mb-12">
              Join thousands of families managing their green card cases through WhatsApp. Faster, simpler, in your language.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/19547776678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-5 bg-[#25D366] text-white font-bold text-lg rounded-xl hover:bg-[#20ba5a] transition-colors shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Start on WhatsApp Now
              </a>
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center px-10 py-5 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
              >
                Or Try the Web Portal
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-8">
              First consultation is free. Licensed immigration attorney. Available in English and Spanish.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
