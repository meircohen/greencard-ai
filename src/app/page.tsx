'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Shield,
  FileText,
  MessageSquare,
  Clock,
  Calculator,
  Users,
  CheckCircle2,
  Lock,
  Award,
  Globe,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = () => {
    setVideoOpen(true);
    setTimeout(() => videoRef.current?.play(), 100);
  };
  const closeVideo = () => {
    setVideoOpen(false);
    videoRef.current?.pause();
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
                  Trusted by families across the US
                </span>
              </div>

              <h1 className="animate-fade-up-d1 text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] text-slate-900">
                Your green card,{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  without the guesswork
                </span>
              </h1>

              <p className="animate-fade-up-d2 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg">
                AI-powered document preparation reviewed by licensed immigration attorneys.
                From first question to filed application, in one place.
              </p>

              <div className="animate-fade-up-d3 flex flex-col sm:flex-row gap-3">
                <Link href="/assessment">
                  <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                    Start Free Assessment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-[15px] font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm">
                    View Pricing
                  </button>
                </Link>
              </div>

              {/* Trust bar */}
              <div className="animate-fade-up-d4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  256-bit encryption
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Attorney-reviewed
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  English &amp; Espa&ntilde;ol
                </span>
              </div>
            </div>

            {/* Right: Video Player */}
            <div className="animate-fade-up-d2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-slate-900 aspect-video cursor-pointer group" onClick={openVideo}>
                {/* Video thumbnail / poster */}
                <video
                  className="w-full h-full object-cover opacity-90"
                  src="/demo.mp4"
                  muted
                  playsInline
                  preload="metadata"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 group-hover:bg-slate-900/30 transition-colors duration-300">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 ml-1" />
                  </div>
                </div>
                {/* Label */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                    Watch 2-min demo
                  </span>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF BAR ═══════════════ */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { value: '5+', label: 'USCIS Forms' },
              { value: '93%', label: 'Approval Rate (IR1)' },
              { value: '24/7', label: 'AI Assistance' },
              { value: '<5 min', label: 'To First Assessment' },
              { value: '2', label: 'Languages' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</span>
                <span className="text-slate-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm tracking-wide uppercase mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              From first question to filed application
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-0">
            {[
              { step: '01', title: 'Free Assessment', desc: 'Answer a few questions. Get your eligibility analysis and personalized pathway.', icon: MessageSquare },
              { step: '02', title: 'AI-Guided Forms', desc: 'Our AI pre-fills your forms with built-in validation. No field left blank.', icon: FileText },
              { step: '03', title: 'Attorney Review', desc: 'A licensed immigration attorney reviews every form before filing.', icon: Shield },
              { step: '04', title: 'Track Progress', desc: 'Monitor your case status, deadlines, and next steps in real time.', icon: Zap },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="relative px-6 py-8"
                >
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-[4.5rem] right-0 w-full h-px bg-gradient-to-r from-slate-200 to-slate-100 translate-x-1/2" />
                  )}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Step {item.step}</span>
                    <h3 className="text-lg font-semibold text-slate-900 mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm tracking-wide uppercase mb-3">Platform</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Purpose-built for family-based immigration. Every feature designed to reduce errors and save time.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: MessageSquare,
                title: 'Document Assistant',
                desc: 'AI trained on real USCIS data answers your questions instantly, in English or Spanish.',
                gradient: 'from-emerald-500 to-teal-500',
                bg: 'bg-emerald-50',
                color: 'text-emerald-600',
              },
              {
                icon: Clock,
                title: 'Live Visa Bulletin',
                desc: 'Real-time priority dates with historical trends and wait time predictions for every category.',
                gradient: 'from-blue-500 to-indigo-500',
                bg: 'bg-blue-50',
                color: 'text-blue-600',
              },
              {
                icon: FileText,
                title: 'Smart Form Filling',
                desc: 'AI pre-fills I-485, I-130, I-765 and more. Built-in validation catches errors before USCIS does.',
                gradient: 'from-violet-500 to-purple-500',
                bg: 'bg-violet-50',
                color: 'text-violet-600',
              },
              {
                icon: Shield,
                title: 'RFE Decoder',
                desc: 'Paste any Request for Evidence. Get a plain-English breakdown with a response strategy.',
                gradient: 'from-amber-500 to-orange-500',
                bg: 'bg-amber-50',
                color: 'text-amber-600',
              },
              {
                icon: Calculator,
                title: 'Cost Calculator',
                desc: 'Transparent fee breakdowns for every form type, including filing fees and premium processing.',
                gradient: 'from-rose-500 to-pink-500',
                bg: 'bg-rose-50',
                color: 'text-rose-600',
              },
              {
                icon: Users,
                title: 'Attorney Network',
                desc: 'Licensed immigration attorneys review your AI-prepared forms and file on your behalf.',
                gradient: 'from-cyan-500 to-sky-500',
                bg: 'bg-cyan-50',
                color: 'text-cyan-600',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl bg-white border border-slate-200/80 p-7 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300"
                >
                  <div className={`inline-flex p-2.5 rounded-xl ${feature.bg} mb-5`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-[17px] font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200 absolute top-7 right-6" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ VIDEO SECTION ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm tracking-wide uppercase mb-3">See it in action</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Watch how it works
            </h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-slate-900">
            <video
              className="w-full"
              src="/demo.mp4"
              controls
              playsInline
              preload="metadata"
              poster=""
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST / WHY US ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm tracking-wide uppercase mb-3">Why GreenCard.ai</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Built for trust. Designed for clarity.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: CheckCircle2,
                title: 'Real USCIS Data',
                desc: 'Assessments based on actual processing data and historical approval patterns.',
              },
              {
                icon: Award,
                title: 'Attorney-Reviewed',
                desc: 'Every form reviewed by a licensed immigration attorney before filing.',
              },
              {
                icon: Lock,
                title: 'Bank-Level Security',
                desc: 'AES-256 encryption. Your personal information never leaves our secure servers.',
              },
              {
                icon: Globe,
                title: 'Bilingual Support',
                desc: 'Full platform in English and Spanish. Forms filed in English with Spanish guidance.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="text-center px-4 py-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING TEASER ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 sm:p-14 text-center overflow-hidden">
            {/* Gradient orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start free. Upgrade when ready.
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
                Free eligibility assessment. AI document preparation from $29/mo. Attorney review from $149/mo. Save 60% vs. traditional attorneys.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/assessment">
                  <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
                    Start Free Assessment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-200">
                    Compare Plans
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Ready to take the first step?
          </h2>
          <p className="text-base text-slate-500 max-w-lg mx-auto mb-6">
            Get your personalized immigration assessment in under 5 minutes. Free, confidential, no credit card required.
          </p>
          <Link href="/assessment" className="group inline-flex">
            <button className="px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center gap-2">
              Check Your Eligibility
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <p className="mt-8 text-xs text-slate-400 max-w-lg mx-auto">
            GreenCard.ai is not a law firm and does not provide legal advice. Legal services are provided by Partner Immigration Law, PLLC. All AI-generated content is for informational purposes only.
          </p>
        </div>
      </section>

      <Footer />

      {/* ═══════════════ VIDEO MODAL ═══════════════ */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeVideo}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
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
