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
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Sparkles,
    title: 'AI Case Advisor',
    description: 'Chat with our AI advisor to understand your visa options, timeline, and requirements.',
  },
  {
    icon: Clock,
    title: 'Live Visa Bulletin',
    description: 'Real-time visa bulletin data to track your priority date and processing progress.',
  },
  {
    icon: FileText,
    title: 'Smart Form Filling',
    description: 'AI-assisted form completion with intelligent field suggestions and validation.',
  },
  {
    icon: Calculator,
    title: 'Cost Calculator',
    description: 'Transparent cost breakdowns for all visa types and processing options.',
  },
  {
    icon: Users,
    title: 'Partner Attorney',
    description: 'When you need a lawyer, our partner firm reviews your AI-prepared case and handles filing.',
  },
  {
    icon: BarChart3,
    title: 'Deadline Tracking',
    description: 'Never miss an important deadline with our intelligent reminder system.',
  },
];

const stats = [
  { value: '94.2%', label: 'I-130 Approval Rate' },
  { value: '8.5-14mo', label: 'Processing Time' },
  { value: '$3,200', label: 'Avg Total Cost' },
  { value: '50K+', label: 'Cases Analyzed' },
];

const steps = [
  {
    number: 1,
    title: 'Tell Your Story',
    description: 'Share your immigration background and goals with our AI advisor.',
  },
  {
    number: 2,
    title: 'Get Assessment',
    description: 'Receive a detailed analysis of your case with success rates and timelines.',
  },
  {
    number: 3,
    title: 'Fill Forms',
    description: 'Complete all required USCIS forms with intelligent assistance.',
  },
  {
    number: 4,
    title: 'Track Progress',
    description: 'Monitor your application status and upcoming deadlines in real-time.',
  },
];

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient and grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-midnight to-blue-500/10"
            aria-hidden="true"
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <Badge variant="green" withPulse>
                Powered by Real USCIS Data + AI
              </Badge>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="gradient-text">Your path to a Green Card,</span>
              <br />
              <span className="text-primary">made clear.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto"
            >
              AI-powered guidance powered by real USCIS data. Get accurate visa assessments,
              timeline predictions, cost estimates, and step-by-step form assistance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/chat">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Free Assessment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/visa-bulletin">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Visa Bulletin
                </Button>
              </Link>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-brand">
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Everything you need
            </h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and guidance you need for a
              successful immigration journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card
                    withGlow
                    glowColor="green"
                    className="p-6 h-full hover:scale-105 transition-transform"
                  >
                    <Icon className="w-8 h-8 text-green-brand mb-4" />
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-secondary text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              How it works
            </h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Four simple steps to understand your options and start your application.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-brand to-blue-accent flex items-center justify-center mb-4 font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-secondary text-sm">{step.description}</p>
                </div>

                {/* Connector line for lg screens */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-6 left-[calc(50%+24px)] right-[-50%] h-0.5 bg-gradient-to-r from-green-brand/50 to-transparent"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Ready to start your journey?
            </h2>
            <p className="text-secondary text-lg">
              Get your personalized immigration assessment in minutes. No commitments, no costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/chat">
                <Button variant="primary" size="lg">
                  Start Free Assessment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
