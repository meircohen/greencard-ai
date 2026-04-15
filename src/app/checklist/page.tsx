"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  getAllChecklists,
  type DocumentChecklist,
  type ChecklistItem,
} from "@/lib/forms/document-checklist";
import { Printer, Check, AlertCircle, CheckCircle2 } from "lucide-react";

const categoryLabels: Record<string, string> = {
  identity: "Identity Documents",
  financial: "Financial Documents",
  legal: "Legal Documents",
  medical: "Medical Documents",
  evidence: "Evidence & Supporting",
  forms: "Forms & Applications",
};

const categoryColors: Record<
  string,
  { bg: string; text: string; badge: "green" | "blue" | "amber" | "red" }
> = {
  identity: {
    bg: "bg-blue-50",
    text: "text-blue-900",
    badge: "blue",
  },
  financial: {
    bg: "bg-green-50",
    text: "text-green-900",
    badge: "green",
  },
  legal: {
    bg: "bg-amber-50",
    text: "text-amber-900",
    badge: "amber",
  },
  medical: {
    bg: "bg-red-50",
    text: "text-red-900",
    badge: "red",
  },
  evidence: {
    bg: "bg-purple-50",
    text: "text-purple-900",
    badge: "blue",
  },
  forms: {
    bg: "bg-slate-50",
    text: "text-slate-900",
    badge: "green",
  },
};

const rfeRiskLabels: Record<string, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk - Critical",
};

const rfeRiskColors: Record<string, "green" | "amber" | "red"> = {
  low: "green",
  medium: "amber",
  high: "red",
};

interface ChecklistItemState {
  itemId: string;
  formNumber: string;
  checked: boolean;
}

export default function ChecklistPage() {
  const [checklists] = useState<DocumentChecklist[]>(getAllChecklists());
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<ChecklistItemState[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("checklist-items");
    if (stored) {
      try {
        setCheckedItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load checklist from localStorage:", e);
      }
    }
  }, []);

  // Save to localStorage whenever checkedItems changes
  useEffect(() => {
    localStorage.setItem("checklist-items", JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (itemId: string, formNumber: string) => {
    setCheckedItems((prev) => {
      const existing = prev.find(
        (item) => item.itemId === itemId && item.formNumber === formNumber
      );
      if (existing) {
        return prev.filter(
          (item) =>
            !(item.itemId === itemId && item.formNumber === formNumber)
        );
      } else {
        return [
          ...prev,
          { itemId, formNumber, checked: true },
        ];
      }
    });
  };

  const isItemChecked = (itemId: string, formNumber: string): boolean => {
    return !!checkedItems.find(
      (item) => item.itemId === itemId && item.formNumber === formNumber
    );
  };

  const getFormStats = (form: DocumentChecklist) => {
    const totalItems = form.items.length;
    const requiredItems = form.items.filter((item) => item.required).length;
    const checkedCount = form.items.filter((item) =>
      isItemChecked(item.id, form.formNumber)
    ).length;
    return { totalItems, requiredItems, checkedCount };
  };

  const handlePrint = () => {
    window.print();
  };

  const currentForm =
    selectedForm && checklists.find((c) => c.formNumber === selectedForm);

  const groupByCategory = (
    items: ChecklistItem[]
  ): Record<string, ChecklistItem[]> => {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, ChecklistItem[]>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 print:pt-0 print:pb-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
                Document Checklist
              </h1>
              <p className="text-xl text-slate-600">
                Stay organized with a complete checklist of required documents
                for each visa form
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handlePrint}
            className="print:hidden"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Checklist
          </Button>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 py-20 print:py-0 print:px-0">
        <div className="max-w-5xl mx-auto">
          {!selectedForm ? (
            <>
              {/* Form Selection Grid */}
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Select a Form
                </h2>
                <p className="text-slate-600">
                  Choose a visa form to view its document requirements
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {checklists.map((checklist) => {
                  const stats = getFormStats(checklist);
                  return (
                    <Card
                      key={checklist.formNumber}
                      className="p-6 cursor-pointer hover:shadow-lg transition-shadow group"
                      onClick={() => setSelectedForm(checklist.formNumber)}
                    >
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-emerald-600 mb-2">
                          {checklist.formNumber}
                        </h3>
                        <p className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {checklist.title}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {checklist.visaType}
                        </p>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Documents:</span>
                          <span className="font-semibold text-slate-900">
                            {stats.totalItems}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Required:</span>
                          <span className="font-semibold text-slate-900">
                            {stats.requiredItems}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Completed:</span>
                          <span className="font-semibold text-emerald-600">
                            {stats.checkedCount}/{stats.totalItems}
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (stats.checkedCount / stats.totalItems) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Back Button and Title */}
              <div className="mb-8">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedForm(null)}
                  className="print:hidden"
                >
                  ← Back to Forms
                </Button>
                {currentForm && (
                  <div className="mt-6">
                    <h2 className="text-4xl font-bold text-slate-900 mb-2 print:text-2xl">
                      {currentForm.formNumber} Document Checklist
                    </h2>
                    <p className="text-lg text-slate-600 print:text-base">
                      {currentForm.title}
                    </p>
                    <p className="text-sm text-slate-500 print:text-xs">
                      {currentForm.visaType}
                    </p>
                  </div>
                )}
              </div>

              {currentForm && (
                <>
                  {/* Summary Stats */}
                  <div className="grid md:grid-cols-3 gap-4 mb-8 print:grid-cols-3 print:gap-2 print:mb-4">
                    {(() => {
                      const requiredItems = currentForm.items.filter(
                        (i) => i.required
                      );
                      const recommendedItems = currentForm.items.filter(
                        (i) => !i.required
                      );
                      const checkedRequired = requiredItems.filter((i) =>
                        isItemChecked(i.id, currentForm.formNumber)
                      );
                      return (
                        <>
                          <Card className="p-4 print:p-2">
                            <p className="text-xs text-slate-600 print:text-xs">
                              Required Items
                            </p>
                            <p className="text-2xl font-bold text-slate-900 print:text-lg">
                              {checkedRequired.length}/{requiredItems.length}
                            </p>
                          </Card>
                          <Card className="p-4 print:p-2">
                            <p className="text-xs text-slate-600 print:text-xs">
                              Recommended Items
                            </p>
                            <p className="text-2xl font-bold text-slate-900 print:text-lg">
                              {currentForm.items
                                .filter((i) => !i.required)
                                .filter((i) =>
                                  isItemChecked(i.id, currentForm.formNumber)
                                ).length}
                              /{recommendedItems.length}
                            </p>
                          </Card>
                          <Card className="p-4 print:p-2">
                            <p className="text-xs text-slate-600 print:text-xs">
                              Total Progress
                            </p>
                            <p className="text-2xl font-bold text-emerald-600 print:text-lg">
                              {Math.round(
                                (currentForm.items.filter((i) =>
                                  isItemChecked(i.id, currentForm.formNumber)
                                ).length /
                                  currentForm.items.length) *
                                  100
                              )}
                              %
                            </p>
                          </Card>
                        </>
                      );
                    })()}
                  </div>

                  {/* Document Checklist by Category */}
                  <div className="space-y-8 print:space-y-4">
                    {Object.entries(
                      groupByCategory(currentForm.items)
                    ).map(([category, items]) => {
                      const colors = categoryColors[category];
                      return (
                        <section key={category} className="print:break-inside-avoid">
                          <div className={`${colors.bg} -mx-4 px-4 py-4 mb-6 print:py-2 print:mb-3`}>
                            <h3 className={`text-xl font-bold ${colors.text} print:text-base`}>
                              {categoryLabels[category]}
                            </h3>
                          </div>

                          <div className="space-y-4 print:space-y-2">
                            {items.map((item) => {
                              const checked = isItemChecked(
                                item.id,
                                currentForm.formNumber
                              );
                              return (
                                <div
                                  key={item.id}
                                  className="print:break-inside-avoid"
                                >
                                  <Card className={`p-4 print:p-2 transition-all ${
                                    checked ? "bg-emerald-50 border-emerald-200" : ""
                                  } print:border-0 print:shadow-none`}>
                                    <div className="space-y-3 print:space-y-1">
                                      <div className="flex items-start gap-3 print:gap-2">
                                        <button
                                          onClick={() =>
                                            toggleItem(
                                              item.id,
                                              currentForm.formNumber
                                            )
                                          }
                                          className="print:hidden flex-shrink-0 mt-1"
                                        >
                                          <div
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                              checked
                                                ? "bg-emerald-600 border-emerald-600"
                                                : "border-gray-300 hover:border-emerald-600"
                                            }`}
                                          >
                                            {checked && (
                                              <Check className="w-3 h-3 text-white" />
                                            )}
                                          </div>
                                        </button>

                                        {/* Print checkbox */}
                                        <div className="hidden print:block flex-shrink-0 mt-0.5 w-4 h-4 border border-gray-400 rounded">
                                          {checked && (
                                            <Check className="w-4 h-4 text-gray-800" />
                                          )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start gap-2 flex-wrap">
                                            <h4 className={`font-semibold text-base print:text-sm ${
                                              checked
                                                ? "line-through text-slate-500"
                                                : "text-slate-900"
                                            }`}>
                                              {item.label}
                                            </h4>
                                            {item.required ? (
                                              <Badge
                                                variant="red"
                                                size="sm"
                                                className="print:text-xs print:px-1 print:py-0.5"
                                              >
                                                Required
                                              </Badge>
                                            ) : (
                                              <Badge
                                                variant="gray"
                                                size="sm"
                                                className="print:text-xs print:px-1 print:py-0.5"
                                              >
                                                Recommended
                                              </Badge>
                                            )}
                                            <Badge
                                              variant={
                                                rfeRiskColors[item.rfeRisk]
                                              }
                                              size="sm"
                                              className="print:text-xs print:px-1 print:py-0.5"
                                            >
                                              {rfeRiskLabels[item.rfeRisk]}
                                            </Badge>
                                          </div>

                                          <p className="text-sm text-slate-600 mt-2 print:text-xs print:mt-1">
                                            {item.description}
                                          </p>

                                          {item.tips && (
                                            <div className="mt-3 print:mt-1 p-3 print:p-1.5 bg-blue-50 print:bg-white print:border print:border-blue-200 rounded border border-blue-200">
                                              <div className="flex gap-2">
                                                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5 print:w-3 print:h-3" />
                                                <p className="text-xs print:text-xs text-blue-900">
                                                  <span className="font-semibold">
                                                    Tip:{" "}
                                                  </span>
                                                  {item.tips}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      );
                    })}
                  </div>

                  {/* Footer Note */}
                  <div className="mt-12 print:mt-6 p-6 print:p-3 bg-slate-50 print:bg-white print:border print:border-gray-300 rounded-lg">
                    <p className="text-sm print:text-xs text-slate-700">
                      <span className="font-semibold">Important:</span> This
                      checklist is a general guide. Requirements may vary based
                      on your specific case, country of origin, and visa
                      category. Always consult with an immigration attorney or
                      review the official USCIS website for the most current
                      requirements. Document requirements are subject to change.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:block {
            display: block !important;
          }

          .print\\:grid {
            display: grid !important;
          }

          .print\\:pt-0 {
            padding-top: 0 !important;
          }

          .print\\:pb-4 {
            padding-bottom: 1rem !important;
          }

          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }

          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .print\\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }

          .print\\:px-2 {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }

          .print\\:gap-2 {
            gap: 0.5rem !important;
          }

          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }

          .print\\:mb-3 {
            margin-bottom: 0.75rem !important;
          }

          .print\\:mt-6 {
            margin-top: 1.5rem !important;
          }

          .print\\:mt-1 {
            margin-top: 0.25rem !important;
          }

          .print\\:text-2xl {
            font-size: 1.5rem !important;
          }

          .print\\:text-base {
            font-size: 1rem !important;
          }

          .print\\:text-xs {
            font-size: 0.75rem !important;
          }

          .print\\:text-lg {
            font-size: 1.125rem !important;
          }

          .print\\:text-sm {
            font-size: 0.875rem !important;
          }

          .print\\:space-y-4 > * + * {
            margin-top: 1rem !important;
          }

          .print\\:space-y-2 > * + * {
            margin-top: 0.5rem !important;
          }

          .print\\:space-y-1 > * + * {
            margin-top: 0.25rem !important;
          }

          .print\\:gap-1 {
            gap: 0.25rem !important;
          }

          .print\\:break-inside-avoid {
            break-inside: avoid;
          }

          .print\\:border-0 {
            border: none !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }

          .print\\:bg-white {
            background-color: white !important;
          }

          .print\\:border {
            border: 1px solid currentColor !important;
          }

          .print\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }

          .print\\:p-2 {
            padding: 0.5rem !important;
          }

          .print\\:p-1 {
            padding: 0.25rem !important;
          }

          .print\\:p-1\\.5 {
            padding: 0.375rem !important;
          }

          .print\\:gap-2 {
            gap: 0.5rem !important;
          }

          .print\\:w-3 {
            width: 0.75rem !important;
          }

          .print\\:h-3 {
            height: 0.75rem !important;
          }

          .print\\:w-4 {
            width: 1rem !important;
          }

          .print\\:h-4 {
            height: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
