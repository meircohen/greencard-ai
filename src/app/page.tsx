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
  Globe,
  Lock,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Immigration Advisor',
    description: 'Chat with an AI trained on real USCIS data. Get instant answers about visa options, timelines, and eligibility.',
    bgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
  {
    icon: Clock,
    title: 'Live Visa Bulletin',
    description: 'Real-time priority date tracking with historical trends and wait time predictions for every category.',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
  {
    icon: FileText,
    title: 'Smart Form Filling',
    description: 'AI pre-fills your I-485, I-130, and more. Built-in validation catches errors before USCIS does.',
    bgColor: 'bg-violet-100',
    iconColor: 'text-violet-700',
  },
  {
    icon: Shield,
    title: 'RFE Decoder',
    description: 'Paste any Request for Evidence and get a plain-English breakdown with a response strategy.',
    bgColor: 'bg-amber-100',
    iconColor: 'text-amber-700',
  },
  {
    icon: Calculator,
    title: 'Cost Calculator',
    description: 'Transparent fee breakdowns for every visa type, including attorney costs and premium processing.',
    bgColor: 'bg-rose-100',
    iconColor: 'text-rose-700',
  },
  {
    icon: Users,
    title: 'Attorney Network',
    description: 'When you need a lawyer, connect with vetted immigration attorneys who can review your AI-prepared case.',
    bgColor: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
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

const trustSignals = [
  {
    icon: CheckCircle2,
    title: 'Built on Real USCIS Data',
    description: 'Our assessments are based on actual USCIS processing data and historical approval patterns.',
  },
  {
    icon: Award,
    title: 'Attorney-Reviewed',
    description: 'All tools and guidance reviewed by licensed immigration attorneys.',
  },
  {
    icon: Lock,
    title: 'Bank-Level Security',
    description: 'Your information is encrypted and protected with enterprise-grade security.',
  },
  {
    icon: Globe,
    title: 'English & Spanish',
    description: 'Full support in both English and Spanish for accessibility.',
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
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
            {/* Pill badge */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                Built on Real USCIS Data
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
            >
              <span className="text-blue-900">Get Your Green Card Approved</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="text-xl sm:text-2xl text-slate-700 font-semibold"
            >
              Attorney-Reviewed. Step by Step.
            </motion.p>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Expert guidance to avoid mistakes. Real USCIS data. Peace of mind from start to approval.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/chat" className="group">
                <button className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm">
                  Check Your Eligibility Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/attorneys">
                <button className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-semibold text-blue-900 bg-white border-2 border-blue-900 hover:bg-blue-50 transition-colors duration-300">
                  Talk to an Attorney
                </button>
              </Link>
            </motion.div>

            {/* Trust bar */}
            <motion.div variants={fadeUp} className="pt-12">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-700">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Bank-level encryption
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Attorney-reviewed
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  English & Spanish
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  No hidden fees
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900">
              Everything you need,{' '}
              <span className="text-emerald-600">nothing you don&apos;t</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              From your first question to your green card approval, we cover every step of the journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  className="group relative rounded-lg bg-white border border-gray-200 p-7 hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-5`}>
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900">
              Four simple steps to clarity
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
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
                  <div className="relative rounded-lg bg-white border border-gray-200 p-7 h-full hover:shadow-md transition-all duration-300">
                    {/* Step number */}
                    <span className="text-4xl font-black text-gray-100 absolute top-4 right-6 select-none">
                      {step.number}
                    </span>

                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-emerald-700" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Connector arrow for lg */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                      <ChevronRight className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST SIGNALS ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-blue-900">
              Built on trust and expertise
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map((signal, i) => {
              const Icon = signal.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-lg bg-white border border-gray-200 p-7 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{signal.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{signal.description}</p>
                </motion.div>
              );
            })}
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
            className="rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 p-8 sm:p-12"
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
                    <Icon className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                    <div className="text-3xl sm:text-4xl font-bold text-blue-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
              Ready to start your immigration journey?
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Get your personalized assessment in under 5 minutes. Free, confidential, and no strings attached.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/chat" className="group">
                <button className="w-full sm:w-auto px-10 py-4 rounded-lg text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm">
                  Start Your Application Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/pricing">
                <button className="w-full sm:w-auto px-10 py-4 rounded-lg text-base font-semibold text-blue-900 bg-white border-2 border-blue-900 hover:bg-blue-50 transition-colors duration-300">
                  View Pricing
                </button>
              </Link>
            </div>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              <strong>Legal Disclaimer:</strong> GreenCard.ai is not a law firm and does not provide legal advice. All guidance is AI-assisted only. Legal services are provided by Partner Immigration Law, PLLC, a licensed immigration law firm.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
