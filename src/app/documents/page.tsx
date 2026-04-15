"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  high: { color: "text-emerald-600", bg: "bg-green-400/10", label: "High" },
  medium: { color: "text-amber-600", bg: "bg-amber-400/10", label: "Medium" },
  low: { color: "text-red-600", bg: "bg-red-400/10", label: "Low" },
};

export default function DocumentsPage() {
  const [selectedFormId, setSelectedFormId] = useState("i130-spouse");
  const [sections, setSections] = useState<FormSection[]>(
    mockForms[0].sections
  );
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; size: string; date: string }[]
  >([]);
  const [dragActive, setDragActive] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(async (file) => {
        // Local file tracking
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            date: new Date().toLocaleDateString(),
          },
        ]);

        // Upload to backend
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("caseId", "default");
          formData.append("documentType", "supporting");

          const res = await fetch("/api/documents/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          if (!res.ok) {
            const data = await res.json();
            console.error("Upload failed:", data.error);
          }
        } catch (err) {
          console.error("Upload error:", err);
        }
      });
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Simulate file input change event
      const fileList = files;
      Array.from(fileList).forEach(async (file) => {
        // Local file tracking
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            date: new Date().toLocaleDateString(),
          },
        ]);

        // Upload to backend
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("caseId", "default");
          formData.append("documentType", "supporting");

          const res = await fetch("/api/documents/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          if (!res.ok) {
            const data = await res.json();
            console.error("Upload failed:", data.error);
          }
        } catch (err) {
          console.error("Upload error:", err);
        }
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
    <div className="min-h-screen flex flex-col bg-white bg-white">
      <Navbar />
      <main className="flex-1 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Document Management
          </h1>
          <p className="text-slate-600">
            Manage your USCIS forms with professional assistance
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Sidebar - Form List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="p-4 sm:p-6 sticky top-20 sm:top-28">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                Your Forms
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {mockForms.map((form) => (
                  <div
                    key={form.id}
                    onClick={() => {
                      setSelectedFormId(form.id);
                      setSections(form.sections);
                    }}
                    className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all border text-sm sm:text-base ${
                      selectedFormId === form.id
                        ? "bg-emerald-50 border-green-500/50 ring-1 ring-green-500/50"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-50 hover:border-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {form.number}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">
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
                    <div className="w-full bg-slate-50 rounded-full h-1.5 overflow-hidden">
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
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Top Toolbar */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-xs sm:text-sm whitespace-nowrap">
                <Zap size={16} className="sm:w-4 sm:h-4" />
                Auto-Fill with AI
              </Button>
              <Button variant="secondary" className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                <FileCheck size={16} className="sm:w-4 sm:h-4" />
                Validate
              </Button>
              <Button variant="secondary" className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                <Download size={16} className="sm:w-4 sm:h-4" />
                Generate PDF
              </Button>
              <Button variant="secondary" className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                <Save size={16} className="sm:w-4 sm:h-4" />
                Save Draft
              </Button>
            </div>

            {/* Form Header */}
            {selectedForm && (
              <Card className="p-4 sm:p-8 border-l-4 border-l-green-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Form Number</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {selectedForm.number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedForm.sections[0]?.fields[0]?.value || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Filing Fee</p>
                    <p className="text-lg font-semibold text-slate-900">
                      ${selectedForm.filingFee}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">
                      Processing Time
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedForm.processingTime}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Form Sections */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Form Fields</h3>
              {sections.map((section) => (
                <Card key={section.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <h4 className="font-semibold text-slate-900 text-left text-sm sm:text-base truncate">
                      {section.title}
                    </h4>
                    <ChevronDown
                      size={20}
                      className={`text-slate-600 transition-transform ${
                        section.expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {section.expanded && (
                    <div className="border-t border-slate-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
                      {section.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
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
                                  className="text-amber-600 cursor-help"
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-slate-50 rounded-lg text-xs text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto border border-slate-200">
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
            <Card className="p-4 sm:p-6 bg-green-500/5 border-green-500/30">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <Lightbulb
                  size={24}
                  className="text-emerald-600 flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Smart Suggestions
                  </h3>
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        {suggestion.type === "warning" && (
                          <AlertCircle
                            size={18}
                            className="text-amber-600 flex-shrink-0 mt-0.5"
                          />
                        )}
                        {suggestion.type === "info" && (
                          <CheckCircle2
                            size={18}
                            className="text-emerald-600 flex-shrink-0 mt-0.5"
                          />
                        )}
                        {suggestion.type === "tip" && (
                          <Lightbulb
                            size={18}
                            className="text-blue-600 flex-shrink-0 mt-0.5"
                          />
                        )}
                        <p className="text-sm text-slate-600">
                          {suggestion.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Document Upload */}
            <Card className="p-4 sm:p-8">
              <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-base sm:text-lg">
                Supporting Documents
              </h3>

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center mb-4 sm:mb-6 transition-colors cursor-pointer ${
                  dragActive
                    ? "border-green-500/60 bg-green-500/5"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <Upload size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-slate-900 font-medium mb-1">
                  Drag documents here or click to browse
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  PDF, JPG, PNG, DOCX (Max 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 font-medium rounded-lg transition-colors cursor-pointer">
                  Select Files
                </label>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm text-slate-600 font-medium">
                    Uploaded Files
                  </p>
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText
                          size={18}
                          className="text-blue-600 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm text-slate-900 font-medium">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-600">
                            {file.size} • {file.date}
                          </p>
                        </div>
                      </div>
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Status Tracking */}
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold text-slate-900 mb-4 sm:mb-6 text-base sm:text-lg">Status</h3>
              <div className="flex items-center justify-between overflow-x-auto gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {steps.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        item.completed
                          ? "bg-green-500/30 border border-green-500 text-emerald-600"
                          : item.active
                            ? "bg-green-500/50 border border-green-500 text-white"
                            : "bg-slate-50 border border-slate-200 text-slate-600"
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
                          ? "text-slate-900"
                          : "text-slate-600"
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
      </main>
      <Footer />
    </div>
  );
}
