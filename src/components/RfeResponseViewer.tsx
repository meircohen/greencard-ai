"use client";

import React, { useState } from "react";
import {
  Copy,
  Printer,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { RfeResponse } from "@/lib/rfe-response";

interface Props {
  data: RfeResponse;
  caseType?: string;
  clientName?: string;
}

export default function RfeResponseViewer({ data, caseType, clientName }: Props) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const severityConfig = {
    minor: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-700", icon: "text-green-600" },
    moderate: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-700", icon: "text-amber-600" },
    serious: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-700", icon: "text-red-600" },
  };

  const difficultyConfig = {
    easy: "bg-emerald-100 text-emerald-800",
    medium: "bg-amber-100 text-amber-800",
    hard: "bg-red-100 text-red-800",
  };

  const severityColors = severityConfig[data.severity];
  const severityIcons = {
    minor: <CheckCircle2 className={`w-5 h-5 ${severityColors.icon}`} />,
    moderate: <AlertCircle className={`w-5 h-5 ${severityColors.icon}`} />,
    serious: <AlertTriangle className={`w-5 h-5 ${severityColors.icon}`} />,
  };

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(data.draftResponseLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Summary Alert */}
      <div
        className={`p-6 rounded-lg border ${severityColors.bg} ${severityColors.border} print:border print:border-gray-400`}
      >
        <div className="flex gap-4">
          {severityIcons[data.severity]}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">What USCIS Is Requesting</h3>
            <p className={`${severityColors.text} leading-relaxed`}>{data.summary}</p>
          </div>
        </div>
      </div>

      {/* Severity and Deadline */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold">Case Severity</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Risk level and complexity</p>
          <Badge
            variant={
              data.severity === "minor" ? "green" : data.severity === "moderate" ? "amber" : "red"
            }
            className="text-base font-semibold px-4 py-2"
          >
            {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}
          </Badge>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Response Deadline</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">87 days to respond</p>
          <p className="font-mono text-lg font-semibold text-blue-700">{data.deadline}</p>
        </Card>
      </div>

      {/* Requested Items */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Requested Items ({data.requestedItems.length})</h3>
          <p className="text-sm text-gray-600 mt-1">Documents and evidence USCIS wants</p>
        </div>

        <div className="divide-y divide-gray-200">
          {data.requestedItems.map((item, idx) => {
            const itemId = `item-${idx}`;
            const expanded = expandedItems.has(itemId);

            return (
              <div key={itemId} className="p-6 hover:bg-gray-50/30 transition-colors">
                <button
                  onClick={() => toggleItem(itemId)}
                  className="w-full flex items-start justify-between text-left"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">{item.item}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge
                        variant={
                          item.difficulty === "easy" ? "green" : item.difficulty === "medium" ? "amber" : "red"
                        }
                        className="text-xs"
                      >
                        {item.difficulty === "easy"
                          ? "Easy to Obtain"
                          : item.difficulty === "medium"
                            ? "Moderate Effort"
                            : "Difficult/Complex"}
                      </Badge>
                    </div>
                  </div>
                  {expanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </button>

                {expanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-semibold text-sm mb-3">Suggested Evidence:</h5>
                    <ul className="space-y-2">
                      {item.suggestedEvidence.map((evidence, eidx) => (
                        <li key={eidx} className="flex gap-2 text-sm">
                          <span className="text-green-600 font-bold">+</span>
                          <span className="text-gray-700">{evidence}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Document Checklist */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Document Checklist</h3>
          <p className="text-sm text-gray-600 mt-1">What to include in your RFE response package</p>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            {data.documentChecklist.map((doc, idx) => (
              <div key={idx} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Tips for Success</h3>
          <p className="text-sm text-gray-600 mt-1">Attorney guidance for this RFE response</p>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {data.tips.map((tip, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Draft Response Letter */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Draft Response Letter</h3>
            <p className="text-sm text-gray-600 mt-1">Professional cover letter for your RFE response</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={copyLetter}
              className="print:hidden"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="bg-white p-6 rounded border border-gray-200 font-serif text-sm leading-relaxed text-gray-800 whitespace-pre-wrap break-words">
            {data.draftResponseLetter}
          </div>
        </div>
      </Card>

      {/* Legal Disclaimer */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Important Legal Disclaimer
        </h4>
        <p className="text-sm text-blue-800">
          This RFE response is for informational purposes only and does not constitute legal advice. We
          strongly recommend consulting with a qualified immigration attorney before submitting your RFE
          response. Immigration law is complex and fact-specific. An attorney can review your case, verify
          the documents, and ensure your response addresses all USCIS concerns. GreenCard.ai is not a law
          firm and cannot provide legal representation.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 print:hidden">
        <Button variant="primary" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print Response
        </Button>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
