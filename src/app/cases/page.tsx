"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import React, { useState, useEffect } from "react";
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

interface CaseItem {
  id: string;
  caseType: string;
  category: string;
  status: "draft" | "submitted" | "processing" | "approved" | "completed" | "denied" | "abandoned";
  receiptNumber: string;
  serviceCenter: string;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
  formCount: number;
  nextDeadline: {
    deadlineDate: string;
    deadlineType: string;
    description: string;
  } | null;
}

const caseTypeConfig: {
  [key: string]: { icon: string; label: string };
} = {
  i130: { icon: "👨‍👩‍👧‍👦", label: "Family" },
  i485: { icon: "🏠", label: "Adjustment" },
  eb2: { icon: "💼", label: "Employment" },
  eb1c: { icon: "💼", label: "EB-1C" },
  l1b: { icon: "💼", label: "L-1B" },
  h1b: { icon: "💼", label: "H-1B" },
};

const statusConfig: {
  [key: string]: {
    badge: "gray" | "green" | "amber" | "blue" | "red";
    icon: any;
    color: string;
  };
} = {
  draft: {
    badge: "gray",
    icon: Clock,
    color: "text-slate-600",
  },
  submitted: {
    badge: "blue",
    icon: CheckCircle2,
    color: "text-blue-600",
  },
  processing: {
    badge: "amber",
    icon: Clock,
    color: "text-amber-600",
  },
  approved: {
    badge: "green",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  completed: {
    badge: "green",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  denied: {
    badge: "red",
    icon: AlertCircle,
    color: "text-red-600",
  },
  abandoned: {
    badge: "gray",
    icon: AlertCircle,
    color: "text-slate-600",
  },
};

const getProgressFromStatus = (status: string): number => {
  const progressMap: { [key: string]: number } = {
    draft: 10,
    submitted: 30,
    processing: 55,
    approved: 85,
    completed: 100,
    denied: 0,
    abandoned: 0,
  };
  return progressMap[status] || 0;
};

const getCaseTitle = (caseType: string): string => {
  const titles: { [key: string]: string } = {
    i130: "I-130 Spouse Petition",
    i485: "I-485 Adjustment of Status",
    eb2: "EB-2 Employment-Based",
    eb1c: "EB-1C Green Card",
    l1b: "L-1B Work Visa",
    h1b: "H-1B Work Visa",
  };
  return titles[caseType] || caseType;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export default function CasesPage() {
  const [filterTab, setFilterTab] = useState<
    "all" | "draft" | "submitted" | "processing" | "approved" | "completed"
  >("all");
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cases");

        if (!response.ok) {
          if (response.status === 401) {
            setError("Not authenticated");
          } else {
            setError("Failed to load cases");
          }
          return;
        }

        const data = await response.json();
        setCases(data.cases || []);
        setError(null);
      } catch (err) {
        setError("Failed to load cases");
        console.error("Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    if (filterTab === "all") return true;
    return c.status === filterTab;
  });

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 sm:pt-24 pb-8 sm:pb-12 flex items-center justify-center">
          <Card className="p-8 text-center">
            <AlertCircle
              size={48}
              className="mx-auto text-red-600 mb-4 opacity-50"
            />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-green-500 hover:bg-green-600"
            >
              Try Again
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white bg-white">
      <Navbar />
      <main className="flex-1 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                My Cases
              </h1>
              <p className="text-slate-600">
                Track and manage your immigration cases
              </p>
            </div>
            <Link href="/onboarding">
              <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 whitespace-nowrap">
                <Plus size={18} />
                New Case
              </Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-200 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            {["all", "draft", "submitted", "processing", "approved", "completed"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab as any)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors capitalize whitespace-nowrap text-sm sm:text-base ${
                    filterTab === tab
                      ? "bg-emerald-50 text-emerald-600 border border-green-500/50"
                      : "text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16">
              <Clock size={48} className="mx-auto text-muted mb-4 opacity-50 animate-spin" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Loading cases...
              </h3>
            </div>
          ) : filteredCases.length > 0 ? (
            /* Cases Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCases.map((caseItem) => {
                const statusConfig_ =
                  statusConfig[caseItem.status] || statusConfig.draft;
                const IconComponent = statusConfig_.icon;
                const progress = getProgressFromStatus(caseItem.status);
                const title = getCaseTitle(caseItem.caseType);
                const config =
                  caseTypeConfig[caseItem.caseType] ||
                  caseTypeConfig.i130;

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
                              {config.icon}
                            </span>
                            <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm sm:text-base">
                              {title}
                            </h3>
                          </div>
                          <p className="text-xs text-muted">
                            {caseItem.receiptNumber}
                          </p>
                        </div>
                        <Badge
                          variant={statusConfig_.badge}
                          className="flex-shrink-0"
                        >
                          <IconComponent size={14} className="mr-1" />
                          {caseItem.status}
                        </Badge>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 py-3 sm:py-4 border-y border-slate-200">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">
                            Filed Date
                          </p>
                          <p className="text-sm font-medium text-slate-900">
                            {formatDate(caseItem.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">
                            Service Center
                          </p>
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {caseItem.serviceCenter || "—"}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-slate-600">Progress</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {progress}%
                          </p>
                        </div>
                        <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-400"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 py-2 sm:py-3 border-t border-b border-slate-200 text-center">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">
                            Documents
                          </p>
                          <p className="text-sm font-semibold text-slate-900">
                            {caseItem.documentCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Forms</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {caseItem.formCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Updated</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {formatRelativeDate(caseItem.updatedAt)}
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
                              Deadline:{" "}
                              {formatDate(
                                caseItem.nextDeadline.deadlineDate
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center gap-2 text-emerald-600 group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium">
                          View Details
                        </span>
                        <ArrowRight size={16} />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* No Cases */
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
              <Link href="/onboarding">
                <Button className="bg-green-500 hover:bg-green-600">
                  Create Your First Case
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
