"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  DollarSign,
  Heart,
  Scale,
  Fingerprint,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { DocumentChecklist as ChecklistType, ChecklistItem } from "@/lib/forms/document-checklist";

const categoryIcons: Record<string, React.ReactNode> = {
  identity: <Fingerprint size={14} />,
  financial: <DollarSign size={14} />,
  legal: <Scale size={14} />,
  medical: <Heart size={14} />,
  evidence: <FileText size={14} />,
  forms: <FileText size={14} />,
};

const categoryLabels: Record<string, string> = {
  identity: "Identity Documents",
  financial: "Financial Documents",
  legal: "Legal Records",
  medical: "Medical Records",
  evidence: "Supporting Evidence",
  forms: "USCIS Forms",
};

interface Props {
  checklist: ChecklistType;
  completedIds?: string[];
  onToggle?: (id: string, completed: boolean) => void;
  readOnly?: boolean;
}

export default function DocumentChecklistView({
  checklist,
  completedIds = [],
  onToggle,
  readOnly = false,
}: Props) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["forms", "identity"])
  );
  const [showTips, setShowTips] = useState<Set<string>>(new Set());

  const completedSet = new Set(completedIds);

  // Group items by category
  const grouped = checklist.items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const totalRequired = checklist.items.filter((i) => i.required).length;
  const completedRequired = checklist.items.filter(
    (i) => i.required && completedSet.has(i.id)
  ).length;
  const progress = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleTip = (id: string) => {
    setShowTips((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary mb-2">{checklist.title}</h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 bg-surface/30 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted whitespace-nowrap">
            {completedRequired}/{totalRequired} required
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, items]) => {
          const expanded = expandedCategories.has(category);
          const catCompleted = items.filter((i) => completedSet.has(i.id)).length;

          return (
            <Card key={category} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-400">{categoryIcons[category]}</span>
                  <span className="font-medium text-primary text-sm">
                    {categoryLabels[category] || category}
                  </span>
                  <Badge variant={catCompleted === items.length ? "green" : "gray"} className="text-[10px]">
                    {catCompleted}/{items.length}
                  </Badge>
                </div>
                {expanded ? (
                  <ChevronDown size={16} className="text-secondary" />
                ) : (
                  <ChevronRight size={16} className="text-secondary" />
                )}
              </button>

              {expanded && (
                <div className="border-t border-white/5 divide-y divide-white/5">
                  {items.map((item) => {
                    const completed = completedSet.has(item.id);
                    const tipVisible = showTips.has(item.id);

                    return (
                      <div key={item.id} className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => !readOnly && onToggle?.(item.id, !completed)}
                            disabled={readOnly}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {completed ? (
                              <CheckCircle2 size={18} className="text-green-400" />
                            ) : (
                              <Circle size={18} className="text-white/20 hover:text-white/40 transition-colors" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-sm font-medium ${
                                  completed ? "text-muted line-through" : "text-primary"
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.required && (
                                <Badge variant="amber" className="text-[9px]">Required</Badge>
                              )}
                              {item.rfeRisk === "high" && !completed && (
                                <AlertTriangle size={12} className="text-amber-400" />
                              )}
                            </div>
                            <p className="text-xs text-muted mt-0.5">{item.description}</p>

                            {item.tips && (
                              <>
                                <button
                                  onClick={() => toggleTip(item.id)}
                                  className="text-[10px] text-blue-400 hover:text-blue-300 mt-1 flex items-center gap-1"
                                >
                                  <Info size={10} />
                                  {tipVisible ? "Hide tip" : "Show tip"}
                                </button>
                                {tipVisible && (
                                  <div className="mt-1.5 p-2 rounded bg-blue-500/5 border border-blue-500/20">
                                    <p className="text-xs text-blue-300">{item.tips}</p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Legal note */}
      <div className="flex items-start gap-2 mt-6 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
        <Shield size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted">
          This checklist is for guidance only. Requirements vary by case. Consult an immigration attorney
          to confirm which documents apply to your specific situation.
        </p>
      </div>
    </div>
  );
}
