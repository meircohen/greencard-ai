'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  FileText,
  Users,
  CheckCircle2,
  Lock,
  Award,
  Globe,
  Zap,
  ChevronRight,
  X,
  Heart,
  Briefcase,
  DollarSign,
  Clock,
  Shield,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = () => {
    setVideoOpen(true);
    setTimeout(() => videoRef.current?.play(), 100);
  };

  const closeVideo = () => {
    setVideoOpen(false);
    videoRef.current?.pause();
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
        {/* Subtle gradient blob background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-100/60 to-teal-50/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-100/50 to-indigo-50/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  Trusted by 500+ families nationwide
                </span>
              </div>

              <h1 className="animate-fade-up-d1 text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] text-slate-900">
                Your American dream deserves the{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  right legal team
                </span>
              </h1>

              <p className="animate-fade-up-d2 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg">
                We handle everything from paperwork to filing, so you can focus on your family. Faster, cheaper, and easier than traditional attorneys.
              </p>

              <div className="animate-fade-up-d3 flex flex-col sm:flex-row gap-3">
                <Link href="/assessment">
                  <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                    Free Case Evaluation
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  onClick={openVideo}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-[15px] font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  See How It Works
                </button>
              </div>

              {/* Trust indicators */}
              <div className="animate-fade-up-d4 space-y-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Licensed immigration attorneys
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  93% approval rate
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  Bilingual support; English and Spanish
                </div>
              </div>
            </div>

            {/* Right: Social Proof Card */}
            <div className="animate-fade-up-d2">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-lg shadow-slate-900/5">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Average Savings</p>
                    <p className="text-4xl font-bold text-slate-900">$4,000+</p>
                    <p className="text-sm text-slate-500">Compared to traditional law firms</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">47</p>
                      <p className="text-xs text-slate-500 mt-1">Cases filed this month</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-900">2K+</p>
                      <p className="text-xs text-slate-500 mt-1">Families helped</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES SECTION ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Our Immigration Services
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              We handle the legal complexity so you can focus on your future.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: 'Marriage-Based Green Cards',
                description: 'I-485, I-130, I-864. We guide married couples through immediate relative sponsorship.',
                color: 'text-rose-600',
              },
              {
                icon: Users,
                title: 'Family Sponsorship',
                description: 'Adult children, siblings, parents. Navigate family preference categories and priority dates.',
                color: 'text-blue-600',
              },
              {
                icon: CheckCircle2,
                title: 'Adjustment of Status',
                description: 'Stay in the US while your green card processes. Complete I-485 with expert review.',
                color: 'text-emerald-600',
              },
              {
                icon: Briefcase,
                title: 'Work Permits',
                description: 'I-765 for EAD. Get authorization to work while your case is pending.',
                color: 'text-amber-600',
              },
              {
                icon: Award,
                title: 'Citizenship and Naturalization',
                description: 'N-400 preparation and filing. Become a US citizen with confidence.',
                color: 'text-purple-600',
              },
              {
                icon: Globe,
                title: 'Consular Processing',
                description: 'DS-260, medical exams, consulate interviews. Complete support for overseas processing.',
                color: 'text-cyan-600',
              },
            ].map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/80 bg-white p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300"
                >
                  <Icon className={`w-6 h-6 ${service.color} mb-4`} />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1.5 transition-colors">
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to your green card.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Tell Us Your Story',
                description: 'Free confidential consultation. We review your case, answer your questions, and create your personalized strategy.',
                icon: FileText,
              },
              {
                step: '2',
                title: 'We Handle the Paperwork',
                description: 'Our team prepares every form, gathers documents, and reviews everything before submission. You verify and sign.',
                icon: Briefcase,
              },
              {
                step: '3',
                title: 'Attorney Files Your Case',
                description: 'Licensed immigration attorney files with USCIS on your behalf. We track your case and respond to any requests.',
                icon: Award,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative">
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 -right-4 w-8 h-px bg-gradient-to-r from-emerald-200 to-transparent" />
                  )}
                  <div className="rounded-xl border border-emerald-200/50 bg-emerald-50/30 p-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Why Choose GreenCard.ai
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Compare the costs and convenience.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">
                    Factor
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-600">
                    Traditional Attorney
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-600">
                    DIY
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-emerald-600">
                    GreenCard.ai
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">Cost</td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    $5,000 - $15,000
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    $500 - $1,000
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-emerald-600">
                    $499 - $1,499
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Prep Time
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    3 - 6 weeks
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    4 - 12 weeks
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-emerald-600">
                    3 - 5 days
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Attorney Review
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">
                    <X className="w-5 h-5 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Online Process
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">
                    <X className="w-5 h-5 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Error Protection
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">
                    <X className="w-5 h-5 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF / STATS ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '2,000+', label: 'Cases Filed' },
              { value: '93%', label: 'Approval Rate' },
              { value: '$4,000+', label: 'Average Savings' },
              { value: '4.9/5', label: 'Client Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ VIDEO SECTION ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              See How Simple the Process Is
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Watch a walkthrough of our process.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-slate-900">
            <video
              className="w-full"
              src="/demo.mp4"
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ SECTION ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to know about our services.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'How much does it cost?',
                answer: 'Our fee range is $499 to $1,499 depending on your case complexity and the forms required. This typically includes free consultation, document preparation, attorney review, and USCIS filing. No hidden fees, no upfront costs.',
              },
              {
                question: 'How long does the process take?',
                answer: 'Case preparation takes 3 to 5 business days. Once we file with USCIS, processing times vary by case type and current government processing times. Family-based green cards typically range from 6 months to 2 years depending on visa availability and category.',
              },
              {
                question: 'Do I need to visit an office?',
                answer: 'No. The entire process is online. You upload documents, we prepare forms, our licensed attorney reviews everything, and you sign electronically. Everything happens in your account at GreenCard.ai.',
              },
              {
                question: 'Who reviews my forms?',
                answer: 'A licensed immigration attorney at Partner Immigration Law, PLLC reviews every single form before we file with USCIS. We do not submit anything without attorney sign-off.',
              },
              {
                question: 'What if my case is denied?',
                answer: 'We stand behind our work. If USCIS denies your case due to errors in our preparation, we will refile at no cost. We also provide guidance on appeals or reapplication strategies.',
              },
              {
                question: 'Do you speak Spanish?',
                answer: 'Yes. Our entire platform is available in English and Spanish. Documents are filed in English with USCIS as required, but we provide Spanish guidance throughout the process.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-left">
                    {faq.question}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      openFaqIndex === i ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ready to Start Your Immigration Journey?
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto mb-8">
            Get a free case evaluation. Our team will review your situation and explain your options.
          </p>
          <Link href="/assessment">
            <button className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto mb-6">
              Free Case Evaluation
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-sm text-slate-500 mb-8">
            No upfront fees. No hidden costs. Cancel anytime.
          </p>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            GreenCard.ai is not a law firm and does not provide legal advice. Legal services are provided by Partner Immigration Law, PLLC. All information is for educational purposes only. This is not a substitute for professional legal advice.
          </p>
        </div>
      </section>

      <Footer />

      {/* ═══════════════ VIDEO MODAL ═══════════════ */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full"
                src="/demo.mp4"
                controls
                playsInline
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
