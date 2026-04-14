"use client";

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
    color: "text-blue-400",
  },
  pending: {
    badge: "amber",
    icon: Clock,
    color: "text-amber-400",
  },
  completed: {
    badge: "green",
    icon: CheckCircle2,
    color: "text-green-400",
  },
};

export default function CasesPage() {
  const [filterTab, setFilterTab] = useState<"all" | "active" | "pending" | "completed">("all");

  const filteredCases = mockCases.filter((c) => {
    if (filterTab === "all") return true;
    return c.status === filterTab;
  });

  return (
    <div className="min-h-screen bg-midnight pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">My Cases</h1>
            <p className="text-secondary">
              Track and manage your immigration cases
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 whitespace-nowrap">
            <Plus size={18} />
            New Case
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-white/10">
          {["all", "active", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab as typeof filterTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filterTab === tab
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "text-secondary hover:text-primary hover:bg-surface/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cases Grid */}
        {filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => {
              const statusConfig_ = statusConfig[caseItem.status];
              const IconComponent = statusConfig_.icon;

              return (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.id}`}
                  className="group"
                >
                  <Card className="p-6 h-full hover:border-green-500/50 transition-all cursor-pointer">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {
                              caseTypeConfig[caseItem.type as keyof typeof caseTypeConfig]
                                .icon
                            }
                          </span>
                          <h3 className="font-semibold text-primary line-clamp-2">
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
                    <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-white/10">
                      <div>
                        <p className="text-xs text-secondary mb-1">Filed Date</p>
                        <p className="text-sm font-medium text-primary">
                          {caseItem.filedDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary mb-1">
                          Service Center
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {caseItem.serviceCenter}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-secondary">Progress</p>
                        <p className="text-sm font-semibold text-primary">
                          {caseItem.progress}%
                        </p>
                      </div>
                      <div className="w-full bg-surface/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400"
                          style={{ width: `${caseItem.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-t border-b border-white/10 text-center">
                      <div>
                        <p className="text-xs text-secondary mb-1">Documents</p>
                        <p className="text-sm font-semibold text-primary">
                          {caseItem.documents}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary mb-1">Forms</p>
                        <p className="text-sm font-semibold text-primary">
                          {caseItem.forms}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary mb-1">Updated</p>
                        <p className="text-sm font-semibold text-primary">
                          {caseItem.lastUpdated}
                        </p>
                      </div>
                    </div>

                    {/* Deadline */}
                    {caseItem.nextDeadline && (
                      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
                        <AlertCircle
                          size={16}
                          className="text-amber-400 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-amber-400">
                            Deadline: {caseItem.nextDeadline}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-green-400 group-hover:translate-x-1 transition-transform">
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
            <h3 className="text-lg font-semibold text-primary mb-2">
              No cases found
            </h3>
            <p className="text-secondary mb-6">
              Create a new case to get started with your immigration journey
            </p>
            <Button className="bg-green-500 hover:bg-green-600">
              Create Your First Case
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
