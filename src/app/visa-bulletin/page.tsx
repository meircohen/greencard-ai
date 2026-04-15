"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface DateInfo {
  date: string;
  waitYears: number | null;
}

const getDateColor = (waitYears: number | null): string => {
  if (waitYears === null) return "bg-green-500/20 text-green-300 border-green-500/30";
  if (waitYears < 2) return "bg-green-500/20 text-green-300 border-green-500/30";
  if (waitYears < 5) return "bg-amber-400/20 text-amber-300 border-amber-400/30";
  if (waitYears < 10) return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  return "bg-red-500/20 text-red-300 border-red-500/30";
};

const calculateWaitYears = (dateStr: string): number | null => {
  if (dateStr === "CURRENT") return null;

  const matches = dateStr.match(/.{1,3}/g);
  if (!matches || matches.length < 2) return null;
  const [month, year] = matches;
  
  const months: { [key: string]: number } = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };
  
  const monthNum = months[month.toUpperCase()];
  const yearNum = parseInt(year);
  
  if (monthNum === undefined) return null;
  
  const targetDate = new Date(yearNum, monthNum, 1);
  const now = new Date(2026, 3, 14); // April 14, 2026
  
  const diffTime = now.getTime() - targetDate.getTime();
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  
  return Math.max(0, Math.round(diffYears * 10) / 10);
};

const DateCell: React.FC<{ value: string }> = ({ value }) => {
  const waitYears = calculateWaitYears(value);
  const colorClass = getDateColor(waitYears);
  
  return (
    <div className="flex items-center gap-2">
      <div className={`px-3 py-2 rounded border ${colorClass} text-sm font-mono font-medium whitespace-nowrap`}>
        {value}
      </div>
      {waitYears !== null && (
        <span className="text-xs text-muted font-mono">
          {waitYears}y
        </span>
      )}
    </div>
  );
};

const familyDataFinal = [
  {
    category: "F1",
    description: "Unmarried adult children of US citizens",
    countries: {
      all: "15SEP20",
      china: "15SEP20",
      india: "15SEP20",
      mexico: "01MAR00",
      philippines: "01APR13",
    },
  },
  {
    category: "F2A",
    description: "Spouses & children of LPRs",
    countries: {
      all: "22SEP22",
      china: "22SEP22",
      india: "22SEP22",
      mexico: "01JUN21",
      philippines: "22SEP22",
    },
  },
  {
    category: "F2B",
    description: "Unmarried adult children of LPRs",
    countries: {
      all: "08FEB16",
      china: "08FEB16",
      india: "08FEB16",
      mexico: "01MAR02",
      philippines: "22OCT12",
    },
  },
  {
    category: "F3",
    description: "Married children of US citizens",
    countries: {
      all: "22APR10",
      china: "22APR10",
      india: "22APR10",
      mexico: "15NOV99",
      philippines: "08APR02",
    },
  },
  {
    category: "F4",
    description: "Siblings of adult US citizens",
    countries: {
      all: "08MAR07",
      china: "08MAR07",
      india: "15JAN05",
      mexico: "01MAY00",
      philippines: "22JAN03",
    },
  },
];

const employmentDataFinal = [
  {
    category: "EB-1",
    description: "Priority Workers (Extraordinary ability, Professionals with advanced degrees, Executives)",
    countries: {
      all: "CURRENT",
      china: "15JAN22",
      india: "01FEB13",
      mexico: "CURRENT",
      philippines: "CURRENT",
    },
  },
  {
    category: "EB-2",
    description: "Professionals with advanced degrees or exceptional ability",
    countries: {
      all: "CURRENT",
      china: "01JUN20",
      india: "15APR12",
      mexico: "CURRENT",
      philippines: "CURRENT",
    },
  },
  {
    category: "EB-3",
    description: "Skilled workers, professionals, and unskilled workers",
    countries: {
      all: "22MAR22",
      china: "22APR20",
      india: "22JUL12",
      mexico: "22MAR22",
      philippines: "22MAR22",
    },
  },
  {
    category: "EB-4",
    description: "Special immigrants and other workers",
    countries: {
      all: "CURRENT",
      china: "CURRENT",
      india: "CURRENT",
      mexico: "CURRENT",
      philippines: "CURRENT",
    },
  },
  {
    category: "EB-5",
    description: "Investors creating employment",
    countries: {
      all: "CURRENT",
      china: "15MAR16",
      india: "01JAN21",
      mexico: "CURRENT",
      philippines: "CURRENT",
    },
  },
];

export default function VisaBulletin() {
  const [visaType, setVisaType] = useState<"family" | "employment">("family");
  const [actionType, setActionType] = useState<"final" | "filing">("final");

  const data = visaType === "family" ? familyDataFinal : employmentDataFinal;

  return (
    <div className="min-h-screen bg-midnight text-primary">
      <Navbar />
      {/* Page Header */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-400">Immigration Data</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">April 2026 Priority Dates</h1>
          <p className="text-secondary text-lg">
            Current visa bulletin showing priority dates and processing timelines for family and employment-based categories
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visa Type Toggle */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-secondary">Visa Category</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setVisaType("family")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    visaType === "family"
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : "bg-white/5 text-secondary border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Family-Based
                </button>
                <button
                  onClick={() => setVisaType("employment")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    visaType === "employment"
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : "bg-white/5 text-secondary border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Employment-Based
                </button>
              </div>
            </div>

            {/* Action Type Toggle */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-secondary">Action Type</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setActionType("final")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    actionType === "final"
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : "bg-white/5 text-secondary border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Final Action
                </button>
                <button
                  onClick={() => setActionType("filing")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    actionType === "filing"
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : "bg-white/5 text-secondary border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Dates for Filing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-semibold text-primary">Category</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">All Countries</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">China</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">India</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">Mexico</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">Philippines</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-6 px-4">
                      <div className="font-semibold text-primary mb-1">{row.category}</div>
                      <div className="text-xs text-muted">{row.description}</div>
                    </td>
                    <td className="py-6 px-4">
                      <DateCell value={row.countries.all} />
                    </td>
                    <td className="py-6 px-4">
                      <DateCell value={row.countries.china} />
                    </td>
                    <td className="py-6 px-4">
                      <DateCell value={row.countries.india} />
                    </td>
                    <td className="py-6 px-4">
                      <DateCell value={row.countries.mexico} />
                    </td>
                    <td className="py-6 px-4">
                      <DateCell value={row.countries.philippines} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-8 p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold text-primary mb-4">Wait Time Legend</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-secondary">CURRENT or &lt;2 years</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-amber-400"></div>
                <span className="text-secondary">2-5 years</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span className="text-secondary">5-10 years</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-secondary">&gt;10 years</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> Priority dates are based on the official USCIS Visa Bulletin for April 2026. These dates indicate when your visa number becomes available for adjudication. Actual processing times may vary based on individual circumstances, background checks, and USCIS workload.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
