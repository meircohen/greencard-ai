"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  Building2,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Case {
  id: string;
  type: "i130" | "i485" | "eb2";
  title: string;
  receiptNumber: string;
  filedDate: string;
  serviceCenter: string;
  progress: number;
  status: "active" | "pending" | "completed";
  lastUpdated: string;
  documents: number;
  forms: number;
  nextDeadline?: string;
}

const mockCases: Case[] = [
  {
    id: "case-001",
    type: "i130",
    title: "I-130 Spouse Petition",
    receiptNumber: "LIN2401234567",
    filedDate: "January 15, 2024",
    serviceCenter: "Lincoln, Nebraska",
    progress: 65,
    status: "active",
    lastUpdated: "4 days ago",
    documents: 8,
    forms: 3,
    nextDeadline: "May 15, 2024",
  },
  {
    id: "case-002",
    type: "eb2",
    title: "EB-2 Employment-Based",
    receiptNumber: "TSC2310987654",
    filedDate: "October 3, 2023",
    serviceCenter: "Texas Service Center",
    progress: 45,
    status: "pending",
    lastUpdated: "2 weeks ago",
    documents: 12,
    forms: 5,
    nextDeadline: "June 1, 2024",
  },
  {
    id: "case-003",
    type: "i485",
    title: "I-485 Adjustment of Status",
    receiptNumber: "EAC2311123456",
    filedDate: "November 20, 2023",
    serviceCenter: "Eastern Processing Center",
    progress: 28,
    status: "active",
    lastUpdated: "1 week ago",
    documents: 15,
    forms: 6,
  },
];

const caseTypeConfig = {
  i130: { icon: "👨‍👩‍👧‍👦", label: "Family" },
  i485: { icon: "🏠", label: "Adjustment" },
  eb2: { icon: "💼", label: "Employment" },
};

const statusConfig = {
  active: {
    badge: "blue",
    icon: CheckCircle2,
    color: "text-blue-600",
  },
  pending: {
    badge: "amber",
    icon: Clock,
    color: "text-amber-600",
  },
  completed: {
    badge: "green",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
};

export default function CasesPage() {
  const [filterTab, setFilterTab] = useState<"all" | "active" | "pending" | "completed">("all");

  const filteredCases = mockCases.filter((c) => {
    if (filterTab === "all") return true;
    return c.status === filterTab;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white bg-white">
      <Navbar />
      <main className="flex-1 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">My Cases</h1>
            <p className="text-slate-600">
              Track and manage your immigration cases
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 whitespace-nowrap">
            <Plus size={18} />
            New Case
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-200 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          {["all", "active", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab as typeof filterTab)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors capitalize whitespace-nowrap text-sm sm:text-base ${
                filterTab === tab
                  ? "bg-emerald-50 text-emerald-600 border border-green-500/50"
                  : "text-slate-600 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cases Grid */}
        {filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCases.map((caseItem) => {
              const statusConfig_ = statusConfig[caseItem.status];
              const IconComponent = statusConfig_.icon;

              return (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.id}`}
                  className="group"
                >
                  <Card className="p-4 sm:p-6 h-full hover:border-green-500/50 transition-all cursor-pointer">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl sm:text-2xl flex-shrink-0">
                            {
                              caseTypeConfig[caseItem.type as keyof typeof caseTypeConfig]
                                .icon
                            }
                          </span>
                          <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm sm:text-base">
                            {caseItem.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted">
                          {caseItem.receiptNumber}
                        </p>
                      </div>
                      <Badge
                        variant={
                          statusConfig_.badge as
                            | "gray"
                            | "green"
                            | "amber"
                            | "blue"
                        }
                        className="flex-shrink-0"
                      >
                        <IconComponent size={14} className="mr-1" />
                        {caseItem.status}
                      </Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 py-3 sm:py-4 border-y border-slate-200">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Filed Date</p>
                        <p className="text-sm font-medium text-slate-900">
                          {caseItem.filedDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Service Center
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {caseItem.serviceCenter}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-600">Progress</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {caseItem.progress}%
                        </p>
                      </div>
                      <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400"
                          style={{ width: `${caseItem.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 py-2 sm:py-3 border-t border-b border-slate-200 text-center">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Documents</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {caseItem.documents}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Forms</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {caseItem.forms}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Updated</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {caseItem.lastUpdated}
                        </p>
                      </div>
                    </div>

                    {/* Deadline */}
                    {caseItem.nextDeadline && (
                      <div className="flex items-center gap-2 p-2 sm:p-3 bg-amber-50 border border-amber-500/30 rounded-lg mb-3 sm:mb-4">
                        <AlertCircle
                          size={16}
                          className="text-amber-600 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-amber-600">
                            Deadline: {caseItem.nextDeadline}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-emerald-600 group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">View Details</span>
                      <ArrowRight size={16} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText
              size={48}
              className="mx-auto text-muted mb-4 opacity-50"
            />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No cases found
            </h3>
            <p className="text-slate-600 mb-6">
              Create a new case to get started with your immigration journey
            </p>
            <Button className="bg-green-500 hover:bg-green-600">
              Create Your First Case
            </Button>
          </div>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
}
