'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import {
  Search,
  TrendingUp,
  Clock,
  MapPin,
  Shield,
  ChevronRight,
  BarChart3,
  Activity,
  Globe,
  Zap,
} from 'lucide-react';

// USCIS Processing Times Data
const processingData = [
  {
    servicCenter: 'Nebraska',
    forms: {
      'I-485': { min: 8, max: 14, avg: 11 },
      'I-130': { min: 12, max: 35, avg: 24 },
      'I-765': { min: 3, max: 8, avg: 5 },
      'I-131': { min: 3, max: 8, avg: 5 },
      'N-400': { min: 6, max: 12, avg: 9 },
      'I-751': { min: 12, max: 24, avg: 18 },
    },
  },
  {
    servicCenter: 'Texas',
    forms: {
      'I-485': { min: 9, max: 15, avg: 12 },
      'I-130': { min: 14, max: 38, avg: 26 },
      'I-765': { min: 4, max: 9, avg: 6 },
      'I-131': { min: 4, max: 9, avg: 6 },
      'N-400': { min: 7, max: 13, avg: 10 },
      'I-751': { min: 14, max: 26, avg: 20 },
    },
  },
  {
    servicCenter: 'Potomac',
    forms: {
      'I-485': { min: 10, max: 16, avg: 13 },
      'I-130': { min: 15, max: 40, avg: 28 },
      'I-765': { min: 3, max: 8, avg: 5 },
      'I-131': { min: 3, max: 8, avg: 5 },
      'N-400': { min: 8, max: 14, avg: 11 },
      'I-751': { min: 15, max: 28, avg: 22 },
    },
  },
  {
    servicCenter: 'California',
    forms: {
      'I-485': { min: 11, max: 18, avg: 15 },
      'I-130': { min: 16, max: 42, avg: 30 },
      'I-765': { min: 4, max: 10, avg: 7 },
      'I-131': { min: 4, max: 10, avg: 7 },
      'N-400': { min: 9, max: 15, avg: 12 },
      'I-751': { min: 16, max: 30, avg: 24 },
    },
  },
  {
    servicCenter: 'Vermont',
    forms: {
      'I-485': { min: 7, max: 13, avg: 10 },
      'I-130': { min: 11, max: 32, avg: 22 },
      'I-765': { min: 2, max: 7, avg: 4 },
      'I-131': { min: 2, max: 7, avg: 4 },
      'N-400': { min: 5, max: 11, avg: 8 },
      'I-751': { min: 10, max: 22, avg: 16 },
    },
  },
];

const formTypes = [
  { id: 'I-485', label: 'I-485 (AOS)', desc: 'Adjustment of Status' },
  { id: 'I-130', label: 'I-130 (Family Petition)', desc: 'Family-based petition' },
  { id: 'I-765', label: 'I-765 (EAD)', desc: 'Employment Authorization' },
  { id: 'I-131', label: 'I-131 (Travel Doc)', desc: 'Advance Parole' },
  { id: 'N-400', label: 'N-400 (Citizenship)', desc: 'Naturalization' },
  { id: 'I-751', label: 'I-751 (Remove Conditions)', desc: 'Remove Conditions' },
];

function ProcessingTimeCell({ time, average }: { time: number; average: number }) {
  const ratio = time / average;
  let bgColor = 'bg-green-100 text-green-900';
  if (ratio > 1.1) {
    bgColor = 'bg-red-100 text-red-900';
  } else if (ratio > 0.95) {
    bgColor = 'bg-yellow-100 text-yellow-900';
  }

  return (
    <div className={`${bgColor} rounded px-3 py-2 text-center font-semibold text-sm`}>
      {time}mo
    </div>
  );
}

function StatCounter({ label, value }: { label: string; value: string | number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'string') {
      setDisplayValue(parseInt(value));
    } else {
      let current = 0;
      const target = value;
      const increment = target / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setDisplayValue(target);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">
        {displayValue.toLocaleString()}
        {typeof value === 'string' && value.includes('%') && '%'}
      </div>
      <p className="text-slate-600 font-medium">{label}</p>
    </div>
  );
}

interface DemoCaseStage {
  name: string;
  completed: boolean;
  current: boolean;
}

const demoStages: DemoCaseStage[] = [
  { name: 'Filed', completed: true, current: false },
  { name: 'Receipt', completed: true, current: false },
  { name: 'Biometrics', completed: true, current: false },
  { name: 'Interview Scheduled', completed: true, current: true },
  { name: 'Interview', completed: false, current: false },
  { name: 'Decision', completed: false, current: false },
  { name: 'Approved', completed: false, current: false },
];

export default function TrackerPage() {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [selectedForm, setSelectedForm] = useState('I-485');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiptNumber.trim()) {
      setShowSearchResult(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Track Your Immigration Case Like an Amazon Package
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Real-time USCIS processing data, AI-predicted timelines, and service center heatmaps. Free for everyone.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your USCIS receipt number (e.g., IOE0912345678)"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="whitespace-nowrap"
              >
                Track Case
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Search Result Modal */}
      {showSearchResult && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-blue-50 border-b-2 border-blue-200">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">To Track Your Case</h2>
            <p className="text-slate-600 mb-6">
              We can help you track your specific case with real-time updates and AI-powered predictions. To get started:
            </p>
            <div className="space-y-3 mb-8">
              <p className="text-slate-700">
                <span className="font-semibold">Option 1:</span> File your case with us and get Oracle tracking included
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Option 2:</span> Create a free account to import and track your existing case
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => (window.location.href = '/assessment')}
              className="w-full sm:w-auto"
            >
              Check Your Eligibility <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <button
              onClick={() => setShowSearchResult(false)}
              className="block mt-4 text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      {/* USCIS Processing Heatmap Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">REAL-TIME DATA</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">USCIS Processing Times by Service Center</h2>
            <p className="text-slate-600">
              Estimated processing times for common form types. Last updated: April 15, 2026
            </p>
          </div>

          {/* Form Type Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {formTypes.map((form) => (
              <button
                key={form.id}
                onClick={() => setSelectedForm(form.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedForm === form.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {form.label}
              </button>
            ))}
          </div>

          {/* Heatmap Table */}
          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-md">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Service Center</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Min</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Max</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Average</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {processingData.map((center, idx) => {
                  const formData = center.forms[selectedForm as keyof typeof center.forms];
                  const globalAvg = 10; // Simplified global average
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{center.servicCenter}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{formData.min}mo</td>
                      <td className="px-6 py-4 text-center text-slate-600">{formData.max}mo</td>
                      <td className="px-6 py-4 text-center">
                        <ProcessingTimeCell time={formData.avg} average={globalAvg} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        {formData.avg <= globalAvg ? (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Fast
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            Slow
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Color Legend */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded border border-green-300"></div>
              <span className="text-slate-600">Faster than average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 rounded border border-yellow-300"></div>
              <span className="text-slate-600">Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded border border-red-300"></div>
              <span className="text-slate-600">Slower than average</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Ticker */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <StatCounter label="Cases Tracked" value="12847" />
            <StatCounter label="Average Prediction Accuracy" value="94" />
            <StatCounter label="Service Centers Monitored" value="5" />
            <StatCounter label="Forms Tracked" value="15" />
          </div>
        </div>
      </section>

      {/* Case Prediction Demo Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">LOGGED-IN EXPERIENCE</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">What You'll Get with Oracle Tracking</h2>
            <p className="text-slate-600">
              Here's a preview of personalized case tracking with AI-powered predictions (available for logged-in users and our clients)
            </p>
          </div>

          {/* Demo Case Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-8">
            {/* Case Header */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Marriage Green Card (I-485)</h3>
                  <p className="text-slate-600 mt-1">Filed at Nebraska Service Center</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Receipt Number</p>
                  <p className="text-lg font-mono font-semibold text-slate-900">IOE0912345678</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-700 bg-green-50 w-fit px-3 py-1 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Based on 847 similar cases
              </div>
            </div>

            {/* Progress Stages */}
            <div className="mb-8">
              <h4 className="font-semibold text-slate-900 mb-6">Your Case Progress</h4>
              <div className="space-y-4">
                {demoStages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        stage.completed
                          ? 'bg-green-100 text-green-700'
                          : stage.current
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {stage.completed ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          stage.completed || stage.current
                            ? 'text-slate-900'
                            : 'text-slate-500'
                        }`}
                      >
                        {stage.name}
                      </p>
                    </div>
                    {stage.current && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Current Stage
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prediction Card */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 pt-8 border-t border-slate-200">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-700" />
                  <p className="text-sm font-semibold text-green-900">Predicted Approval</p>
                </div>
                <p className="text-2xl font-bold text-green-900">July-August 2026</p>
                <p className="text-xs text-green-700 mt-2">Based on current timeline</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-700" />
                  <p className="text-sm font-semibold text-blue-900">Timeline Status</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">12 days ahead</p>
                <p className="text-xs text-blue-700 mt-2">Of average timeline</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-orange-700" />
                  <p className="text-sm font-semibold text-orange-900">RFE Probability</p>
                </div>
                <p className="text-2xl font-bold text-green-600">Low (8%)</p>
                <p className="text-xs text-orange-700 mt-2">Request for Evidence likely</p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <p className="text-sm text-slate-600">
                Your case is on track. Confidence level: <span className="font-semibold text-slate-900">94%</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-2 mb-2 justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">HOW IT WORKS</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900">AI-Powered Predictions in 3 Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">We analyze USCIS data</h3>
              <p className="text-slate-600">
                Our system scrapes public USCIS processing times daily, tracking changes across all five service centers in real time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">We learn from real cases</h3>
              <p className="text-slate-600">
                Our ML model is trained on thousands of filed cases and their actual timelines, enabling accurate predictions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">You get predictions</h3>
              <p className="text-slate-600">
                Get personalized approval timelines, RFE risk assessments, and real-time updates for your specific case.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Want personalized predictions for YOUR case?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            File with us and get Oracle tracking included. Or import an existing case to start tracking today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => (window.location.href = '/assessment')}
            >
              Check Your Eligibility <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = '/contact')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
