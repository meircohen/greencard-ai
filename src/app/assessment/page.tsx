'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  FileText,
  Users,
  Download,
  ArrowRight,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AssessmentData {
  score: number;
  category: string;
  summary: string;
  approvalRate: number;
  processingTime: string;
  estimatedCost: number;
  rfeRisk: number;
  paths: Array<{
    name: string;
    probability: number;
    timeline: string;
    cost: string;
    description: string;
    forms: string[];
  }>;
  requiredDocuments: string[];
  warnings: string[];
  nextSteps: string[];
}

const mockAssessmentData: AssessmentData = {
  score: 78,
  category: 'Strong Case',
  summary: 'Based on your information, you have a promising immigration case with multiple viable pathways.',
  approvalRate: 92,
  processingTime: '10-14 months',
  estimatedCost: 3200,
  rfeRisk: 15,
  paths: [
    {
      name: 'Employment-Based (EB-3)',
      probability: 85,
      timeline: '12-18 months',
      cost: '$2,500-$4,000',
      description: 'Sponsored employment-based green card through your current or prospective employer.',
      forms: ['I-140', 'I-485'],
    },
    {
      name: 'Family-Based (IR)',
      probability: 60,
      timeline: '8-12 months',
      cost: '$1,500-$2,500',
      description: 'Immigration through a qualifying family member relationship.',
      forms: ['I-130', 'I-485'],
    },
    {
      name: 'Diversity Visa',
      probability: 35,
      timeline: '18-24 months',
      cost: '$330-$660',
      description: 'Lottery-based green card program for eligible countries.',
      forms: ['DS-260'],
    },
  ],
  requiredDocuments: [
    'Valid passport',
    'Birth certificate (translated and certified)',
    'Police clearance from all countries lived in',
    'Medical examination (I-693)',
    'Employment letters',
    'Bank statements (last 2 years)',
    'Tax returns (last 3 years)',
    'Marriage certificate (if applicable)',
  ],
  warnings: [
    'Your priority date may have retrogression delays. Current visa bulletin shows your category is backlogged.',
    'Recent employment changes may require additional USCIS verification.',
  ],
  nextSteps: [
    'Schedule a consultation with an immigration attorney to review your specific situation.',
    'Gather all required documents and have them professionally translated.',
    'Prepare your Form I-485 application with assistance from our smart form filling tool.',
    'Submit your application and track its progress in real-time.',
  ],
};

export default function AssessmentPage() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assessment data
    const loadAssessment = () => {
      setTimeout(() => {
        setAssessmentData(mockAssessmentData);
        setIsLoading(false);
      }, 500);
    };

    loadAssessment();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-green-brand border-t-transparent animate-spin mx-auto" />
          <p className="text-secondary">Generating your assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-midnight flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-2xl font-bold text-primary">No Assessment Found</h1>
          <p className="text-secondary">
            Start a conversation to get your personalized assessment.
          </p>
          <Link href="/chat">
            <Button variant="primary" size="lg">
              Start Chat <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-midnight">
      {/* Header */}
      <div className="border-b border-white/10 bg-surface/30 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Your Assessment</h1>
              <p className="text-secondary text-sm mt-1">Personalized immigration case analysis</p>
            </div>
            <Button variant="secondary" size="md">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Score Circle */}
          <motion.div variants={itemVariants}>
            <Card withGradientBorder withGlow className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* SVG Circle Score */}
                <div className="flex-shrink-0">
                  <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    className="transform -rotate-90"
                  >
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(assessmentData.score / 100) * 565} 565`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient
                        id="scoreGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Score text overlay */}
                  <div className="absolute w-48 h-48 flex items-center justify-center -ml-48 -mt-48">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-brand">
                        {assessmentData.score}
                      </div>
                      <div className="text-muted text-sm">out of 100</div>
                    </div>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 space-y-6">
                  <div>
                    <Badge variant="green">{assessmentData.category}</Badge>
                    <h2 className="text-2xl font-bold text-primary mt-3">
                      {assessmentData.summary}
                    </h2>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface/50 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Percent className="w-4 h-4 text-green-brand" />
                        <span className="text-muted text-sm">Approval Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {assessmentData.approvalRate}%
                      </div>
                    </div>
                    <div className="bg-surface/50 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-accent" />
                        <span className="text-muted text-sm">Processing Time</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {assessmentData.processingTime}
                      </div>
                    </div>
                    <div className="bg-surface/50 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-brand" />
                        <span className="text-muted text-sm">Est. Cost</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        ${assessmentData.estimatedCost.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-surface/50 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-muted text-sm">RFE Risk</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {assessmentData.rfeRisk}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Eligible Paths */}
          <motion.div variants={itemVariants}>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Eligible Immigration Paths</h2>
              <p className="text-secondary">
                Based on your profile, you may qualify for these visa categories:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {assessmentData.paths.map((path, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card
                    withGlow
                    glowColor={path.probability > 75 ? 'green' : 'blue'}
                    className="p-6 h-full flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-primary">{path.name}</h3>
                      <Badge
                        variant={path.probability > 75 ? 'green' : path.probability > 50 ? 'blue' : 'gray'}
                      >
                        {path.probability}%
                      </Badge>
                    </div>

                    <p className="text-secondary text-sm mb-4 flex-1">
                      {path.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-accent flex-shrink-0" />
                        <span className="text-sm text-secondary">{path.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-brand flex-shrink-0" />
                        <span className="text-sm text-secondary">{path.cost}</span>
                      </div>
                    </div>

                    {/* Forms */}
                    <div className="bg-surface/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-muted font-medium mb-2">Required Forms:</p>
                      <div className="flex flex-wrap gap-2">
                        {path.forms.map((form) => (
                          <Badge key={form} variant="gray">
                            {form}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link href="/chat">
                      <button className="w-full text-center px-4 py-2 rounded-lg border border-green-brand/30 text-green-light hover:bg-green-brand/10 transition-all text-sm font-medium">
                        Learn More
                      </button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Required Documents */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-green-brand" />
                <h2 className="text-2xl font-bold text-primary">Required Documents</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessmentData.requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface/50">
                    <CheckCircle2 className="w-5 h-5 text-green-brand flex-shrink-0 mt-0.5" />
                    <span className="text-secondary text-sm">{doc}</span>
                  </div>
                ))}
              </div>

              <Button variant="secondary" size="md" className="mt-6 w-full md:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download Checklist
              </Button>
            </Card>
          </motion.div>

          {/* Warnings Section */}
          {assessmentData.warnings.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-6 lg:p-8 border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-primary">Important Considerations</h2>
                </div>

                <div className="space-y-4">
                  {assessmentData.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-surface/50 border border-amber-500/20"
                    >
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary text-sm">{warning}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Next Steps</h2>

              <div className="space-y-4">
                {assessmentData.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-surface/50">
                    <div className="w-8 h-8 rounded-full bg-green-brand/20 border border-green-brand/50 flex items-center justify-center flex-shrink-0 text-green-brand font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-secondary text-sm pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" size="lg" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Connect with Attorney
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Start Form Filling
              </Button>
              <Button variant="primary" size="lg" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
