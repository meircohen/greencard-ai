"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  BarChart3,
  Zap,
  ChevronDown,
  Plus,
  Lightbulb,
  FileCheck,
  Download,
  Save,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface FormField {
  id: string;
  label: string;
  value: string;
  confidence: "high" | "medium" | "low";
  aiSuggestion?: string;
}

interface FormSection {
  id: string;
  title: string;
  expanded: boolean;
  fields: FormField[];
}

interface USCISForm {
  id: string;
  number: string;
  name: string;
  completion: number;
  status: "not started" | "in progress" | "completed" | "filed";
  filingFee: number;
  processingTime: string;
  sections: FormSection[];
}

const mockForms: USCISForm[] = [
  {
    id: "i130-spouse",
    number: "I-130",
    name: "Petition for Alien Relative",
    completion: 65,
    status: "in progress",
    filingFee: 385,
    processingTime: "8.5 - 14 months",
    sections: [
      {
        id: "sec1",
        title: "Petitioner Information",
        expanded: true,
        fields: [
          {
            id: "f1",
            label: "Full Name (Last, First, Middle)",
            value: "Johnson, Michael Robert",
            confidence: "high",
            aiSuggestion: "Name verified from supporting documents",
          },
          {
            id: "f2",
            label: "Date of Birth",
            value: "03/15/1985",
            confidence: "high",
          },
          {
            id: "f3",
            label: "USCIS Number (if any)",
            value: "A-098765432",
            confidence: "high",
          },
          {
            id: "f4",
            label: "Country of Birth",
            value: "United States",
            confidence: "high",
          },
          {
            id: "f5",
            label: "Current Address",
            value: "123 Main Street, New York, NY 10001",
            confidence: "medium",
            aiSuggestion: "Consider verifying address matches recent lease",
          },
        ],
      },
      {
        id: "sec2",
        title: "Beneficiary Information",
        expanded: false,
        fields: [
          {
            id: "f6",
            label: "Full Name (Last, First, Middle)",
            value: "Johnson, Sarah Elizabeth",
            confidence: "high",
          },
          {
            id: "f7",
            label: "Date of Birth",
            value: "07/22/1987",
            confidence: "high",
          },
          {
            id: "f8",
            label: "Country of Birth",
            value: "United Kingdom",
            confidence: "high",
          },
          {
            id: "f9",
            label: "Current Immigration Status",
            value: "F-1 Student Visa",
            confidence: "high",
          },
          {
            id: "f10",
            label: "USCIS Number (if any)",
            value: "",
            confidence: "low",
            aiSuggestion: "Leave blank if not assigned yet",
          },
        ],
      },
      {
        id: "sec3",
        title: "Marriage Information",
        expanded: false,
        fields: [
          {
            id: "f11",
            label: "Marriage Date",
            value: "06/10/2022",
            confidence: "high",
          },
          {
            id: "f12",
            label: "Place of Marriage",
            value: "Las Vegas, Nevada, United States",
            confidence: "high",
          },
          {
            id: "f13",
            label: "Marriage Certificate Number",
            value: "MR-2022-456789",
            confidence: "medium",
            aiSuggestion: "Ensure this matches the official document",
          },
          {
            id: "f14",
            label: "Previous Marriages",
            value: "None",
            confidence: "high",
          },
          {
            id: "f15",
            label: "How did you meet your spouse?",
            value: "Through mutual friends at a professional conference",
            confidence: "medium",
          },
        ],
      },
      {
        id: "sec4",
        title: "Additional Information",
        expanded: false,
        fields: [
          {
            id: "f16",
            label: "Annual Income",
            value: "$125,000",
            confidence: "high",
            aiSuggestion: "Above minimum threshold - strong indicator",
          },
          {
            id: "f17",
            label: "Employment",
            value: "Software Engineer at TechCorp Inc.",
            confidence: "high",
          },
          {
            id: "f18",
            label: "Number of Dependents",
            value: "0",
            confidence: "high",
          },
          {
            id: "f19",
            label: "Criminal History",
            value: "No",
            confidence: "high",
          },
          {
            id: "f20",
            label: "Immigration Violations",
            value: "No",
            confidence: "high",
          },
        ],
      },
    ],
  },
  {
    id: "i485-spouse",
    number: "I-485",
    name: "Application to Register Permanent Residence",
    completion: 15,
    status: "not started",
    filingFee: 640,
    processingTime: "12 - 18 months",
    sections: [],
  },
  {
    id: "i131-spouse",
    number: "I-131",
    name: "Application for Travel Document",
    completion: 0,
    status: "not started",
    filingFee: 575,
    processingTime: "4 - 6 months",
    sections: [],
  },
];

const statusConfig = {
  "not started": { color: "bg-slate-500", label: "Not Started" },
  "in progress": { color: "bg-amber-500", label: "In Progress" },
  completed: { color: "bg-green-500", label: "Completed" },
  filed: { color: "bg-blue-500", label: "Filed" },
};

const confidenceConfig = {
  high: { color: "text-green-400", bg: "bg-green-400/10", label: "High" },
  medium: { color: "text-amber-400", bg: "bg-amber-400/10", label: "Medium" },
  low: { color: "text-red-400", bg: "bg-red-400/10", label: "Low" },
};

export default function DocumentsPage() {
  const [selectedFormId, setSelectedFormId] = useState("i130-spouse");
  const [sections, setSections] = useState<FormSection[]>(
    mockForms[0].sections
  );
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; size: string; date: string }[]
  >([]);

  const selectedForm = mockForms.find((f) => f.id === selectedFormId);

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, expanded: !s.expanded } : s
      )
    );
  };

  const updateField = (sectionId: string, fieldId: string, value: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map((f) =>
                f.id === fieldId ? { ...f, value } : f
              ),
            }
          : s
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            date: new Date().toLocaleDateString(),
          },
        ]);
      });
    }
  };

  const aiSuggestions = [
    {
      type: "info",
      message:
        "All petitioner income requirements met. Case has strong financial indicators.",
    },
    {
      type: "warning",
      message:
        "Consider submitting birth certificate original for faster processing.",
    },
    {
      type: "tip",
      message:
        "Recent marriage (less than 2 years) may trigger fraud prevention interview.",
    },
  ];

  const steps = [
    { step: "Draft", active: true, completed: true },
    { step: "Review", active: false, completed: false },
    { step: "Human Review", active: false, completed: false },
    { step: "Filed", active: false, completed: false },
    { step: "Received", active: false, completed: false },
  ];

  return (
    <div className="min-h-screen bg-midnight pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Document Management
          </h1>
          <p className="text-secondary">
            Manage your USCIS forms with professional assistance
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Form List */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-28">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Your Forms
              </h2>
              <div className="space-y-3">
                {mockForms.map((form) => (
                  <div
                    key={form.id}
                    onClick={() => {
                      setSelectedFormId(form.id);
                      setSections(form.sections);
                    }}
                    className={`p-4 rounded-lg cursor-pointer transition-all border ${
                      selectedFormId === form.id
                        ? "bg-green-500/20 border-green-500/50 ring-1 ring-green-500/50"
                        : "bg-surface/30 border-white/10 hover:bg-surface/50 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {form.number}
                        </p>
                        <p className="text-xs text-secondary line-clamp-2">
                          {form.name}
                        </p>
                      </div>
                      <Badge
                        variant={
                          form.status === "filed"
                            ? "blue"
                            : form.status === "completed"
                              ? "green"
                              : form.status === "in progress"
                                ? "amber"
                                : "gray"
                        }
                        className="text-xs"
                      >
                        {
                          statusConfig[
                            form.status as keyof typeof statusConfig
                          ].label
                        }
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-surface/50 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400"
                        style={{ width: `${form.completion}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted mt-2">
                      {form.completion}% complete
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
                <Zap size={18} />
                Auto-Fill with AI
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <FileCheck size={18} />
                Validate
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <Download size={18} />
                Generate PDF
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <Save size={18} />
                Save Draft
              </Button>
            </div>

            {/* Form Header */}
            {selectedForm && (
              <Card className="p-8 border-l-4 border-l-green-500">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-secondary mb-1">Form Number</p>
                    <p className="text-2xl font-bold text-primary">
                      {selectedForm.number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-primary">
                      {selectedForm.sections[0]?.fields[0]?.value || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Filing Fee</p>
                    <p className="text-lg font-semibold text-primary">
                      ${selectedForm.filingFee}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">
                      Processing Time
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      {selectedForm.processingTime}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Form Sections */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Form Fields</h3>
              {sections.map((section) => (
                <Card key={section.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-surface/50 transition-colors"
                  >
                    <h4 className="font-semibold text-primary text-left">
                      {section.title}
                    </h4>
                    <ChevronDown
                      size={20}
                      className={`text-secondary transition-transform ${
                        section.expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {section.expanded && (
                    <div className="border-t border-white/10 p-6 space-y-6">
                      {section.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-primary flex items-center gap-2">
                              {field.label}
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${
                                  confidenceConfig[field.confidence].color
                                } bg-opacity-100`}
                                title={`Confidence: ${confidenceConfig[field.confidence].label}`}
                              />
                            </label>
                            {field.aiSuggestion && (
                              <div className="group relative">
                                <Lightbulb
                                  size={16}
                                  className="text-amber-400 cursor-help"
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-surface-2 rounded-lg text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto border border-white/10">
                                  {field.aiSuggestion}
                                </div>
                              </div>
                            )}
                          </div>
                          <Input
                            value={field.value}
                            onChange={(e) =>
                              updateField(section.id, field.id, e.target.value)
                            }
                            className="w-full"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Suggestions Panel */}
            <Card className="p-6 bg-green-500/5 border-green-500/30">
              <div className="flex items-start gap-4 mb-4">
                <Lightbulb
                  size={24}
                  className="text-green-400 flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-primary mb-4">
                    Smart Suggestions
                  </h3>
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-surface/30 rounded-lg border border-white/5"
                      >
                        {suggestion.type === "warning" && (
                          <AlertCircle
                            size={18}
                            className="text-amber-400 flex-shrink-0 mt-0.5"
                          />
                        )}
                        {suggestion.type === "info" && (
                          <CheckCircle2
                            size={18}
                            className="text-green-400 flex-shrink-0 mt-0.5"
                          />
                        )}
                        {suggestion.type === "tip" && (
                          <Lightbulb
                            size={18}
                            className="text-blue-400 flex-shrink-0 mt-0.5"
                          />
                        )}
                        <p className="text-sm text-secondary">
                          {suggestion.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Document Upload */}
            <Card className="p-8">
              <h3 className="font-semibold text-primary mb-4">
                Supporting Documents
              </h3>

              {/* Drag & Drop Zone */}
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center mb-6 hover:border-white/30 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-secondary mb-2" />
                <p className="text-primary font-medium mb-1">
                  Drag documents here or click to browse
                </p>
                <p className="text-sm text-secondary mb-4">
                  PDF, JPG, PNG, DOCX (Max 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors cursor-pointer">
                  Select Files
                </label>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-secondary font-medium">
                    Uploaded Files
                  </p>
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-surface/30 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <FileText
                          size={18}
                          className="text-blue-400 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm text-primary font-medium">
                            {file.name}
                          </p>
                          <p className="text-xs text-secondary">
                            {file.size} • {file.date}
                          </p>
                        </div>
                      </div>
                      <CheckCircle2 size={18} className="text-green-400" />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Status Tracking */}
            <Card className="p-6">
              <h3 className="font-semibold text-primary mb-6">Status</h3>
              <div className="flex items-center justify-between">
                {steps.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        item.completed
                          ? "bg-green-500/30 border border-green-500 text-green-400"
                          : item.active
                            ? "bg-green-500/50 border border-green-500 text-white"
                            : "bg-surface/50 border border-white/10 text-secondary"
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium ml-2 ${
                        item.active || item.completed
                          ? "text-primary"
                          : "text-secondary"
                      }`}
                    >
                      {item.step}
                    </p>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-2 ${
                          item.completed
                            ? "bg-green-500/50"
                            : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
