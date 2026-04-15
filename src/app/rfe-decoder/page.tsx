"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  FileSearch,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface RfeIssue {
  category: string;
  description: string;
  severity: "minor" | "moderate" | "serious";
  suggestedEvidence: string[];
  sampleLanguage: string;
}

interface RfeAnalysis {
  summary: string;
  urgency: "low" | "medium" | "high" | "critical";
  deadlineDays: number;
  issues: RfeIssue[];
  responseStrategy: {
    overview: string;
    steps: string[];
    documentsNeeded: string[];
    estimatedPrepTime: string;
  };
  warnings: string[];
}

const urgencyColors = {
  low: "green",
  medium: "blue",
  high: "amber",
  critical: "red",
} as const;

export default function RfeDecoderPage() {
  const [rfeText, setRfeText] = useState("");
  const [formNumber, setFormNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RfeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());

  const analyze = async () => {
    if (rfeText.length < 50) {
      setError("Please paste the full RFE text (at least 50 characters)");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch("/api/rfe-decoder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfeText, formNumber: formNumber || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
      // Expand all issues by default
      setExpandedIssues(new Set(data.analysis.issues.map((_: RfeIssue, i: number) => i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleIssue = (idx: number) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FileSearch size={32} className="text-green-400" />
            <h1 className="text-3xl font-bold text-primary">RFE Decoder</h1>
          </div>
          <p className="text-secondary">
            Paste your Request for Evidence letter and get an analysis with response
            strategies, evidence recommendations, and draft language.
          </p>
        </div>

        {/* Input */}
        {!analysis && (
          <Card className="p-8 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  RFE Letter Text
                </label>
                <textarea
                  value={rfeText}
                  onChange={(e) => setRfeText(e.target.value)}
                  placeholder="Paste the full text of your USCIS Request for Evidence letter here..."
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg bg-surface/50 border border-white/10 text-primary placeholder-muted focus:outline-none focus:border-green-500/50 text-sm font-mono"
                />
                <p className="text-xs text-muted mt-1">
                  {rfeText.length} characters {rfeText.length < 50 && rfeText.length > 0 ? "(minimum 50)" : ""}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Form Number (optional)
                </label>
                <select
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface/50 border border-white/10 text-primary focus:outline-none focus:border-green-500/50 text-sm"
                >
                  <option value="">Select form...</option>
                  <option value="I-130">I-130 (Family Petition)</option>
                  <option value="I-140">I-140 (Employment Petition)</option>
                  <option value="I-485">I-485 (Adjustment of Status)</option>
                  <option value="I-765">I-765 (Work Authorization)</option>
                  <option value="I-751">I-751 (Remove Conditions)</option>
                  <option value="N-400">N-400 (Naturalization)</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                onClick={analyze}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing RFE...
                  </>
                ) : (
                  <>
                    <FileSearch size={18} />
                    Analyze RFE
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-1">Analysis Summary</h2>
                  <p className="text-sm text-secondary">{analysis.summary}</p>
                </div>
                <Badge
                  variant={
                    urgencyColors[analysis.urgency] as "green" | "blue" | "amber" | "gray"
                  }
                >
                  {analysis.urgency} urgency
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 rounded-lg bg-surface/30">
                  <p className="text-xs text-muted">Response Deadline</p>
                  <p className="text-lg font-bold text-amber-400">{analysis.deadlineDays} days</p>
                </div>
                <div className="p-3 rounded-lg bg-surface/30">
                  <p className="text-xs text-muted">Issues Found</p>
                  <p className="text-lg font-bold text-primary">{analysis.issues.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface/30">
                  <p className="text-xs text-muted">Prep Time</p>
                  <p className="text-lg font-bold text-primary">
                    {analysis.responseStrategy.estimatedPrepTime}
                  </p>
                </div>
              </div>
            </Card>

            {/* Warnings */}
            {analysis.warnings.length > 0 && (
              <Card className="p-6 border-amber-500/30 bg-amber-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-400 mb-2">Warnings</h3>
                    <ul className="space-y-1.5">
                      {analysis.warnings.map((w, i) => (
                        <li key={i} className="text-sm text-secondary">{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Issues */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Issues Identified ({analysis.issues.length})
              </h3>
              <div className="space-y-3">
                {analysis.issues.map((issue, idx) => {
                  const expanded = expandedIssues.has(idx);
                  const severityColor = {
                    minor: "text-blue-400",
                    moderate: "text-amber-400",
                    serious: "text-red-400",
                  }[issue.severity];

                  return (
                    <Card key={idx} className="overflow-hidden">
                      <button
                        onClick={() => toggleIssue(idx)}
                        className="w-full p-4 flex items-start justify-between hover:bg-surface/20 transition-colors"
                      >
                        <div className="flex items-start gap-3 text-left">
                          <span className={`text-sm font-medium ${severityColor} uppercase`}>
                            {issue.severity}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-primary">{issue.category}</p>
                            <p className="text-xs text-secondary mt-0.5">{issue.description}</p>
                          </div>
                        </div>
                        {expanded ? (
                          <ChevronDown size={16} className="text-secondary flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronRight size={16} className="text-secondary flex-shrink-0 mt-1" />
                        )}
                      </button>
                      {expanded && (
                        <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
                          <div>
                            <p className="text-xs font-medium text-secondary mb-2">
                              Suggested Evidence
                            </p>
                            <ul className="space-y-1">
                              {issue.suggestedEvidence.map((ev, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-primary">
                                  <CheckCircle2
                                    size={14}
                                    className="text-green-400 flex-shrink-0 mt-0.5"
                                  />
                                  {ev}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-secondary mb-2">
                              Draft Response Language
                            </p>
                            <div className="p-3 rounded-lg bg-surface/30 border border-white/5">
                              <p className="text-sm text-primary font-mono whitespace-pre-wrap">
                                {issue.sampleLanguage}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Response Strategy */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Response Strategy</h3>
              <p className="text-sm text-secondary mb-4">{analysis.responseStrategy.overview}</p>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-secondary mb-2">Preparation Steps</p>
                  <ol className="space-y-2">
                    {analysis.responseStrategy.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-primary">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center font-semibold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <p className="text-xs font-medium text-secondary mb-2">Documents Needed</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.responseStrategy.documentsNeeded.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/30 border border-white/10 text-xs text-primary"
                      >
                        <FileText size={12} className="text-blue-400" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setAnalysis(null);
                  setRfeText("");
                }}
                className="flex-1"
              >
                Analyze Another RFE
              </Button>
            </div>

            {/* Legal Disclaimer */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <Shield size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted">
                This analysis does not constitute legal advice. RFE responses
                are time-sensitive and can significantly impact your case. We strongly recommend
                consulting a licensed immigration attorney before submitting any response to USCIS.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
