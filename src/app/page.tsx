'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  BarChart3,
  FileText,
  Calculator,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Shield,
  MessageSquare,
  Zap,
  Star,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Immigration Advisor',
    description: 'Chat with an AI trained on real USCIS data. Get instant answers about visa options, timelines, and eligibility.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    icon: Clock,
    title: 'Live Visa Bulletin',
    description: 'Real-time priority date tracking with historical trends and wait time predictions for every category.',
    gradient: 'from-blue-500 to-indigo-600',
    bgGlow: 'bg-blue-500/10',
  },
  {
    icon: FileText,
    title: 'Smart Form Filling',
    description: 'AI pre-fills your I-485, I-130, and more. Built-in validation catches errors before USCIS does.',
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: 'bg-violet-500/10',
  },
  {
    icon: Shield,
    title: 'RFE Decoder',
    description: 'Paste any Request for Evidence and get a plain-English breakdown with a response strategy.',
    gradient: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-500/10',
  },
  {
    icon: Calculator,
    title: 'Cost Calculator',
    description: 'Transparent fee breakdowns for every visa type, including attorney costs and premium processing.',
    gradient: 'from-rose-500 to-pink-600',
    bgGlow: 'bg-rose-500/10',
  },
  {
    icon: Users,
    title: 'Attorney Network',
    description: 'When you need a lawyer, connect with vetted immigration attorneys who can review your AI-prepared case.',
    gradient: 'from-cyan-500 to-blue-600',
    bgGlow: 'bg-cyan-500/10',
  },
];

const steps = [
  {
    number: '01',
    title: 'Tell Your Story',
    description: 'Answer a few questions about your immigration background, goals, and timeline.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Get Your Assessment',
    description: 'Receive a detailed analysis with eligible pathways, success factors, and estimated timelines.',
    icon: BarChart3,
  },
  {
    number: '03',
    title: 'Prepare Your Forms',
    description: 'AI assists you in completing all required USCIS forms with real-time validation.',
    icon: FileText,
  },
  {
    number: '04',
    title: 'Track & File',
    description: 'Monitor deadlines, get reminders, and connect with an attorney when you are ready to file.',
    icon: Zap,
  },
];

const testimonials = [
  {
    quote: 'The AI assessment matched exactly what my attorney told me, but I got it in 5 minutes instead of waiting 3 weeks for a consultation.',
    name: 'Priya M.',
    detail: 'EB-2 NIW Applicant',
    rating: 5,
  },
  {
    quote: 'The RFE decoder saved me hours of stress. It broke down exactly what USCIS wanted and how to respond.',
    name: 'Carlos R.',
    detail: 'I-485 Adjustment of Status',
    rating: 5,
  },
  {
    quote: 'I filled out my I-130 in 20 minutes. The form wizard caught two mistakes that would have caused delays.',
    name: 'Sarah K.',
    detail: 'Family-Based Petition',
    rating: 5,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.05] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-emerald-500/[0.03] to-transparent rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" aria-hidden="true">
            <defs>
              <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
            {/* Pill badge */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Powered by Real USCIS Data + AI
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
                           className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
            >
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                Your path to a Green Card,
              </span>
              <br />
              <span className="text-white">made clear.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
                           className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              AI-powered guidance built on real USCIS data. Get visa assessments,
              timeline predictions, cost estimates, and step-by-step form assistance.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/chat" className="group">
                <button className="relative w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 flex items-center justify-center gap-2">
                  Start Free Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/visa-bulletin">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] backdrop-blur-sm transition-all duration-300">
                  View Visa Bulletin
                </button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeUp} className="pt-12">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Bank-level encryption
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  English & Spanish
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  Results in 5 minutes
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Everything you need,{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                nothing you don&apos;t
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              From your first question to your green card approval, we cover every step of the journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-7 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
                >
                  {/* Hover glow */}
                  <div className={`absolute -inset-px rounded-2xl ${feature.bgGlow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />

                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-5`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[120px] -translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Four steps to clarity
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
              Go from confused to confident in minutes, not months.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative group"
                >
                  <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.06] p-7 h-full hover:border-emerald-500/20 transition-all duration-500">
                    {/* Step number */}
                    <span className="text-5xl font-black text-white/[0.06] absolute top-4 right-6 select-none group-hover:text-emerald-500/10 transition-colors duration-500">
                      {step.number}
                    </span>

                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors duration-500">
                        <Icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Connector arrow for lg */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                      <ChevronRight className="w-6 h-6 text-white/10" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
              Trusted by applicants nationwide
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-7 hover:bg-white/[0.05] transition-all duration-500"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{t.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-gradient-to-r from-emerald-500/[0.08] via-white/[0.03] to-blue-500/[0.08] border border-white/[0.06] p-8 sm:p-12"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: '5+', label: 'USCIS Forms Supported', icon: FileText },
                { value: '24/7', label: 'AI Assistance Available', icon: Sparkles },
                { value: '2', label: 'Languages Supported', icon: Globe },
                { value: '<5 min', label: 'Average Assessment Time', icon: Zap },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="space-y-2">
                    <Icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.06] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to start your{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                immigration journey?
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Get your personalized assessment in under 5 minutes. Free, confidential, and no strings attached.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/chat" className="group">
                <button className="w-full sm:w-auto px-10 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 flex items-center justify-center gap-2">
                  Start Free Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/pricing">
                <button className="w-full sm:w-auto px-10 py-4 rounded-xl text-base font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] backdrop-blur-sm transition-all duration-300">
                  View Pricing
                </button>
              </Link>
            </div>
            <p className="text-xs text-slate-600">
              This tool provides AI-assisted guidance only and does not constitute legal advice.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
